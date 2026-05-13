<?php
session_start(); 

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('Accesso non autorizzato');
}

header('Content-Type: application/json');

function pulisci($dato) {
    return htmlspecialchars(trim($dato), ENT_QUOTES, 'UTF-8');
}

$email = pulisci($_POST['email'] ?? '');
$psswd = $_POST['psswd'] ?? '';

if (empty($email) || empty($psswd)) {
    echo json_encode(['successo' => false, 'messaggio' => 'Email e password sono obbligatori']);
    exit;
}
//connessione al db
$db_host = 'localhost';
$db_name = 'volontariato';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO(
        "mysql:host=$db_host;dbname=$db_name;charset=utf8",
        $db_user,
        $db_pass
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // controllo admin
    $stmtAdmin = $pdo->prepare("SELECT * FROM admin WHERE email = :email");
    $stmtAdmin->execute([':email' => $email]);
    $admin = $stmtAdmin->fetch(PDO::FETCH_ASSOC);

    if ($admin && password_verify($psswd, $admin['psswd'])) {
        //salva i dati admin in sessione
        $_SESSION['ruolo']      = 'admin';
        $_SESSION['admin_id']   = $admin['id'];
        $_SESSION['admin_email']= $admin['email'];

        echo json_encode([
            'successo' => true,
            'ruolo'    => 'admin',
            'messaggio'=> 'Accesso admin effettuato!'
        ]);
        exit;
    }

    //se non è admin cerca l'utente normale
    $stmt = $pdo->prepare("SELECT * FROM registrazioni WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $utente = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$utente) {
        echo json_encode(['successo' => false, 'messaggio' => 'Email non trovata. <a href="registrazione.html">Registrati qui</a>']);
        exit;
    }

    if (!password_verify($psswd, $utente['psswd'])) {
        echo json_encode(['successo' => false, 'messaggio' => 'Password errata']);
        exit;
    }

    //salva i dati utente in sessione
    $_SESSION['ruolo']          = 'utente';
    $_SESSION['utente_id']      = $utente['id'];
    $_SESSION['utente_nome']    = $utente['nome'];
    $_SESSION['utente_cognome'] = $utente['cognome'];
    $_SESSION['utente_email']   = $utente['email'];
    $_SESSION['utente_area']    = $utente['area'];
    $_SESSION['utente_disp']    = $utente['disponibilita'];

    echo json_encode([
        'successo'  => true,
        'ruolo'     => 'utente',
        'messaggio' => 'Accesso effettuato!',
        'nome'      => $utente['nome']
    ]);

} catch (PDOException $e) {
    error_log('DB error in accesso.php: ' . $e->getMessage());
    echo json_encode(['successo' => false, 'messaggio' => 'Errore del server. Riprova più tardi.']);
}
?>