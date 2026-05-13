<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['ruolo'])) {
    if ($_SESSION['ruolo'] === 'admin') {
        echo json_encode([
            'loggato' => true,
            'ruolo'   => 'admin',
            'nome'    => 'Admin'
        ]);
    } else {
        echo json_encode([
            'loggato' => true,
            'ruolo'   => 'utente',
            'nome'    => $_SESSION['utente_nome'] ?? ''
        ]);
    }
} else {
    echo json_encode(['loggato' => false]);
}
?>