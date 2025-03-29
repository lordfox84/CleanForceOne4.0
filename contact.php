<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

require 'vendor/autoload.php';
session_start();

// ✅ OMEZENÍ ODESÍLÁNÍ FORMULÁŘE (Rate Limiting)
if (isset($_SESSION['last_submit']) && time() - $_SESSION['last_submit'] < 30) {
    die(json_encode(["status" => "error", "message" => "Prosím, počkejte 30 sekund před dalším odesláním."]));
}
$_SESSION['last_submit'] = time();

// ✅ RECAPTCHA OVĚŘENÍ
$recaptchaSecret = $_ENV['RECAPTCHA_SECRET'];
$recaptchaResponse = $_POST['recaptcha_response'] ?? '';

$recaptchaVerify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$recaptchaResponse}");
$recaptchaData = json_decode($recaptchaVerify);

if (!$recaptchaData->success || $recaptchaData->score < 0.5) {
    die(json_encode(["status" => "error", "message" => "Podezřelá aktivita! reCAPTCHA ověření selhalo."]));
}

// ✅ OCHRANA PROTI BOTŮM (Honeypot)
if (!empty($_POST['hp_field'])) {
    die(json_encode(["status" => "error", "message" => "Detekován spam bot!"]));
}

// ✅ ČIŠTĚNÍ A VALIDACE VSTUPŮ
function cleanInput($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

$name = cleanInput($_POST['name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$subject = cleanInput($_POST['subject'] ?? '');
$message = cleanInput($_POST['message'] ?? '');

if (!$email) {
    die(json_encode(["status" => "error", "message" => "Neplatný e-mail."]));
}

if (empty($name) || empty($subject) || empty($message)) {
    die(json_encode(["status" => "error", "message" => "Všechna pole jsou povinná."]));
}

// ✅ ODESLÁNÍ EMAILU PŘES PHPMailer
$mail = new PHPMailer(true);

try {
    // 🔐 SMTP NASTAVENÍ (Heslo z ENV, ne v kódu!)
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USERNAME'];
    $mail->Password = $_ENV['SMTP_PASSWORD'];
    $mail->SMTPSecure = $_ENV['SMTP_SECURE'];
    $mail->Port = $_ENV['SMTP_PORT'];

    // 📌 Odesílatel a příjemce
    $mail->setFrom('tvůj@email.cz', 'Kontakt formulář');
    $mail->addAddress($_ENV['SMTP_USERNAME']);

    // 📌 E-mail obsah
    $mail->isHTML(true);
    $mail->Subject = "Nová zpráva: $subject";
    $mail->Body = "<p><strong>Jméno:</strong> $name</p>
                   <p><strong>E-mail:</strong> $email</p>
                   <p><strong>Zpráva:</strong> $message</p>";
    $mail->AltBody = "Jméno: $name\nE-mail: $email\nZpráva: $message";

    $mail->send();
    echo json_encode(["status" => "success", "message" => "Zpráva byla úspěšně odeslána!"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "E-mail se nepodařilo odeslat: {$mail->ErrorInfo}"]);
}
?>
