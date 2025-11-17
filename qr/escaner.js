// AsisteQR - QR Scanner Module with High-Precision Geolocation

(function() {
  const STORAGE_KEYS = {
    events: 'asisteqr-events',
    students: 'asisteqr-students',
    attendance: 'asisteqr-attendances'
  };

  const MAX_DISTANCE_METERS = 30; // Maximum allowed distance from event location
  
  let currentLocation = null;
  let currentAccuracy = null;
  let selectedEventId = null;
  let watchId = null;

  // Simulated event locations (latitude, longitude)
  const EVENT_LOCATIONS = {
    1: { lat: 4.6097, lng: -74.0817, name: 'Auditorio Central - Campus Norte' },
    2: { lat: 4.6105, lng: -74.0825, name: 'Sala de Innovación 204 - Edificio B' },
    3: { lat: 4.6112, lng: -74.0810, name: 'Laboratorio de Computación - Piso 3' },
    4: { lat: 4.6090, lng: -74.0830, name: 'Auditorio Principal' },
    5: { lat: 4.6100, lng: -74.0820, name: 'Plaza Central - Campus' }
  };

  function init() {
    setupEventListeners();
    requestHighPrecisionLocation();
    updateStats();
  }

  function setupEventListeners() {
    document.getElementById('btn-search-event')?.addEventListener('click', searchEvent);
    document.getElementById('event-code-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchEvent();
    });
    document.getElementById('btn-start-scan').addEventListener('click', startQRScanner);
    document.getElementById('btn-stop-scan')?.addEventListener('click', stopQRScanner);
  }

  function searchEvent() {
    const code = document.getElementById('event-code-input')?.value.trim().toUpperCase();
    
    if (!code) {
      alert('Por favor ingresa un código de evento');
      return;
    }

    const eventsJSON = localStorage.getItem(STORAGE_KEYS.events);
    const events = eventsJSON ? JSON.parse(eventsJSON) : [];
    
    const event = events.find(e => e.codigo === code);
    
    if (!event) {
      alert(`No se encontró ningún evento con el código: ${code}`);
      return;
    }

    selectedEventId = event.id;
    displayEventInfo(event);
    updateStats();
    
    // Check event status and show alert
    const estado = event.estado || 'programado';
    
    if (estado === 'finalizado') {
      alert(`⚠️ Este evento ya ha finalizado.\n\nNo se pueden registrar más asistencias para este evento.`);
    } else if (estado === 'programado') {
      alert(`⚠️ Este evento aún no ha iniciado.\n\nSolo se pueden registrar asistencias en eventos activos.`);
    }
    
    console.log('✅ Evento encontrado:', event);
  }

  function displayEventInfo(event) {
    const eventName = document.getElementById('event-name');
    const eventLocation = document.getElementById('event-location');
    const eventDate = document.getElementById('event-date');
    const eventStatus = document.getElementById('event-status');
    const eventInfo = document.getElementById('event-info');
    
    if (eventName) eventName.textContent = event.nombre;
    if (eventLocation) eventLocation.textContent = event.lugar;
    if (eventDate) eventDate.textContent = new Date(event.fecha).toLocaleDateString('es-CO');
    
    if (eventStatus) {
      const estado = event.estado || 'programado';
      const estadoConfig = {
        'programado': { text: 'Programado', class: 'status-programado' },
        'activo': { text: 'Activo', class: 'status-activo' },
        'finalizado': { text: 'Finalizado', class: 'status-finalizado' }
      };
      const statusInfo = estadoConfig[estado] || estadoConfig['programado'];
      eventStatus.textContent = statusInfo.text;
      eventStatus.className = 'event-status-badge ' + statusInfo.class;
    }
    
    if (eventInfo) eventInfo.style.display = 'grid';
  }

  let html5QrCode = null;
  let isScanning = false;

  async function startQRScanner() {
    if (!selectedEventId) {
      alert('Por favor busca y selecciona un evento primero');
      return;
    }

    // Validate event status
    const eventsJSON = localStorage.getItem(STORAGE_KEYS.events);
    const events = eventsJSON ? JSON.parse(eventsJSON) : [];
    const event = events.find(e => e.id === selectedEventId);
    
    if (event) {
      const estado = event.estado || 'programado';
      
      if (estado === 'finalizado') {
        alert('⚠️ Este evento ya ha finalizado. No se puede iniciar el escaneo.');
        return;
      }
      
      if (estado === 'programado') {
        alert('⚠️ Este evento aún no ha iniciado. Solo eventos activos permiten registro.');
        return;
      }
    }

    if (!currentLocation) {
      alert('Esperando señal GPS. Por favor espera unos segundos.');
      return;
    }

    try {
      const scannerPlaceholder = document.querySelector('.scanner-placeholder');
      const qrReaderDiv = document.getElementById('qr-reader');
      const btnStart = document.getElementById('btn-start-scan');
      const btnStop = document.getElementById('btn-stop-scan');

      if (scannerPlaceholder) scannerPlaceholder.style.display = 'none';
      if (qrReaderDiv) qrReaderDiv.style.display = 'block';
      if (btnStart) btnStart.style.display = 'none';
      if (btnStop) btnStop.style.display = 'inline-flex';

      html5QrCode = new Html5Qrcode("qr-reader");
      
      await html5QrCode.start(
        { facingMode: "environment" },
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        onScanSuccess,
        () => {}
      );

      isScanning = true;
      console.log('📷 Escáner QR iniciado');
      
    } catch (err) {
      console.error('Error al iniciar escáner:', err);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
      resetScanner();
    }
  }

  async function stopQRScanner() {
    if (html5QrCode && isScanning) {
      try {
        await html5QrCode.stop();
        document.getElementById('qr-reader').innerHTML = '';
      } catch (err) {
        console.error('Error:', err);
      }
    }
    resetScanner();
  }

  function resetScanner() {
    const scannerPlaceholder = document.querySelector('.scanner-placeholder');
    const qrReaderDiv = document.getElementById('qr-reader');
    const btnStart = document.getElementById('btn-start-scan');
    const btnStop = document.getElementById('btn-stop-scan');

    if (scannerPlaceholder) scannerPlaceholder.style.display = 'flex';
    if (qrReaderDiv) {
      qrReaderDiv.style.display = 'none';
      qrReaderDiv.innerHTML = '';
    }
    if (btnStart) btnStart.style.display = 'inline-flex';
    if (btnStop) btnStop.style.display = 'none';
    
    html5QrCode = null;
    isScanning = false;
  }

  function onScanSuccess(decodedText) {
    console.log('✅ QR escaneado:', decodedText);
    stopQRScanner();
    processQRCode(decodedText);
  }

  function processQRCode(qrCode) {
    const studentsJSON = localStorage.getItem(STORAGE_KEYS.students);
    const students = studentsJSON ? JSON.parse(studentsJSON) : [];
    const student = students.find(s => s.codigo === qrCode || s.qrCode === qrCode);

    if (!student) {
      showResult('error', 'QR No Válido', `Código no encontrado: ${qrCode}`);
      return;
    }

    const locationValidation = validateLocation(selectedEventId);
    
    if (!locationValidation.valid) {
      showResult('error', 'Ubicación Inválida', locationValidation.message);
      return;
    }

    const attendancesJSON = localStorage.getItem(STORAGE_KEYS.attendance);
    const attendances = attendancesJSON ? JSON.parse(attendancesJSON) : [];
    
    if (attendances.find(a => a.eventId === selectedEventId && a.studentId === student.id)) {
      showResult('warning', 'Ya Registrado', `${student.nombre} ya está registrado`);
      displayStudentInfo(student, selectedEventId, locationValidation.distance);
      return;
    }

    const attendance = {
      id: Date.now(),
      eventId: selectedEventId,
      studentId: student.id,
      timestamp: new Date().toISOString(),
      location: {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        accuracy: currentAccuracy,
        distance: locationValidation.distance
      }
    };

    attendances.push(attendance);
    localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(attendances));

    showResult('success', 'Asistencia Registrada', `${student.nombre} registrado exitosamente`);
    displayStudentInfo(student, selectedEventId, locationValidation.distance);
    updateStats();

    // Auto-restart scanner after 2 seconds
    setTimeout(() => {
      startQRScanner();
    }, 2000);
  }

  function simulateScan() {
    alert('Usa el botón "Iniciar Escaneo" para activar la cámara y escanear códigos QR reales');
  }

  // High-precision geolocation with continuous tracking
  function requestHighPrecisionLocation() {
    const locationStatus = document.getElementById('location-status');
    const gpsAccuracy = document.getElementById('gps-accuracy');
    
    if (!navigator.geolocation) {
      showLocationError('Geolocalización no disponible en este navegador');
      return;
    }

    // Check if we're on HTTPS or localhost (required for geolocation)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      showLocationError('Se requiere HTTPS para geolocalización precisa');
      return;
    }

    locationStatus.classList.add('checking');
    locationStatus.querySelector('span').textContent = 'Solicitando permisos de ubicación...';

    // Enhanced options for maximum precision
    const options = {
      enableHighAccuracy: true,  // Request GPS instead of WiFi/cell tower
      timeout: 30000,            // Increased timeout to allow GPS lock
      maximumAge: 0              // Always request fresh position, no cache
    };

    // First, get an initial position with longer timeout
    navigator.geolocation.getCurrentPosition(
      (position) => {
        locationStatus.querySelector('span').textContent = 'Mejorando precisión GPS...';
        
        // Update immediately with first reading
        updateLocation(position);
        
        // Then start continuous tracking for improved accuracy
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            updateLocation(position);
          },
          (error) => {
            console.error('Geolocation watch error:', error);
            showLocationError(getLocationErrorMessage(error));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      },
      (error) => {
        console.error('Initial geolocation error:', error);
        showLocationError(getLocationErrorMessage(error));
      },
      options
    );
  }

  function updateLocation(position) {
    const locationStatus = document.getElementById('location-status');
    const gpsAccuracy = document.getElementById('gps-accuracy');

    // Store location data
    currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };
    
    currentAccuracy = Math.round(position.coords.accuracy);
    
    // Update UI
    locationStatus.classList.remove('checking', 'error');
    
    // Show different messages based on accuracy
    if (currentAccuracy <= 10) {
      locationStatus.querySelector('span').textContent = `GPS de Alta Precisión Activo`;
    } else if (currentAccuracy <= 30) {
      locationStatus.querySelector('span').textContent = `GPS Activo - Mejorando precisión...`;
    } else {
      locationStatus.querySelector('span').textContent = `GPS Activo - Precisión limitada`;
    }
    
    // Enhanced accuracy display
    let accuracyText, accuracyClass;
    if (currentAccuracy <= 15) {
      accuracyText = `${currentAccuracy}m (⭐ Excelente)`;
      accuracyClass = '#107C10';
    } else if (currentAccuracy <= 30) {
      accuracyText = `${currentAccuracy}m (✓ Buena)`;
      accuracyClass = '#00B294';
    } else if (currentAccuracy <= 60) {
      accuracyText = `${currentAccuracy}m (⚠ Aceptable)`;
      accuracyClass = '#F7630C';
    } else {
      accuracyText = `${currentAccuracy}m (⚠ Baja - Espere...)`;
      accuracyClass = '#D13438';
    }
    
    gpsAccuracy.textContent = accuracyText;
    gpsAccuracy.style.color = accuracyClass;

    // Log for debugging
    console.log('📍 Ubicación actualizada:', {
      lat: currentLocation.lat.toFixed(6),
      lng: currentLocation.lng.toFixed(6),
      accuracy: `${currentAccuracy}m`,
      altitude: position.coords.altitude ? `${Math.round(position.coords.altitude)}m` : 'N/A'
    });
  }

  function showLocationError(message) {
    const locationStatus = document.getElementById('location-status');
    const gpsAccuracy = document.getElementById('gps-accuracy');
    
    locationStatus.classList.add('error');
    locationStatus.classList.remove('checking');
    locationStatus.querySelector('span').textContent = message;
    gpsAccuracy.textContent = 'No disponible';

    // Show helpful tips
    console.warn('💡 Consejos para mejorar la precisión GPS:');
    console.warn('1. Asegúrate de estar en exteriores o cerca de una ventana');
    console.warn('2. Permite los permisos de ubicación en tu navegador');
    console.warn('3. Activa el GPS en la configuración de tu dispositivo');
    console.warn('4. Espera unos segundos para que el GPS obtenga señal de satélites');
    console.warn('5. Usa Chrome o Safari para mejor compatibilidad');
  }

  function getLocationErrorMessage(error) {
    let message = '';
    let tip = '';
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message = 'Permiso de ubicación denegado';
        tip = 'Ve a la configuración del navegador y permite el acceso a la ubicación';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Señal GPS no disponible';
        tip = 'Intenta moverte a un área con mejor señal o cerca de una ventana';
        break;
      case error.TIMEOUT:
        message = 'Tiempo de espera agotado';
        tip = 'El GPS está tardando en obtener señal. Espera unos segundos y recarga la página';
        break;
      default:
        message = 'Error de ubicación';
        tip = 'Verifica que el GPS esté activado en tu dispositivo';
    }
    
    console.error('❌ Error GPS:', message);
    console.info('💡 Solución:', tip);
    
    return message;
  }

  // Calculate distance between two coordinates (Haversine formula)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  function validateLocation(eventId) {
    if (!currentLocation) {
      return { 
        valid: false, 
        message: 'Ubicación GPS no disponible. Por favor espera a que se active el GPS.' 
      };
    }

    // More lenient accuracy check, but warn user
    if (currentAccuracy > 100) {
      return { 
        valid: false, 
        message: `Precisión GPS muy baja (${currentAccuracy}m). Por favor espera a que mejore la señal o muévete a un área abierta.` 
      };
    }

    if (currentAccuracy > MAX_DISTANCE_METERS * 3) {
      console.warn(`⚠️ Precisión GPS baja: ${currentAccuracy}m (se recomienda <30m)`);
    }

    // Get event from storage to check for GPS location
    const eventsJSON = localStorage.getItem(STORAGE_KEYS.events);
    const events = eventsJSON ? JSON.parse(eventsJSON) : [];
    const event = events.find(e => e.id === eventId);

    let eventLocation = null;

    // First check if event has GPS coordinates stored
    if (event && event.gpsLocation) {
      eventLocation = {
        lat: event.gpsLocation.lat,
        lng: event.gpsLocation.lng,
        name: event.lugar
      };
      console.log('📍 Usando coordenadas GPS del evento:', eventLocation);
    } else {
      // Fallback to simulated locations
      eventLocation = EVENT_LOCATIONS[eventId];
      if (eventLocation) {
        console.log('📍 Usando coordenadas simuladas:', eventLocation);
      }
    }

    if (!eventLocation) {
      console.warn('⚠️ No hay ubicación GPS definida para este evento. Permitiendo asistencia sin validación de distancia.');
      return { valid: true, distance: 0 }; // Allow if no location defined
    }

    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      eventLocation.lat,
      eventLocation.lng
    );

    console.log(`📏 Distancia calculada: ${Math.round(distance)}m (máximo permitido: ${MAX_DISTANCE_METERS}m)`);

    if (distance > MAX_DISTANCE_METERS) {
      return {
        valid: false,
        message: `Estás a ${Math.round(distance)}m del evento. Debes estar dentro de ${MAX_DISTANCE_METERS}m.`,
        distance: Math.round(distance)
      };
    }

    return { valid: true, distance: Math.round(distance) };
  }

  function simulateScan() {
    if (!selectedEventId) {
      showResult(false, 'Error', 'Por favor selecciona un evento primero');
      return;
    }

    if (!currentLocation) {
      showResult(false, 'Error', 'Esperando ubicación GPS. Intenta nuevamente en unos segundos.');
      return;
    }

    const scannerContainer = document.getElementById('scanner-container');
    scannerContainer.classList.add('active');

    // Simulate QR scan delay
    setTimeout(() => {
      scannerContainer.classList.remove('active');
      
      // Get random student
      const studentsJSON = localStorage.getItem(STORAGE_KEYS.students);
      const students = studentsJSON ? JSON.parse(studentsJSON) : [];
      
      if (students.length === 0) {
        showResult(false, 'Error', 'No hay estudiantes registrados');
        return;
      }

      const student = students[Math.floor(Math.random() * students.length)];
      
      // Validate location
      const locationCheck = validateLocation(selectedEventId);
      
      if (!locationCheck.valid) {
        showResult(false, 'Ubicación Inválida', locationCheck.message);
        return;
      }

      // Check if already registered
      const attendanceJSON = localStorage.getItem(STORAGE_KEYS.attendance);
      const attendances = attendanceJSON ? JSON.parse(attendanceJSON) : [];
      
      const alreadyRegistered = attendances.some(
        a => a.studentId === student.id && a.eventId === selectedEventId
      );

      if (alreadyRegistered) {
        showResult(false, 'Ya Registrado', `${student.nombre} ya registró asistencia a este evento`);
        return;
      }

      // Register attendance with precise geolocation
      const attendance = {
        id: Date.now(),
        studentId: student.id,
        eventId: selectedEventId,
        timestamp: new Date().toISOString(),
        location: {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          accuracy: currentAccuracy,
          distance: locationCheck.distance
        }
      };

      attendances.push(attendance);
      localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(attendances));

      // Show success
      const eventsJSON = localStorage.getItem(STORAGE_KEYS.events);
      const events = eventsJSON ? JSON.parse(eventsJSON) : [];
      const event = events.find(e => e.id === selectedEventId);

      showResult(true, '¡Asistencia Confirmada!', 'Registro exitoso con verificación GPS', {
        student,
        event,
        attendance
      });

      updateStats();
    }, 1500);
  }

  function showResult(success, title, message, data = null) {
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const studentInfo = document.getElementById('student-info');

    // Update icon
    resultIcon.className = 'result-icon ' + (success ? 'success' : 'error');
    resultIcon.innerHTML = success 
      ? `<svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="4" fill="none"/>
          <path d="M20 32l8 8 16-16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        </svg>`
      : `<svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="4" fill="none"/>
          <path d="M24 24l16 16M40 24L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        </svg>`;

    resultTitle.textContent = title;
    resultMessage.textContent = message;

    if (success && data) {
      document.getElementById('student-name').textContent = 
        `${data.student.nombre} ${data.student.apellido}`;
      document.getElementById('student-id').textContent = data.student.id;
      document.getElementById('student-career').textContent = data.student.carrera;
      document.getElementById('event-name').textContent = data.event.nombre;
      document.getElementById('location-coords').textContent = 
        `${data.attendance.location.lat.toFixed(6)}, ${data.attendance.location.lng.toFixed(6)}`;
      document.getElementById('location-precision').textContent = 
        `${data.attendance.location.accuracy}m (${data.attendance.location.distance}m del evento)`;
      document.getElementById('attendance-time').textContent = 
        new Date(data.attendance.timestamp).toLocaleString('es-CO');
      
      studentInfo.style.display = 'block';
    } else {
      studentInfo.style.display = 'none';
    }

    // Animate result card
    const resultCard = document.getElementById('result-card');
    resultCard.style.animation = 'none';
    setTimeout(() => {
      resultCard.style.animation = 'slideIn 0.4s ease-out';
    }, 10);
  }

  function updateStats() {
    const attendanceJSON = localStorage.getItem(STORAGE_KEYS.attendance);
    const attendances = attendanceJSON ? JSON.parse(attendanceJSON) : [];

    const today = new Date().toISOString().split('T')[0];
    const todayAttendances = attendances.filter(a => {
      const dateStr = a.timestamp || a.fecha || '';
      return dateStr.startsWith(today);
    });

    // Count active events
    const eventsJSON = localStorage.getItem(STORAGE_KEYS.events);
    const events = eventsJSON ? JSON.parse(eventsJSON) : [];
    const activeEvents = events.filter(e => (e.estado || 'activo') === 'activo').length;

    const todayElement = document.getElementById('stat-today');
    const eventElement = document.getElementById('stat-event');
    const totalElement = document.getElementById('stat-total');

    if (todayElement) todayElement.textContent = todayAttendances.length;
    if (eventElement) eventElement.textContent = activeEvents;
    if (totalElement) totalElement.textContent = attendances.length;
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
  });

  document.addEventListener('DOMContentLoaded', init);
})();
