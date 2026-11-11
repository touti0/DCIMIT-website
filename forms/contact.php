<?php
/**
 * Contact form handler (standalone, no external library).
 *
 * Receives the POST of the form in contact.html (fields: name, email, subject, message)
 * and sends the message with PHP's mail(). It answers with the plain text "OK" on success,
 * which is what assets/vendor/php-email-form/validate.js expects; any other text is shown
 * to the visitor as an error message.
 *
 * It needs a web server that runs PHP and can send mail (it does NOT work on GitHub Pages
 * or on static servers such as VS Code Live Server). To try it locally: php -S localhost:8000
 * from the site folder, with TEST_MODE set to true (mail() usually does not work on a PC).
 */

// ---- Settings: change these when the site is published on the final server ----------------

// Address that receives the messages
$receiving_email_address = 'ariele.santello@gmail.com';

// Sender shown in the e-mail: use an address of the domain of the site (e.g. no-reply@dcimit.org),
// otherwise many mail servers mark the message as spam. The visitor's address goes in Reply-To.
$from_email_address = 'no-reply@dcimit.org';
$from_name = 'DCIMIT website';

// true = do not send anything and answer OK (to test the form locally)
const TEST_MODE = false;

// -----------------------------------------------------------------------------------------

header('Content-Type: text/plain; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed.');
}

// Cleans a single-line field: removes control characters (blocks e-mail header injection)
function clean_line($value, $max)
{
    $value = trim((string) $value);
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '';
    return mb_substr($value, 0, $max);
}

$name = clean_line($_POST['name'] ?? '', 100);
$email = clean_line($_POST['email'] ?? '', 254);
$subject = clean_line($_POST['subject'] ?? '', 150);

// The message may have several lines: only normalise the line breaks
$message = trim((string) ($_POST['message'] ?? ''));
$message = str_replace(["\r\n", "\r"], "\n", $message);
$message = mb_substr($message, 0, 5000);

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    exit('Please fill in all the fields.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('Please enter a valid e-mail address.');
}

if (TEST_MODE) {
    exit('OK');
}

$body = "Message sent from the DCIMIT website contact form\n\n"
    . "From: $name\n"
    . "Email: $email\n"
    . "Subject: $subject\n\n"
    . $message . "\n";

$headers = [
    'From' => $from_name . ' <' . $from_email_address . '>',
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'PHP/' . phpversion(),
];

// Subject encoded for non-ASCII characters
$mail_subject = '=?UTF-8?B?' . base64_encode('[DCIMIT website] ' . $subject) . '?=';

if (mail($receiving_email_address, $mail_subject, $body, $headers)) {
    echo 'OK';
} else {
    echo 'The message could not be sent. Please try again later or write to the e-mail address shown on this page.';
}
