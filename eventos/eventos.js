// AsisteQR - Events Management Module

(function() {
  const STORAGE_KEYS = {
    events: 'asisteqr-events',
    eventSeq: 'asisteqr-event-seq',
    attendance: 'asisteqr-attendances'
  };

  let currentEditingId = null;
  let allEvents = [];
  let capturedGPS = null;
  let leafletMap = null;
  let mapMarker = null;
  let selectedMapLocation = null;

  // Bogotá, Colombia as default center
  const DEFAULT_CENTER = { lat: 4.6097, lng: -74.0817 };

  function init() {
    loadEvents();
    setupEventListeners();
    updateEventStatuses();
    updateStats();
    renderEvents();
    
    // Update statuses every minute
    setInterval(() => {
      if (updateEventStatuses()) {
        updateStats();
        renderEvents();
      }
    }, 60000);
  }

  function loadEvents() {
    const eventsJSON = localStorage.getItem(STORAGE_KEYS.events);
    allEvents = eventsJSON ? JSON.parse(eventsJSON) : [];
  }

  function setupEventListeners() {
    document.getElementById('btn-new-event').addEventListener('click', openNewEventModal);
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel').addEventListener('click', closeModal);
    document.getElementById('event-form').addEventListener('submit', handleSubmit);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('filter-status').addEventListener('change', handleFilterChange);
    document.getElementById('btn-capture-gps').addEventListener('click', captureGPSLocation);
    document.getElementById('btn-select-map').addEventListener('click', openMapModal);
    document.getElementById('btn-close-map').addEventListener('click', closeMapModal);
    document.getElementById('btn-cancel-map').addEventListener('click', closeMapModal);
    document.getElementById('btn-confirm-map').addEventListener('click', confirmMapLocation);
  }

  function openNewEventModal() {
    currentEditingId = null;
    capturedGPS = null;
    document.getElementById('modal-title').textContent = 'Nuevo Evento';
    document.getElementById('event-form').reset();
    document.getElementById('event-gps').value = '';
    document.getElementById('gps-help').textContent = 'Presiona el botón para capturar las coordenadas GPS de la ubicación del evento';
    document.getElementById('gps-help').className = 'gps-help';
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('event-date').value = today;
    
    document.getElementById('event-modal').classList.add('active');
  }

  function openEditEventModal(eventId) {
    currentEditingId = eventId;
    const event = allEvents.find(e => e.id === eventId);
    
    if (!event) return;

    document.getElementById('modal-title').textContent = 'Editar Evento';
    document.getElementById('event-name').value = event.nombre;
    document.getElementById('event-description').value = event.descripcion;
    document.getElementById('event-date').value = event.fecha;
    document.getElementById('event-time-start').value = event.horaInicio || '09:00';
    document.getElementById('event-time-end').value = event.horaFin || '17:00';
    document.getElementById('event-location').value = event.lugar;
    document.getElementById('event-capacity').value = event.cupos || 100;
    
    // Load GPS coordinates if available
    if (event.gpsLocation) {
      capturedGPS = event.gpsLocation;
      document.getElementById('event-gps').value = `${event.gpsLocation.lat.toFixed(6)}, ${event.gpsLocation.lng.toFixed(6)}`;
      document.getElementById('gps-help').textContent = `✓ Coordenadas guardadas (Precisión: ${event.gpsLocation.accuracy}m)`;
      document.getElementById('gps-help').className = 'gps-help success';
    } else {
      capturedGPS = null;
      document.getElementById('event-gps').value = '';
      document.getElementById('gps-help').textContent = 'No hay coordenadas GPS registradas para este evento';
      document.getElementById('gps-help').className = 'gps-help';
    }
    
    document.getElementById('event-modal').classList.add('active');
  }

  function captureGPSLocation() {
    const btn = document.getElementById('btn-capture-gps');
    const input = document.getElementById('event-gps');
    const help = document.getElementById('gps-help');

    if (!navigator.geolocation) {
      help.textContent = '❌ Tu navegador no soporta geolocalización';
      help.className = 'gps-help error';
      return;
    }

    // Show loading state
    btn.classList.add('loading');
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite;">
        <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="15 10"/>
      </svg>
      Obteniendo ubicación...
    `;
    help.textContent = 'Esperando señal GPS... Esto puede tomar unos segundos';
    help.className = 'gps-help';

    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        capturedGPS = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy)
        };

        input.value = `${capturedGPS.lat.toFixed(6)}, ${capturedGPS.lng.toFixed(6)}`;
        help.textContent = `✓ Ubicación capturada exitosamente (Precisión: ${capturedGPS.accuracy}m)`;
        help.className = 'gps-help success';

        // Restore button
        btn.classList.remove('loading');
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
            <circle cx="10" cy="10" r="2" fill="currentColor"/>
            <path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke="currentColor" stroke-width="2"/>
          </svg>
          Ubicación Capturada ✓
        `;

        console.log('📍 Coordenadas del evento capturadas:', capturedGPS);
      },
      (error) => {
        let errorMsg = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '❌ Permiso de ubicación denegado. Por favor permite el acceso.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = '❌ No se puede obtener la ubicación. Intenta en exteriores.';
            break;
          case error.TIMEOUT:
            errorMsg = '❌ Tiempo agotado. Intenta nuevamente.';
            break;
          default:
            errorMsg = '❌ Error al obtener ubicación.';
        }
        
        help.textContent = errorMsg;
        help.className = 'gps-help error';

        // Restore button
        btn.classList.remove('loading');
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
            <circle cx="10" cy="10" r="2" fill="currentColor"/>
            <path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke="currentColor" stroke-width="2"/>
          </svg>
          Capturar Ubicación Actual
        `;

        console.error('Error capturando GPS:', error);
      },
      options
    );
  }

  function openMapModal() {
    selectedMapLocation = null;
    document.getElementById('map-lat').textContent = '-';
    document.getElementById('map-lng').textContent = '-';
    document.getElementById('btn-confirm-map').disabled = true;
    
    const modal = document.getElementById('map-modal');
    modal.classList.add('active');
    
    // Initialize map
    setTimeout(() => {
      initializeMap();
    }, 100);
  }

  function closeMapModal() {
    const modal = document.getElementById('map-modal');
    modal.classList.remove('active');
    
    // Clean up Leaflet map
    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
      mapMarker = null;
    }
  }

  function initializeMap() {
    const container = document.getElementById('map-container');
    container.innerHTML = '';
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column; gap: 16px;">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="25" stroke="#0078D4" stroke-width="2" fill="none" stroke-dasharray="5 5">
              <animateTransform attributeName="transform" type="rotate" from="0 30 30" to="360 30 30" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <div style="color: #666; font-size: 14px;">Cargando mapa...</div>
        </div>
      `;
      setTimeout(() => {
        if (document.getElementById('map-modal').classList.contains('active')) {
          initializeMap();
        }
      }, 500);
      return;
    }

    // Get initial center
    let initialCenter = [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
    if (capturedGPS) {
      initialCenter = [capturedGPS.lat, capturedGPS.lng];
    }

    // Create Leaflet map with OpenStreetMap tiles (free, no API key needed)
    leafletMap = L.map(container, {
      center: initialCenter,
      zoom: 16,
      zoomControl: true,
      attributionControl: true
    });

    // Add OpenStreetMap tiles (completely free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(leafletMap);

    // Custom red marker icon
    const redIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));">
          <path d="M20 2c-6.627 0-12 5.373-12 12 0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" 
                fill="#D13438" stroke="white" stroke-width="2"/>
          <circle cx="20" cy="14" r="4" fill="white"/>
        </svg>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Add initial marker
    mapMarker = L.marker(initialCenter, {
      icon: redIcon,
      draggable: true
    }).addTo(leafletMap);

    // Set initial location
    selectedMapLocation = {
      lat: parseFloat(initialCenter[0].toFixed(6)),
      lng: parseFloat(initialCenter[1].toFixed(6)),
      accuracy: 10
    };
    
    updateMapCoordinatesDisplay(selectedMapLocation);
    document.getElementById('btn-confirm-map').disabled = false;

    // Click on map to move marker
    leafletMap.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      selectedMapLocation = {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        accuracy: 10
      };
      
      mapMarker.setLatLng([lat, lng]);
      updateMapCoordinatesDisplay(selectedMapLocation);
      
      console.log('📍 Ubicación seleccionada en mapa:', selectedMapLocation);
    });

    // Drag marker
    mapMarker.on('dragend', (e) => {
      const position = mapMarker.getLatLng();
      
      selectedMapLocation = {
        lat: parseFloat(position.lat.toFixed(6)),
        lng: parseFloat(position.lng.toFixed(6)),
        accuracy: 10
      };
      
      updateMapCoordinatesDisplay(selectedMapLocation);
      
      console.log('📍 Marcador arrastrado a:', selectedMapLocation);
    });

    // Try to center on user's location
    if (navigator.geolocation && !capturedGPS) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.latitude, position.coords.longitude];
          leafletMap.setView(userLocation, 16);
          mapMarker.setLatLng(userLocation);
          
          selectedMapLocation = {
            lat: parseFloat(position.coords.latitude.toFixed(6)),
            lng: parseFloat(position.coords.longitude.toFixed(6)),
            accuracy: 10
          };
          
          updateMapCoordinatesDisplay(selectedMapLocation);
          
          console.log('📍 Mapa centrado en ubicación actual:', selectedMapLocation);
        },
        (error) => {
          console.log('Usando ubicación por defecto (Bogotá)');
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    }

    // Fix map rendering after modal animation
    setTimeout(() => {
      leafletMap.invalidateSize();
    }, 100);
  }

  function updateMapCoordinatesDisplay(location) {
    document.getElementById('map-lat').textContent = location.lat.toFixed(6);
    document.getElementById('map-lng').textContent = location.lng.toFixed(6);
  }

  function confirmMapLocation() {
    if (!selectedMapLocation) return;
    
    capturedGPS = selectedMapLocation;
    
    const input = document.getElementById('event-gps');
    const help = document.getElementById('gps-help');
    
    input.value = `${capturedGPS.lat.toFixed(6)}, ${capturedGPS.lng.toFixed(6)}`;
    help.textContent = `✓ Ubicación seleccionada en el mapa (Precisión: ${capturedGPS.accuracy}m)`;
    help.className = 'gps-help success';
    
    closeMapModal();
    
    console.log('✅ Ubicación del evento confirmada:', capturedGPS);
  }

  function closeModal() {
    document.getElementById('event-modal').classList.remove('active');
    currentEditingId = null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
      nombre: document.getElementById('event-name').value.trim(),
      descripcion: document.getElementById('event-description').value.trim(),
      fecha: document.getElementById('event-date').value,
      horaInicio: document.getElementById('event-time-start').value,
      horaFin: document.getElementById('event-time-end').value,
      lugar: document.getElementById('event-location').value.trim(),
      cupos: parseInt(document.getElementById('event-capacity').value) || 100,
      gpsLocation: capturedGPS // Add GPS location
    };

    if (currentEditingId) {
      // Update existing event
      const index = allEvents.findIndex(e => e.id === currentEditingId);
      if (index !== -1) {
        allEvents[index] = { ...allEvents[index], ...formData };
      }
    } else {
      // Create new event
      const seqJSON = localStorage.getItem(STORAGE_KEYS.eventSeq);
      const nextId = seqJSON ? parseInt(seqJSON) : allEvents.length + 1;
      
      const newEvent = {
        id: nextId,
        ...formData,
        codigo: `EVT-2025-${String(nextId).padStart(3, '0')}`,
        estado: 'programado' // Estado inicial: programado
      };

      allEvents.push(newEvent);
      localStorage.setItem(STORAGE_KEYS.eventSeq, String(nextId + 1));
    }

    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(allEvents));
    
    closeModal();
    renderEvents();
    updateStats();
  }

  function deleteEvent(eventId) {
    if (!confirm('¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.')) {
      return;
    }

    allEvents = allEvents.filter(e => e.id !== eventId);
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(allEvents));
    
    renderEvents();
    updateStats();
  }

  function getEventAutoStatus(event) {
    const now = new Date();
    // Parse date correctly to avoid timezone issues
    const [year, month, day] = event.fecha.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const [startHour, startMin] = (event.horaInicio || '00:00').split(':').map(Number);
    const [endHour, endMin] = (event.horaFin || '23:59').split(':').map(Number);
    
    // Set event start and end times
    const eventStart = new Date(year, month - 1, day, startHour, startMin, 0, 0);
    const eventEnd = new Date(year, month - 1, day, endHour, endMin, 0, 0);
    
    // 1 hour after event ends
    const finalizeTime = new Date(eventEnd);
    finalizeTime.setHours(finalizeTime.getHours() + 1);
    
    // Determine automatic status
    if (now < eventStart) {
      return 'programado'; // Before event starts
    } else if (now >= eventStart && now <= finalizeTime) {
      return 'activo'; // During event or up to 1 hour after
    } else {
      return 'finalizado'; // More than 1 hour after event ended
    }
  }

  function updateEventStatuses() {
    let updated = false;
    
    allEvents.forEach(event => {
      const autoStatus = getEventAutoStatus(event);
      
      // Only update if event doesn't have manual override
      // or if auto status should take precedence
      if (!event.manualStatus) {
        if (event.estado !== autoStatus) {
          event.estado = autoStatus;
          updated = true;
        }
      }
    });
    
    if (updated) {
      localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(allEvents));
    }
    
    return updated;
  }

  function toggleEventStatus(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    const currentStatus = event.estado || 'programado';
    let newStatus;
    
    // Cycle through states: programado -> activo -> finalizado -> programado
    if (currentStatus === 'programado') {
      newStatus = 'activo';
    } else if (currentStatus === 'activo') {
      newStatus = 'finalizado';
    } else {
      newStatus = 'programado';
    }
    
    const statusNames = {
      'programado': 'Programado',
      'activo': 'Activo',
      'finalizado': 'Finalizado'
    };
    
    if (!confirm(`¿Cambiar estado a "${statusNames[newStatus]}" para el evento "${event.nombre}"?`)) {
      return;
    }

    event.estado = newStatus;
    event.manualStatus = true; // Mark as manually set
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(allEvents));
    
    renderEvents();
    updateStats();
  }

  function renderEvents() {
    const grid = document.getElementById('events-grid');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterStatus = document.getElementById('filter-status').value;
    
    // Update automatic statuses first
    updateEventStatuses();
    
    let filteredEvents = allEvents.filter(event => {
      const matchesSearch = event.nombre.toLowerCase().includes(searchTerm) ||
                           event.descripcion.toLowerCase().includes(searchTerm) ||
                           event.lugar.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;

      const estado = event.estado || 'programado';
      if (filterStatus === 'programado') {
        return estado === 'programado';
      } else if (filterStatus === 'activo') {
        return estado === 'activo';
      } else if (filterStatus === 'finalizado') {
        return estado === 'finalizado';
      }

      return true;
    });

    if (filteredEvents.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style="opacity: 0.3; margin-bottom: 20px;">
            <rect x="30" y="40" width="60" height="60" rx="4" stroke="#666" stroke-width="3" fill="none"/>
            <path d="M45 30v20M75 30v20M30 60h60" stroke="#666" stroke-width="3"/>
          </svg>
          <h3 style="color: #666; margin-bottom: 8px;">No se encontraron eventos</h3>
          <p style="color: #999;">Intenta ajustar los filtros o crea un nuevo evento</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredEvents.map(event => {
      const attendance = getEventAttendance(event.id);
      // Parse date correctly to avoid timezone issues
      const [year, month, day] = event.fecha.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);
      const formattedDate = eventDate.toLocaleDateString('es-CO', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const estado = event.estado || 'programado';
      const estadoConfig = {
        'programado': { text: 'Programado', class: 'status-programado', color: '#0078D4' },
        'activo': { text: 'Activo', class: 'status-activo', color: '#107C10' },
        'finalizado': { text: 'Finalizado', class: 'status-finalizado', color: '#999' }
      };
      const statusInfo = estadoConfig[estado] || estadoConfig['programado'];

      return `
        <div class="event-card">
          <div class="event-header">
            <div>
              <span class="event-status-badge ${statusInfo.class}">${statusInfo.text}</span>
              <span class="event-code">${event.codigo}</span>
            </div>
            <div class="event-actions">
              <button class="btn-icon btn-status" onclick="eventModule.toggleStatus(${event.id})" title="Cambiar estado" style="color: ${statusInfo.color};">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M8 4v4l3 2" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              <button class="btn-icon" onclick="eventModule.editEvent(${event.id})" title="Editar">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </button>
              <button class="btn-icon" onclick="eventModule.deleteEvent(${event.id})" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
          
          <h3 class="event-title">${event.nombre}</h3>
          <p class="event-description">${event.descripcion}</p>
          
          <div class="event-details">
            <div class="event-detail">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="4" width="12" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M6 2v4M12 2v4M3 8h12" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>${formattedDate}</span>
            </div>
            
            <div class="event-detail">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 5v4l3 2" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>${event.horaInicio || '09:00'} - ${event.horaFin || '17:00'}</span>
            </div>
            
            <div class="event-detail">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1v0c-3 0-5 2-5 5 0 4 5 10 5 10s5-6 5-10c0-3-2-5-5-5z" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="9" cy="6" r="2" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <span>${event.lugar}</span>
            </div>
            
            <div class="event-detail">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="13" cy="9" r="2" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="5" cy="13" r="2.5" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <span><strong>Cupos:</strong> ${event.cupos || 100}</span>
            </div>
          </div>
          
          <div class="event-footer">
            <div class="attendance-count">
              <strong>${attendance}</strong> asistencias
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getEventAttendance(eventId) {
    const attendanceJSON = localStorage.getItem(STORAGE_KEYS.attendance);
    const attendances = attendanceJSON ? JSON.parse(attendanceJSON) : [];
    return attendances.filter(a => a.eventId === eventId).length;
  }

  function handleSearch() {
    renderEvents();
  }

  function handleFilterChange() {
    renderEvents();
  }

  function updateStats() {
    const attendanceJSON = localStorage.getItem(STORAGE_KEYS.attendance);
    const attendances = attendanceJSON ? JSON.parse(attendanceJSON) : [];

    // Count events by status
    const programadoEvents = allEvents.filter(e => (e.estado || 'programado') === 'programado').length;
    const activeEvents = allEvents.filter(e => (e.estado || 'programado') === 'activo').length;
    const finalizadoEvents = allEvents.filter(e => (e.estado || 'programado') === 'finalizado').length;

    document.getElementById('stat-total-events').textContent = allEvents.length;
    document.getElementById('stat-programado-events').textContent = programadoEvents;
    document.getElementById('stat-active-events').textContent = activeEvents;
    document.getElementById('stat-finalizado-events').textContent = finalizadoEvents;
    document.getElementById('stat-total-attendance').textContent = attendances.length;
  }

  // Expose functions to global scope for inline event handlers
  window.eventModule = {
    editEvent: openEditEventModal,
    deleteEvent: deleteEvent,
    toggleStatus: toggleEventStatus
  };

  document.addEventListener('DOMContentLoaded', init);
})();
