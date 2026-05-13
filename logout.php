<?php
session_start();
session_unset();   //rimuove  le variabili di sessione
session_destroy(); //distrugge la sessione sul server

//torna alla home
header('Location: index.html');
exit;
?>