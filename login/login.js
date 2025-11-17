// AsisteQR - Login Module

(function() {
  const SESSION_KEY = 'asisteqr-session';
  const STORAGE_KEYS = {
    events: 'asisteqr-events',
    eventSeq: 'asisteqr-event-seq',
    students: 'asisteqr-students',
    attendance: 'asisteqr-attendances'
  };

  const DEFAULT_DATA = {
    events: [
      {
        id: 1,
        nombre: 'Congreso Internacional de Innovación Tecnológica 2025',
        descripcion: 'Conferencias magistrales sobre IA, blockchain, computación cuántica y desarrollo sostenible. Expositores internacionales.',
        fecha: '2025-03-15',
        lugar: 'Auditorio Central - Campus Norte',
        codigo: 'EVT-2025-001',
        horaInicio: '08:00',
        horaFin: '18:00',
        cupos: 500
      },
      {
        id: 2,
        nombre: 'Taller Práctico de Emprendimiento Digital',
        descripcion: 'Sesión intensiva sobre modelos de negocio digitales, estrategias de marketing online y pitch para inversionistas.',
        fecha: '2025-03-22',
        lugar: 'Sala de Innovación 204 - Edificio B',
        codigo: 'EVT-2025-002',
        horaInicio: '14:00',
        horaFin: '17:00',
        cupos: 80
      },
      {
        id: 3,
        nombre: 'Hackathon Universitario - Soluciones Sostenibles',
        descripcion: '48 horas de programación intensiva para crear soluciones tecnológicas a problemáticas ambientales y sociales.',
        fecha: '2025-04-10',
        lugar: 'Laboratorio de Computación - Piso 3',
        codigo: 'EVT-2025-003',
        horaInicio: '09:00',
        horaFin: '18:00',
        cupos: 120
      },
      {
        id: 4,
        nombre: 'Seminario de Inteligencia Artificial Aplicada',
        descripcion: 'Aplicaciones prácticas de IA en medicina, agricultura, finanzas y educación. Casos de éxito y demos en vivo.',
        fecha: '2025-04-18',
        lugar: 'Auditorio Principal',
        codigo: 'EVT-2025-004',
        horaInicio: '10:00',
        horaFin: '16:00',
        cupos: 300
      },
      {
        id: 5,
        nombre: 'Feria de Proyectos de Investigación Estudiantil',
        descripcion: 'Exposición de proyectos innovadores desarrollados por estudiantes de todas las facultades. Premios y reconocimientos.',
        fecha: '2025-05-05',
        lugar: 'Plaza Central - Campus',
        codigo: 'EVT-2025-005',
        horaInicio: '08:00',
        horaFin: '17:00',
        cupos: 800
      }
    ],
    students: [
      {
        id: '10880011',
        nombre: 'Andrea Carolina',
        apellido: 'Morales Gutiérrez',
        correo: 'andrea.morales@unad.edu.co',
        carrera: 'Ingeniería de Sistemas',
        semestre: 7,
        qrCode: 'AND011QR'
      },
      {
        id: '10223344',
        nombre: 'Luis Fernando',
        apellido: 'García Pérez',
        correo: 'luis.garcia@unad.edu.co',
        carrera: 'Administración de Empresas',
        semestre: 5,
        qrCode: 'LUI344QR'
      },
      {
        id: '10556789',
        nombre: 'María José',
        apellido: 'Rodríguez Silva',
        correo: 'maria.rodriguez@unad.edu.co',
        carrera: 'Ingeniería Industrial',
        semestre: 6,
        qrCode: 'MAR789QR'
      },
      {
        id: '10334455',
        nombre: 'Carlos Alberto',
        apellido: 'Hernández López',
        correo: 'carlos.hernandez@unad.edu.co',
        carrera: 'Ingeniería Electrónica',
        semestre: 8,
        qrCode: 'CAR455QR'
      },
      {
        id: '10998877',
        nombre: 'Laura Valentina',
        apellido: 'Martínez Cruz',
        correo: 'laura.martinez@unad.edu.co',
        carrera: 'Psicología',
        semestre: 4,
        qrCode: 'LAU877QR'
      },
      {
        id: '10112233',
        nombre: 'Diego Alejandro',
        apellido: 'Sánchez Rojas',
        correo: 'diego.sanchez@unad.edu.co',
        carrera: 'Contaduría Pública',
        semestre: 3,
        qrCode: 'DIE233QR'
      }
    ],
    attendance: []
  };

  function ensureData() {
    if (!localStorage.getItem(STORAGE_KEYS.events)) {
      localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(DEFAULT_DATA.events));
      localStorage.setItem(STORAGE_KEYS.eventSeq, String(DEFAULT_DATA.events.length + 1));
    }
    if (!localStorage.getItem(STORAGE_KEYS.students)) {
      localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(DEFAULT_DATA.students));
    }
    if (!localStorage.getItem(STORAGE_KEYS.attendance)) {
      localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(DEFAULT_DATA.attendance));
    }
  }

  function showError() {
    const errorMsg = document.getElementById('login-error');
    errorMsg.classList.add('show');
    
    setTimeout(() => {
      errorMsg.classList.remove('show');
    }, 4000);
  }

  function init() {
    sessionStorage.removeItem(SESSION_KEY);
    ensureData();
    
    const form = document.getElementById('login-form');
    const submitBtn = form.querySelector('.btn-submit');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const usuario = document.getElementById('usuario').value.trim();
      const contrasena = document.getElementById('contrasena').value.trim();
      
      // Add loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      
      // Simulate authentication delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const isValid = usuario === 'admin' && contrasena === 'admin123';

      if (isValid) {
        sessionStorage.setItem(SESSION_KEY, 'active');
        sessionStorage.setItem('asisteqr-user', JSON.stringify({
          username: usuario,
          role: 'admin',
          loginTime: new Date().toISOString()
        }));
        
        // Redirect to QR scanner
        window.location.href = 'qr/escaner.html';
      } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showError();
        
        // Clear password field
        document.getElementById('contrasena').value = '';
        document.getElementById('contrasena').focus();
      }
    });

    // Add input animations
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
