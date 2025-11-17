// AsisteQR - Reports Module with Geolocation

(function() {
  const STORAGE_KEYS = {
    events: 'asisteqr-events',
    students: 'asisteqr-students',
    attendance: 'asisteqr-attendances'
  };

  let allAttendances = [];
  let filteredAttendances = [];
  let map = null;
  let markers = [];

  function init() {
    loadData();
    setupEventListeners();
    loadFilters();
    initMap();
    applyFilters();
    updateStats();
  }

  function loadData() {
    const attendanceJSON = localStorage.getItem(STORAGE_KEYS.attendance);
    allAttendances = attendanceJSON ? JSON.parse(attendanceJSON) : [];
  }

  function setupEventListeners() {
    document.getElementById('filter-event').addEventListener('change', applyFilters);
    document.getElementById('filter-date-from').addEventListener('change', applyFilters);
    document.getElementById('filter-date-to').addEventListener('change', applyFilters);
    document.getElementById('filter-search').addEventListener('input', applyFilters);
    document.getElementById('btn-export-pdf').addEventListener('click', exportPDF);
    document.getElementById('btn-export-excel').addEventListener('click', exportExcel);
  }

  function loadFilters() {
    const eventsJSON = localStorage.getItem(STORAGE_KEYS.events);
    const events = eventsJSON ? JSON.parse(eventsJSON) : [];
    
    const select = document.getElementById('filter-event');
    select.innerHTML = '<option value="">Todos los eventos</option>';
    
    events.forEach(event => {
      const option = document.createElement('option');
      option.value = event.id;
      option.textContent = `${event.nombre} - ${event.fecha}`;
      select.appendChild(option);
    });

    // Don't set default date range - show all data by default
    // Users can set dates if they want to filter
  }

  function applyFilters() {
    const eventFilter = document.getElementById('filter-event').value;
    const dateFrom = document.getElementById('filter-date-from').value;
    const dateTo = document.getElementById('filter-date-to').value;
    const searchTerm = document.getElementById('filter-search').value.toLowerCase();

    filteredAttendances = allAttendances.filter(attendance => {
      // Event filter - only apply if a specific event is selected
      if (eventFilter && eventFilter !== '' && attendance.eventId !== parseInt(eventFilter)) {
        return false;
      }

      // Date filter
      if (dateFrom || dateTo) {
        const attendanceDate = new Date(attendance.timestamp).toISOString().split('T')[0];
        if (dateFrom && attendanceDate < dateFrom) return false;
        if (dateTo && attendanceDate > dateTo) return false;
      }

      // Search filter
      if (searchTerm && searchTerm !== '') {
        const student = getStudent(attendance.studentId);
        const event = getEvent(attendance.eventId);
        
        const searchableText = `
          ${student?.nombre || ''} 
          ${student?.codigo || ''} 
          ${student?.cedula || ''} 
          ${event?.nombre || ''}
        `.toLowerCase();

        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    renderTable();
    updateStats();
  }

  function getStudent(studentId) {
    const studentsJSON = localStorage.getItem(STORAGE_KEYS.students);
    const students = studentsJSON ? JSON.parse(studentsJSON) : [];
    return students.find(s => s.id === studentId);
  }

  function getEvent(eventId) {
    const eventsJSON = localStorage.getItem(STORAGE_KEYS.events);
    const events = eventsJSON ? JSON.parse(eventsJSON) : [];
    return events.find(e => e.id === eventId);
  }

  function renderTable() {
    const tbody = document.getElementById('table-body');
    document.getElementById('record-count').textContent = 
      `${filteredAttendances.length} registro${filteredAttendances.length !== 1 ? 's' : ''}`;

    if (filteredAttendances.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 40px; color: #999;">
            No se encontraron registros con los filtros seleccionados
          </td>
        </tr>
      `;
      updateMapMarkers([]);
      return;
    }

    tbody.innerHTML = filteredAttendances.map(attendance => {
      const student = getStudent(attendance.studentId);
      const event = getEvent(attendance.eventId);
      const date = new Date(attendance.timestamp);
      
      const accuracyClass = attendance.location.accuracy <= 10 
        ? 'accuracy-excellent' 
        : attendance.location.accuracy <= 20 
          ? 'accuracy-good' 
          : 'accuracy-regular';

      return `
        <tr>
          <td><strong>${student?.codigo || 'N/A'}</strong></td>
          <td>${student?.cedula || 'N/A'}</td>
          <td>${student?.nombre || 'N/A'}</td>
          <td>${student?.correo || 'N/A'}</td>
          <td>${student?.carrera || 'N/A'}</td>
          <td>${event?.nombre || 'N/A'}</td>
          <td>
            ${date.toLocaleDateString('es-CO')}<br>
            <small style="color: #999;">${date.toLocaleTimeString('es-CO')}</small>
          </td>
          <td>
            <span class="gps-coords" title="Latitud, Longitud">
              ${attendance.location.lat.toFixed(6)},<br>${attendance.location.lng.toFixed(6)}
            </span>
          </td>
          <td>
            <span class="accuracy-badge ${accuracyClass}">
              ${attendance.location.accuracy}m
            </span>
          </td>
          <td>
            <span class="distance-badge accuracy-excellent">
              ${attendance.location.distance}m
            </span>
          </td>
        </tr>
      `;
    }).join('');

    updateMapMarkers(filteredAttendances);
  }

  function initMap() {
    // Initialize Leaflet map centered on Colombia
    map = L.map('map-view').setView([4.6097, -74.0817], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
  }

  function updateMapMarkers(attendances) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (attendances.length === 0) return;

    const bounds = [];

    attendances.forEach(attendance => {
      const student = getStudent(attendance.studentId);
      const event = getEvent(attendance.eventId);
      const date = new Date(attendance.timestamp);

      // Create custom icon based on accuracy
      const iconColor = attendance.location.accuracy <= 10 ? 'green' : 
                        attendance.location.accuracy <= 20 ? 'orange' : 'red';

      const marker = L.circleMarker(
        [attendance.location.lat, attendance.location.lng],
        {
          radius: 8,
          fillColor: iconColor,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }
      ).addTo(map);

      // Add popup with info
      marker.bindPopup(`
        <div style="font-family: Segoe UI, sans-serif;">
          <strong>${student?.nombre || 'N/A'}</strong><br>
          <small>Código: ${student?.codigo || 'N/A'}</small><br>
          <strong>Evento:</strong> ${event?.nombre || 'N/A'}<br>
          <strong>Fecha:</strong> ${date.toLocaleDateString('es-CO')} ${date.toLocaleTimeString('es-CO')}<br>
          <strong>Precisión GPS:</strong> ${attendance.location.accuracy}m<br>
          <strong>Distancia:</strong> ${attendance.location.distance}m
        </div>
      `);

      markers.push(marker);
      bounds.push([attendance.location.lat, attendance.location.lng]);
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  function updateStats() {
    const uniqueEvents = new Set(filteredAttendances.map(a => a.eventId));
    const uniqueStudents = new Set(filteredAttendances.map(a => a.studentId));
    
    const avgAccuracy = filteredAttendances.length > 0
      ? Math.round(
          filteredAttendances.reduce((sum, a) => sum + a.location.accuracy, 0) / 
          filteredAttendances.length
        )
      : 0;

    document.getElementById('summary-total').textContent = filteredAttendances.length;
    document.getElementById('summary-events').textContent = uniqueEvents.size;
    document.getElementById('summary-students').textContent = uniqueStudents.size;
    document.getElementById('summary-accuracy').textContent = `${avgAccuracy}m`;
  }

  function exportPDF() {
    if (filteredAttendances.length === 0) {
      alert('No hay datos para exportar. Ajusta los filtros primero.');
      return;
    }

    // Simulate PDF generation
    const content = generateReportContent();
    
    alert('📄 Exportación a PDF\n\n' +
          `Se generaría un reporte PDF con ${filteredAttendances.length} registros.\n\n` +
          'El reporte incluiría:\n' +
          '✓ Tabla de asistencias con geolocalización\n' +
          '✓ Estadísticas resumidas\n' +
          '✓ Mapa de ubicaciones\n' +
          '✓ Gráficos de análisis\n\n' +
          'Funcionalidad simulada para demo.');
  }

  function exportExcel() {
    if (filteredAttendances.length === 0) {
      alert('No hay datos para exportar. Ajusta los filtros primero.');
      return;
    }

    // Prepare data for Excel
    const headers = ['Código', 'Cédula', 'Nombre Completo', 'Correo', 'Carrera', 'Semestre', 'Evento', 'Fecha', 'Hora', 'Latitud', 'Longitud', 'Precisión GPS (m)', 'Distancia (m)'];
    
    const rows = filteredAttendances.map(attendance => {
      const student = getStudent(attendance.studentId);
      const event = getEvent(attendance.eventId);
      const date = new Date(attendance.timestamp);
      
      return [
        student?.codigo || '',
        student?.cedula || '',
        student?.nombre || '',
        student?.correo || '',
        student?.carrera || '',
        student?.semestre || '',
        event?.nombre || '',
        date.toLocaleDateString('es-CO'),
        date.toLocaleTimeString('es-CO'),
        attendance.location.lat.toFixed(6),
        attendance.location.lng.toFixed(6),
        attendance.location.accuracy,
        attendance.location.distance
      ];
    });

    // Create worksheet
    const ws_data = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Set column widths
    ws['!cols'] = [
      { wch: 12 },  // Código
      { wch: 12 },  // Cédula
      { wch: 30 },  // Nombre
      { wch: 25 },  // Correo
      { wch: 25 },  // Carrera
      { wch: 10 },  // Semestre
      { wch: 30 },  // Evento
      { wch: 12 },  // Fecha
      { wch: 12 },  // Hora
      { wch: 12 },  // Latitud
      { wch: 12 },  // Longitud
      { wch: 15 },  // Precisión
      { wch: 12 }   // Distancia
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistencias');

    // Generate Excel file
    const fileName = `Reporte_Asistencias_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    alert('✅ Exportación Exitosa\n\nEl archivo Excel (.xlsx) se ha descargado correctamente.');
  }

  function generateReportContent() {
    return filteredAttendances.map(a => {
      const student = getStudent(a.studentId);
      const event = getEvent(a.eventId);
      return {
        student: student,
        event: event,
        attendance: a
      };
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
