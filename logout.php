<?php
session_start();
session_unset();   // rimuove tutte le variabili di sessione
session_destroy(); // distrugge la sessione sul server

// Torna alla home
header('Location: index.html');
exit;
?>