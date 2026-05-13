<?php
session_start();

// Solo utenti normali autenticati possono accedere
if (!isset($_SESSION['ruolo']) || $_SESSION['ruolo'] !== 'utente') {
    header('Location: accesso.html');
    exit;
}

// Legge i dati dalla sessione (nessuna query al DB necessaria)
$nome    = $_SESSION['utente_nome'];
$cognome = $_SESSION['utente_cognome'];
$email   = $_SESSION['utente_email'];
$area    = $_SESSION['utente_area'];
$disp    = $_SESSION['utente_disp'];

$AREA_LABEL = [
    'donazione'      => 'Donazione Sangue/Organi',
    'ospedali'       => 'Supporto Ospedali',
    'assistenza'     => 'Assistenza Malattie',
    'primo-soccorso' => 'Primo Soccorso e Emergenze',
    'altro'          => 'Altro',
];
$areaLabel = $AREA_LABEL[$area] ?? $area;
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Area Riservata - Volontariato Sanitario</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <div class="container-fluid">
        <div class="logo text-center py-3">
            <img src="logo.png" alt="Logo Volontariato Sanitario" class="img-fluid" style="max-height: 80px;">
        </div>
    </div>
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #2c62b5;">
        <div class="container">
            <div class="collapse navbar-collapse justify-content-center">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item">
                        <a href="index.html" class="nav-link">
                            <i class="fas fa-home me-1"></i>Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="eventi.html" class="nav-link">
                            <i class="fas fa-calendar-alt me-1"></i>Eventi
                        </a>
                    </li>
                    <li class="nav-item">
                        <!-- logout.php distrugge la sessione -->
                        <a href="logout.php" class="nav-link text-warning">
                            <i class="fas fa-sign-out-alt me-1"></i>Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>

<main class="py-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-7">
                <div class="content">

                    <h1 class="text-center mb-4">
                        <i class="fas fa-user-circle text-primary me-2"></i>Area Riservata
                    </h1>

                    <!-- Benvenuto -->
                    <div class="alert alert-success border-0 shadow-sm mb-4">
                        <i class="fas fa-check-circle me-2"></i>
                        Bentornato/a, <strong><?= htmlspecialchars($nome . ' ' . $cognome) ?></strong>!
                        Sei correttamente autenticato/a.
                    </div>

                    <!-- Riepilogo dati dalla sessione -->
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-primary text-white">
                            <i class="fas fa-id-card me-2"></i>I tuoi dati (dalla sessione)
                        </div>
                        <div class="card-body">
                            <table class="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td class="fw-bold text-muted" style="width:40%">
                                            <i class="fas fa-user me-2"></i>Nome completo
                                        </td>
                                        <td><?= htmlspecialchars($nome . ' ' . $cognome) ?></td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold text-muted">
                                            <i class="fas fa-envelope me-2"></i>Email
                                        </td>
                                        <td><?= htmlspecialchars($email) ?></td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold text-muted">
                                            <i class="fas fa-heart me-2"></i>Area di volontariato
                                        </td>
                                        <td>
                                            <span class="badge bg-primary"><?= htmlspecialchars($areaLabel) ?></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold text-muted">
                                            <i class="fas fa-clock me-2"></i>Disponibilità
                                        </td>
                                        <td><?= htmlspecialchars($disp) ?> ore/settimana</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Link utili -->
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-light">
                            <i class="fas fa-link me-2"></i>Link utili
                        </div>
                        <div class="card-body d-flex flex-column gap-2">
                            <a href="eventi.html" class="btn btn-outline-primary">
                                <i class="fas fa-calendar-alt me-2"></i>Vedi gli eventi
                            </a>
                            <a href="logout.php" class="btn btn-outline-danger">
                                <i class="fas fa-sign-out-alt me-2"></i>Esci (Logout)
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</main>

<footer class="bg-dark text-white py-4 mt-5">
    <div class="container">
        <div class="contact-info text-center">
            <h3 class="mb-3">Contatti</h3>
            <div class="row justify-content-center">
                <div class="col-md-4 mb-2"><p><i class="fas fa-envelope me-2"></i>Email: info@volontariatosanitario.it</p></div>
                <div class="col-md-4 mb-2"><p><i class="fas fa-phone me-2"></i>Telefono: 06 1234567</p></div>
                <div class="col-md-4 mb-2"><p><i class="fas fa-map-marker-alt me-2"></i>Via della Solidarietà, 123 - Roma</p></div>
            </div>
        </div>
    </div>
</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
</body>
</html>