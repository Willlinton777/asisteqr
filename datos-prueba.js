// AsisteQR - Datos de Prueba
// INSTRUCCIONES: 
// 1. Abre cualquier módulo del sistema en el navegador (por ejemplo, eventos.html)
// 2. Abre la consola del navegador (F12)
// 3. Copia y pega todo este archivo en la consola y presiona Enter
// 4. Los datos se cargarán automáticamente
// 5. Comandos disponibles:
//    - cargarDatosPrueba() : Vuelve a cargar los datos
//    - limpiarDatos() : Elimina todos los datos

(function() {
  
  window.cargarDatosPrueba = function() {
    console.log('🚀 Iniciando carga de datos de prueba...');

  // Generar 10 estudiantes
  const estudiantes = [
    {
      id: 1,
      cedula: '1001234567',
      codigo: 'JMRG567',
      primerNombre: 'Juan',
      segundoNombre: 'Manuel',
      primerApellido: 'Rodríguez',
      segundoApellido: 'García',
      nombre: 'Juan Manuel Rodríguez García',
      correo: 'juan.rodriguez@universidad.edu.co',
      carrera: 'Ingeniería de Sistemas',
      semestre: '8',
      fechaRegistro: '2025-01-15T10:30:00',
      qrCode: 'JMRG567'
    },
    {
      id: 2,
      cedula: '1001234890',
      codigo: 'MALM890',
      primerNombre: 'María',
      segundoNombre: 'Andrea',
      primerApellido: 'López',
      segundoApellido: 'Martínez',
      nombre: 'María Andrea López Martínez',
      correo: 'maria.lopez@universidad.edu.co',
      carrera: 'Ingeniería Industrial',
      semestre: '6',
      fechaRegistro: '2025-01-16T11:00:00',
      qrCode: 'MALM890'
    },
    {
      id: 3,
      cedula: '1001235123',
      codigo: 'CAGS123',
      primerNombre: 'Carlos',
      segundoNombre: 'Alberto',
      primerApellido: 'González',
      segundoApellido: 'Sánchez',
      nombre: 'Carlos Alberto González Sánchez',
      correo: 'carlos.gonzalez@universidad.edu.co',
      carrera: 'Ingeniería de Sistemas',
      semestre: '7',
      fechaRegistro: '2025-01-17T09:15:00',
      qrCode: 'CAGS123'
    },
    {
      id: 4,
      cedula: '1001235456',
      codigo: 'LCRH456',
      primerNombre: 'Laura',
      segundoNombre: 'Camila',
      primerApellido: 'Ramírez',
      segundoApellido: 'Hernández',
      nombre: 'Laura Camila Ramírez Hernández',
      correo: 'laura.ramirez@universidad.edu.co',
      carrera: 'Administración de Empresas',
      semestre: '5',
      fechaRegistro: '2025-01-18T14:20:00',
      qrCode: 'LCRH456'
    },
    {
      id: 5,
      cedula: '1001235789',
      codigo: 'DAFT789',
      primerNombre: 'David',
      segundoNombre: 'Andrés',
      primerApellido: 'Fernández',
      segundoApellido: 'Torres',
      nombre: 'David Andrés Fernández Torres',
      correo: 'david.fernandez@universidad.edu.co',
      carrera: 'Ingeniería Electrónica',
      semestre: '9',
      fechaRegistro: '2025-01-19T08:45:00',
      qrCode: 'DAFT789'
    },
    {
      id: 6,
      cedula: '1001236012',
      codigo: 'SVDM012',
      primerNombre: 'Sofía',
      segundoNombre: 'Valentina',
      primerApellido: 'Díaz',
      segundoApellido: 'Morales',
      nombre: 'Sofía Valentina Díaz Morales',
      correo: 'sofia.diaz@universidad.edu.co',
      carrera: 'Psicología',
      semestre: '4',
      fechaRegistro: '2025-01-20T10:00:00',
      qrCode: 'SVDM012'
    },
    {
      id: 7,
      cedula: '1001236345',
      codigo: 'AJVC345',
      primerNombre: 'Andrés',
      segundoNombre: 'José',
      primerApellido: 'Vargas',
      segundoApellido: 'Castro',
      nombre: 'Andrés José Vargas Castro',
      correo: 'andres.vargas@universidad.edu.co',
      carrera: 'Ingeniería Civil',
      semestre: '10',
      fechaRegistro: '2025-01-21T13:30:00',
      qrCode: 'AJVC345'
    },
    {
      id: 8,
      cedula: '1001236678',
      codigo: 'PAMR678',
      primerNombre: 'Paula',
      segundoNombre: 'Andrea',
      primerApellido: 'Medina',
      segundoApellido: 'Rojas',
      nombre: 'Paula Andrea Medina Rojas',
      correo: 'paula.medina@universidad.edu.co',
      carrera: 'Diseño Gráfico',
      semestre: '3',
      fechaRegistro: '2025-01-22T15:45:00',
      qrCode: 'PAMR678'
    },
    {
      id: 9,
      cedula: '1001236901',
      codigo: 'MJOP901',
      primerNombre: 'Miguel',
      segundoNombre: 'Ángel',
      primerApellido: 'Ortiz',
      segundoApellido: 'Pérez',
      nombre: 'Miguel Ángel Ortiz Pérez',
      correo: 'miguel.ortiz@universidad.edu.co',
      carrera: 'Arquitectura',
      semestre: '6',
      fechaRegistro: '2025-01-23T09:00:00',
      qrCode: 'MJOP901'
    },
    {
      id: 10,
      cedula: '1001237234',
      codigo: 'VCNS234',
      primerNombre: 'Valentina',
      segundoNombre: 'Carolina',
      primerApellido: 'Navarro',
      segundoApellido: 'Silva',
      nombre: 'Valentina Carolina Navarro Silva',
      correo: 'valentina.navarro@universidad.edu.co',
      carrera: 'Derecho',
      semestre: '7',
      fechaRegistro: '2025-01-24T11:30:00',
      qrCode: 'VCNS234'
    }
  ];

  // Generar 10 eventos (mezclando estados)
  const eventos = [
    {
      id: 1,
      codigo: 'EVT-001',
      nombre: 'Conferencia de Inteligencia Artificial',
      fecha: '2025-11-10',
      horaInicio: '14:00',
      horaFin: '16:00',
      lugar: 'Auditorio Principal',
      cupos: 50,
      descripcion: 'Conferencia sobre tendencias en IA y Machine Learning',
      gpsLocation: {
        lat: 4.6097,
        lng: -74.0817,
        accuracy: 15
      },
      estado: 'finalizado',
      manualStatus: false
    },
    {
      id: 2,
      codigo: 'EVT-002',
      nombre: 'Taller de Desarrollo Web Moderno',
      fecha: '2025-11-16',
      horaInicio: '08:00',
      horaFin: '11:00',
      lugar: 'Laboratorio 3A',
      cupos: 30,
      descripcion: 'Taller práctico sobre React, Vue y frameworks modernos',
      gpsLocation: {
        lat: 4.6105,
        lng: -74.0825,
        accuracy: 12
      },
      estado: 'activo',
      manualStatus: true
    },
    {
      id: 3,
      codigo: 'EVT-003',
      nombre: 'Seminario de Emprendimiento Digital',
      fecha: '2025-11-18',
      horaInicio: '15:00',
      horaFin: '18:00',
      lugar: 'Sala de Conferencias B',
      cupos: 40,
      descripcion: 'Experiencias de emprendedores exitosos en el mundo digital',
      gpsLocation: {
        lat: 4.6089,
        lng: -74.0809,
        accuracy: 18
      },
      estado: 'programado',
      manualStatus: false
    },
    {
      id: 4,
      codigo: 'EVT-004',
      nombre: 'Hackathon Universitario 2025',
      fecha: '2025-11-12',
      horaInicio: '08:00',
      horaFin: '20:00',
      lugar: 'Centro de Innovación',
      cupos: 60,
      descripcion: 'Competencia de programación en equipos',
      gpsLocation: {
        lat: 4.6112,
        lng: -74.0830,
        accuracy: 10
      },
      estado: 'finalizado',
      manualStatus: false
    },
    {
      id: 5,
      codigo: 'EVT-005',
      nombre: 'Feria de Proyectos de Grado',
      fecha: '2025-11-20',
      horaInicio: '10:00',
      horaFin: '17:00',
      lugar: 'Plaza Central',
      cupos: 100,
      descripcion: 'Exhibición de proyectos finales de estudiantes',
      gpsLocation: {
        lat: 4.6100,
        lng: -74.0815,
        accuracy: 20
      },
      estado: 'programado',
      manualStatus: false
    },
    {
      id: 6,
      codigo: 'EVT-006',
      nombre: 'Workshop de Ciberseguridad',
      fecha: '2025-11-14',
      horaInicio: '13:00',
      horaFin: '16:00',
      lugar: 'Aula Magna',
      cupos: 35,
      descripcion: 'Introducción a la seguridad informática y ethical hacking',
      gpsLocation: {
        lat: 4.6093,
        lng: -74.0822,
        accuracy: 14
      },
      estado: 'finalizado',
      manualStatus: false
    },
    {
      id: 7,
      codigo: 'EVT-007',
      nombre: 'Charla: Futuro de la Tecnología',
      fecha: '2025-11-16',
      horaInicio: '14:00',
      horaFin: '17:00',
      lugar: 'Auditorio 2',
      cupos: 45,
      descripcion: 'Tendencias tecnológicas para los próximos 10 años',
      gpsLocation: {
        lat: 4.6108,
        lng: -74.0812,
        accuracy: 16
      },
      estado: 'activo',
      manualStatus: true
    },
    {
      id: 8,
      codigo: 'EVT-008',
      nombre: 'Curso de Git y GitHub',
      fecha: '2025-11-22',
      horaInicio: '14:00',
      horaFin: '17:00',
      lugar: 'Sala de Cómputo 1',
      cupos: 25,
      descripcion: 'Control de versiones para desarrolladores',
      gpsLocation: {
        lat: 4.6095,
        lng: -74.0819,
        accuracy: 11
      },
      estado: 'programado',
      manualStatus: false
    },
    {
      id: 9,
      codigo: 'EVT-009',
      nombre: 'Simposio de Investigación Científica',
      fecha: '2025-11-08',
      horaInicio: '09:00',
      horaFin: '13:00',
      lugar: 'Centro de Investigaciones',
      cupos: 55,
      descripcion: 'Presentación de investigaciones académicas',
      gpsLocation: {
        lat: 4.6102,
        lng: -74.0828,
        accuracy: 13
      },
      estado: 'finalizado',
      manualStatus: false
    },
    {
      id: 10,
      codigo: 'EVT-010',
      nombre: 'Meetup de Desarrolladores',
      fecha: '2025-11-25',
      horaInicio: '18:00',
      horaFin: '20:00',
      lugar: 'Cafetería Central',
      cupos: 30,
      descripcion: 'Networking y compartir experiencias entre desarrolladores',
      gpsLocation: {
        lat: 4.6098,
        lng: -74.0813,
        accuracy: 17
      },
      estado: 'programado',
      manualStatus: false
    }
  ];

  // Función auxiliar para calcular distancia usando fórmula de Haversine
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 100) / 100; // Redondear a 2 decimales
  }

  // Generar 50+ asistencias (distribuyendo entre diferentes eventos y estudiantes)
  const asistencias = [];
  let asistenciaId = 1;

  // Evento 1 (finalizado) - 8 asistencias
  const evento1Asistencias = [1, 2, 3, 4, 5, 6, 7, 8];
  evento1Asistencias.forEach((estudianteId, index) => {
    const evento = eventos[0]; // Evento 1
    const userLat = 4.6097 + (Math.random() - 0.5) * 0.0002;
    const userLng = -74.0817 + (Math.random() - 0.5) * 0.0002;
    const distance = calculateDistance(evento.gpsLocation.lat, evento.gpsLocation.lng, userLat, userLng);
    
    asistencias.push({
      id: asistenciaId++,
      eventId: 1,
      studentId: estudianteId,
      timestamp: `2025-11-10T${14 + Math.floor(index/4)}:${String((index % 4) * 15).padStart(2, '0')}:00`,
      location: {
        lat: userLat,
        lng: userLng,
        accuracy: Math.round((10 + Math.random() * 15) * 100) / 100,
        distance: distance
      }
    });
  });

  // Evento 2 (activo) - 6 asistencias
  const evento2Asistencias = [1, 3, 5, 7, 9, 10];
  evento2Asistencias.forEach((estudianteId, index) => {
    const evento = eventos[1]; // Evento 2
    const userLat = 4.6105 + (Math.random() - 0.5) * 0.0002;
    const userLng = -74.0825 + (Math.random() - 0.5) * 0.0002;
    const distance = calculateDistance(evento.gpsLocation.lat, evento.gpsLocation.lng, userLat, userLng);
    
    asistencias.push({
      id: asistenciaId++,
      eventId: 2,
      studentId: estudianteId,
      timestamp: `2025-11-16T${String(9 + Math.floor(index/3)).padStart(2, '0')}:${String((index % 3) * 20).padStart(2, '0')}:00`,
      location: {
        lat: userLat,
        lng: userLng,
        accuracy: Math.round((8 + Math.random() * 12) * 100) / 100,
        distance: distance
      }
    });
  });

  // Evento 4 (finalizado) - 10 asistencias (todos)
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((estudianteId, index) => {
    const evento = eventos[3]; // Evento 4
    const userLat = 4.6112 + (Math.random() - 0.5) * 0.0002;
    const userLng = -74.0830 + (Math.random() - 0.5) * 0.0002;
    const distance = calculateDistance(evento.gpsLocation.lat, evento.gpsLocation.lng, userLat, userLng);
    
    asistencias.push({
      id: asistenciaId++,
      eventId: 4,
      studentId: estudianteId,
      timestamp: `2025-11-12T${String(8 + Math.floor(index/2)).padStart(2, '0')}:${String((index % 2) * 30).padStart(2, '0')}:00`,
      location: {
        lat: userLat,
        lng: userLng,
        accuracy: Math.round((5 + Math.random() * 10) * 100) / 100,
        distance: distance
      }
    });
  });

  // Evento 6 (finalizado) - 7 asistencias
  const evento6Asistencias = [2, 3, 4, 6, 7, 8, 9];
  evento6Asistencias.forEach((estudianteId, index) => {
    const evento = eventos[5]; // Evento 6
    const userLat = 4.6093 + (Math.random() - 0.5) * 0.0002;
    const userLng = -74.0822 + (Math.random() - 0.5) * 0.0002;
    const distance = calculateDistance(evento.gpsLocation.lat, evento.gpsLocation.lng, userLat, userLng);
    
    asistencias.push({
      id: asistenciaId++,
      eventId: 6,
      studentId: estudianteId,
      timestamp: `2025-11-14T${String(13 + Math.floor(index/4)).padStart(2, '0')}:${String((index % 4) * 15).padStart(2, '0')}:00`,
      location: {
        lat: userLat,
        lng: userLng,
        accuracy: Math.round((12 + Math.random() * 18) * 100) / 100,
        distance: distance
      }
    });
  });

  // Evento 7 (activo) - 5 asistencias
  const evento7Asistencias = [1, 2, 4, 6, 8];
  evento7Asistencias.forEach((estudianteId, index) => {
    const evento = eventos[6]; // Evento 7
    const userLat = 4.6108 + (Math.random() - 0.5) * 0.0002;
    const userLng = -74.0812 + (Math.random() - 0.5) * 0.0002;
    const distance = calculateDistance(evento.gpsLocation.lat, evento.gpsLocation.lng, userLat, userLng);
    
    asistencias.push({
      id: asistenciaId++,
      eventId: 7,
      studentId: estudianteId,
      timestamp: `2025-11-16T${String(16 + Math.floor(index/3)).padStart(2, '0')}:${String((index % 3) * 20).padStart(2, '0')}:00`,
      location: {
        lat: userLat,
        lng: userLng,
        accuracy: Math.round((14 + Math.random() * 16) * 100) / 100,
        distance: distance
      }
    });
  });

  // Evento 9 (finalizado) - 9 asistencias
  const evento9Asistencias = [1, 2, 3, 4, 5, 6, 7, 9, 10];
  evento9Asistencias.forEach((estudianteId, index) => {
    const evento = eventos[8]; // Evento 9
    const userLat = 4.6102 + (Math.random() - 0.5) * 0.0002;
    const userLng = -74.0828 + (Math.random() - 0.5) * 0.0002;
    const distance = calculateDistance(evento.gpsLocation.lat, evento.gpsLocation.lng, userLat, userLng);
    
    asistencias.push({
      id: asistenciaId++,
      eventId: 9,
      studentId: estudianteId,
      timestamp: `2025-11-08T${String(9 + Math.floor(index/3)).padStart(2, '0')}:${String((index % 3) * 20).padStart(2, '0')}:00`,
      location: {
        lat: userLat,
        lng: userLng,
        accuracy: Math.round((9 + Math.random() * 14) * 100) / 100,
        distance: distance
      }
    });
  });

  // Asistencias adicionales para llegar a más de 50
  // Repetir algunos estudiantes en eventos pasados
  const asistenciasExtra = [
    { eventId: 1, studentId: 9, time: '14:45:00' },
    { eventId: 1, studentId: 10, time: '15:00:00' },
    { eventId: 4, studentId: 1, time: '10:30:00' },
    { eventId: 4, studentId: 3, time: '11:00:00' },
    { eventId: 6, studentId: 1, time: '14:00:00' },
    { eventId: 6, studentId: 5, time: '14:15:00' },
    { eventId: 9, studentId: 8, time: '10:30:00' }
  ];

  asistenciasExtra.forEach(extra => {
    const evento = eventos.find(e => e.id === extra.eventId);
    const userLat = evento.gpsLocation.lat + (Math.random() - 0.5) * 0.0002;
    const userLng = evento.gpsLocation.lng + (Math.random() - 0.5) * 0.0002;
    const distance = calculateDistance(evento.gpsLocation.lat, evento.gpsLocation.lng, userLat, userLng);
    
    asistencias.push({
      id: asistenciaId++,
      eventId: extra.eventId,
      studentId: extra.studentId,
      timestamp: `${evento.fecha}T${extra.time}`,
      location: {
        lat: userLat,
        lng: userLng,
        accuracy: Math.round((8 + Math.random() * 20) * 100) / 100,
        distance: distance
      }
    });
  });

  // Guardar en localStorage
  try {
    localStorage.setItem('asisteqr-students', JSON.stringify(estudiantes));
    localStorage.setItem('asisteqr-events', JSON.stringify(eventos));
    localStorage.setItem('asisteqr-attendances', JSON.stringify(asistencias));
    localStorage.setItem('asisteqr-student-seq', '11');
    localStorage.setItem('asisteqr-event-seq', '11');

    console.log('✅ Datos de prueba cargados exitosamente!');
    console.log(`📊 Estadísticas:`);
    console.log(`   - ${estudiantes.length} estudiantes`);
    console.log(`   - ${eventos.length} eventos`);
    console.log(`   - ${asistencias.length} asistencias`);
    console.log('\n📋 Distribución de eventos:');
    console.log(`   - Programados: ${eventos.filter(e => e.estado === 'programado').length}`);
    console.log(`   - Activos: ${eventos.filter(e => e.estado === 'activo').length}`);
    console.log(`   - Finalizados: ${eventos.filter(e => e.estado === 'finalizado').length}`);
    console.log('\n🔄 Recarga la página para ver los datos');
    console.log('\n🗑️  Para limpiar todo: limpiarDatos()');

  } catch (error) {
    console.error('❌ Error al cargar los datos:', error);
  }
};

// Función para limpiar todos los datos
window.limpiarDatos = function() {
  try {
    localStorage.clear();
    console.log('✅ Datos eliminados correctamente');
    console.log('🔄 Recarga la página para ver los cambios');
  } catch (error) {
    console.error('❌ Error al limpiar los datos:', error);
  }
};

// Ejecutar automáticamente al cargar el script solo si DEMO_MODE está activo
if (typeof window.CONFIG !== 'undefined' && window.CONFIG.DEMO_MODE === true) {
  cargarDatosPrueba();
}

})();
