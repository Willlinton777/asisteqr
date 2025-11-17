document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEYS = {
    students: 'asisteqr-students',
    sequence: 'asisteqr-student-seq'
  };

  let registeredStudent = null;

  init();

  function init() {
    setupEventListeners();
    updateStats();
  }

  function setupEventListeners() {
    document.getElementById('registration-form').addEventListener('submit', handleRegistration);
    document.getElementById('btn-close-qr').addEventListener('click', closeQRModal);
    document.getElementById('btn-new-registration').addEventListener('click', newRegistration);
    document.getElementById('btn-download-qr').addEventListener('click', downloadQR);
  }

  function handleRegistration(e) {
    e.preventDefault();

    const cedula = document.getElementById('cedula').value.trim();
    const primerNombre = document.getElementById('primer-nombre').value.trim();
    const segundoNombre = document.getElementById('segundo-nombre').value.trim();
    const primerApellido = document.getElementById('primer-apellido').value.trim();
    const segundoApellido = document.getElementById('segundo-apellido').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const carrera = document.getElementById('carrera').value.trim();
    const semestre = document.getElementById('semestre').value || '';

    // Check if cedula already exists
    const studentsJSON = localStorage.getItem(STORAGE_KEYS.students);
    const students = studentsJSON ? JSON.parse(studentsJSON) : [];

    const exists = students.find(s => s.cedula === cedula);
    if (exists) {
      alert('Ya existe un estudiante registrado con esta cédula.');
      return;
    }

    // Generate codigo: iniciales + últimos 3 dígitos de cédula
    const inicialPrimerNombre = primerNombre.charAt(0).toUpperCase();
    const inicialSegundoNombre = segundoNombre ? segundoNombre.charAt(0).toUpperCase() : '';
    const inicialPrimerApellido = primerApellido.charAt(0).toUpperCase();
    const inicialSegundoApellido = segundoApellido ? segundoApellido.charAt(0).toUpperCase() : '';
    const ultimos3Cedula = cedula.slice(-3);
    
    let codigo = `${inicialPrimerNombre}${inicialSegundoNombre}${inicialPrimerApellido}${inicialSegundoApellido}${ultimos3Cedula}`;
    
    // Check if codigo already exists, if so add random number
    while (students.find(s => s.codigo === codigo)) {
      const randomNum = Math.floor(Math.random() * 10);
      codigo = `${inicialPrimerNombre}${inicialSegundoNombre}${inicialPrimerApellido}${inicialSegundoApellido}${ultimos3Cedula}${randomNum}`;
    }

    // Create full name
    const nombreCompleto = `${primerNombre}${segundoNombre ? ' ' + segundoNombre : ''} ${primerApellido}${segundoApellido ? ' ' + segundoApellido : ''}`;

    // Create student object
    const newStudent = {
      id: Date.now(),
      cedula,
      codigo,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      nombre: nombreCompleto,
      correo,
      carrera,
      semestre,
      fechaRegistro: new Date().toISOString(),
      qrCode: codigo
    };

    // Save to localStorage
    students.push(newStudent);
    localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(students));

    registeredStudent = newStudent;

    // Show success message
    alert(`${nombreCompleto} (${codigo}) registrado exitosamente`);

    // Show success modal with QR
    showQRModal(newStudent);
    updateStats();

    console.log('✅ Estudiante registrado:', newStudent);
  }

  function showQRModal(student) {
    const modal = document.getElementById('qr-modal');
    const studentInfo = document.getElementById('student-info');
    const qrContainer = document.getElementById('qr-code');

    // Display student info
    studentInfo.innerHTML = `
      <div><strong>Código:</strong> <span>${student.codigo}</span></div>
      <div><strong>Nombre:</strong> <span>${student.nombre}</span></div>
      <div><strong>Cédula:</strong> <span>${student.cedula}</span></div>
      <div><strong>Correo:</strong> <span>${student.correo}</span></div>
      <div><strong>Carrera:</strong> <span>${student.carrera}</span></div>
    `;

    // Clear previous QR
    qrContainer.innerHTML = '';

    // Generate QR code using qrcode.js - Optimized for screen scanning
    new QRCode(qrContainer, {
      text: student.codigo,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.M  // Medium error correction for screen scanning
    });

    modal.classList.add('active');
  }

  function closeQRModal() {
    const modal = document.getElementById('qr-modal');
    modal.classList.remove('active');
  }

  function newRegistration() {
    closeQRModal();
    document.getElementById('registration-form').reset();
    document.getElementById('cedula').focus();
  }

  function downloadQR() {
    if (!registeredStudent) return;

    const qrCanvas = document.querySelector('#qr-code canvas');
    if (!qrCanvas) return;

    // Create a new canvas with white margin
    const margin = 20; // White margin in pixels
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    
    // Set new canvas size with margin
    newCanvas.width = qrCanvas.width + (margin * 2);
    newCanvas.height = qrCanvas.height + (margin * 2);
    
    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    
    // Draw QR code centered with margin
    ctx.drawImage(qrCanvas, margin, margin);

    // Create download link with the new canvas
    const link = document.createElement('a');
    link.download = `QR_${registeredStudent.codigo}.png`;
    link.href = newCanvas.toDataURL('image/png');
    link.click();

    console.log('📥 QR descargado:', registeredStudent.codigo);
  }

  function updateStats() {
    const studentsJSON = localStorage.getItem(STORAGE_KEYS.students);
    const students = studentsJSON ? JSON.parse(studentsJSON) : [];

    // Total students
    document.getElementById('total-students').textContent = students.length;

    // Today's registrations
    const today = new Date().toISOString().split('T')[0];
    const todayCount = students.filter(s => s.fechaRegistro.startsWith(today)).length;
    document.getElementById('today-registrations').textContent = todayCount;

    // QR generated (same as total)
    document.getElementById('qr-generated').textContent = students.length;
  }
});
