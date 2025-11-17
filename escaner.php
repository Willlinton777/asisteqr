<?php
session_start();
// Validar sesión si es necesario
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Escanear QR - Asiste QR</title>
    <link rel="stylesheet" href="estilos.css">
    <!-- Importar html5-qrcode -->
    <script src="https://unpkg.com/html5-qrcode"></script>
    <script src="script.js" defer></script>
    <style>
        /* Barra de opciones interna */
        .tab-bar {
            display: flex;
            background-color: #fff;
            border-bottom: 2px solid #ccc;
        }
        .tab-bar button {
            flex: 1;
            padding: 12px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .tab-bar button.active {
            background-color: #F0B429;
            color: #005883;
            font-weight: bold;
        }
        .tab-content {
            display: none;
            padding: 1rem;
        }
        .tab-content.active {
            display: block;
        }
        /* Modal de feedback */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: none;
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            max-width: 90%;
            text-align: center;
        }
        /* Responsivo para toda la sección */
        @media (max-width: 768px) {
            .tab-bar button { font-size: 14px; padding: 10px; }
        }
    </style>
</head>
<body class="main-body">
    <?php include('menu.php'); ?>
    <main class="contenido-principal">
        <h2>Escanear & Registrar</h2>
        <div class="tab-bar">
            <button data-tab="register" class="active">Registrar Estudiante</button>
            <button data-tab="scan">Escanear Asistencia</button>
        </div>
        <div id="register" class="tab-content active">
            <div class="form-container">
                <div class="barra-color"></div>
                <h3>Registrar Estudiante</h3>
                <form id="form-register">
                    <input type="text" name="cedula" placeholder="Cédula" required>
                    <input type="text" name="nombre" placeholder="Nombre" required>
                    <input type="text" name="apellido" placeholder="Apellido" required>
                    <input type="email" name="correo" placeholder="Correo electrónico" required>
                    <input type="text" name="carrera" placeholder="Carrera" required>
                    <button type="submit">Registrar y Generar QR</button>
                </form>
                <div id="qr-result"></div>
            </div>
        </div>

        <div id="scan" class="tab-content">
            <h3>Escanear Asistencia</h3>
            <div id="event-input">
                <input type="text" id="codigo-evento" placeholder="Código de Evento" required>
                <button id="start-scan-btn" class="scan-btn">Iniciar Escaneo</button>
            </div>
            <div id="scanner" style="margin-top:20px; display:none;">
                <div id="reader" style="width:100%; max-width:400px;"></div>
                <button id="end-event-btn" class="scan-btn" style="margin-top:20px; display:none;">Cerrar Evento</button>
            </div>
        </div>
    </main>

    <!-- Modal -->
    <div id="modal" class="modal">
        <div class="modal-content">
            <p id="modal-message"></p>
            <button id="modal-close">Cerrar</button>
        </div>
    </div>

    <!-- Modal para mostrar el QR generado -->
    <div id="qr-modal" class="modal" style="display:none;">
        <div class="modal-content">
            <p id="qr-message"></p>
            <div id="qr-image"></div>
            <button id="close-qr-modal">Cerrar</button>
        </div>
    </div>

    <!-- Modal para error de evento -->
    <div id="modal-event-error" class="modal">
        <div class="modal-content">
            <p id="modal-error-message">Código de evento no válido.</p>
            <button id="modal-close-error" class="modal-close-btn">Cerrar</button>
        </div>
    </div>    
</body>
</html>
