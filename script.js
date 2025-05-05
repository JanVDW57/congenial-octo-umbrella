document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav'); // Das <nav> Element
    const body = document.body;

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            // Toggle die Klasse am Body (oder Header), um das Menü anzuzeigen/auszublenden
            body.classList.toggle('nav-open');

            // ARIA-Attribut für Barrierefreiheit aktualisieren
            const isExpanded = body.classList.contains('nav-open');
            navToggle.setAttribute('aria-expanded', isExpanded);

            // Optional: Blende das Hauptmenü direkt ein/aus, wenn die Klasse am Body nicht reicht
            // mainNav.style.display = isExpanded ? 'block' : 'none';
            // Das CSS regelt das aber schon über body.nav-open .main-nav
        });

        // Menü schließen, wenn auf einen Link geklickt wird (optional, aber gute UX)
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (body.classList.contains('nav-open')) {
                    body.classList.remove('nav-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- Aktuelles Jahr im Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Frühere Animations- oder Theme-Skripte wurden entfernt ---

    // --- NEU: Kontaktformular-Verarbeitung ---
    const contactForm = document.getElementById('contact-form');
    const formMessages = document.getElementById('form-messages');
    const submitButton = document.getElementById('submit-button');
    // Deine Make.com Webhook URL
    const makeWebhookUrl = 'https://hook.eu2.make.com/ek8dury2vsdob8z7n6fyi4nuok7jw3b7';

    // Prüfen, ob das Formular auf der aktuellen Seite existiert
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Standard-Formularversand des Browsers verhindern

            // 1. Feedback zurücksetzen und Button deaktivieren
            formMessages.textContent = '';
            formMessages.className = 'form-messages'; // CSS-Klassen zurücksetzen
            submitButton.disabled = true;
            submitButton.textContent = 'Wird gesendet...'; // Feedback für den Nutzer

            // 2. Formulardaten sammeln
            const formData = new FormData(contactForm);
            // Konvertieren in URL-codierte Daten (üblich für Webhooks)
            const urlEncodedData = new URLSearchParams(formData).toString();

            // 3. Daten an Make.com senden (Fetch API)
            fetch(makeWebhookUrl, {
                method: 'POST',
                headers: {
                    // Wichtig für Make.com, um die Daten korrekt zu interpretieren
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData // Sende die URL-codierten Daten
            })
                .then(response => {
                    // Prüfen, ob die Anfrage erfolgreich war (Status 2xx)
                    // Make.com Webhooks senden bei Erfolg oft nur "Accepted" als Text zurück.
                    if (response.ok) {
                        // Gib ein Signal für Erfolg zurück
                        return 'Erfolg';
                    } else {
                        // Wenn der Server einen Fehler meldet (z.B. 4xx, 5xx)
                        // Versuche, mehr Details zu bekommen und wirf einen Fehler
                        return response.text().then(text => {
                            throw new Error(`Serverfehler: ${response.status} ${response.statusText} - ${text || 'Keine Details'}`);
                        });
                    }
                })
                .then(result => {
                    // 4a. Erfolgreich gesendet
                    formMessages.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.';
                    formMessages.classList.add('success'); // Grüne Box anzeigen
                    contactForm.reset(); // Formularfelder leeren
                })
                .catch(error => {
                    // 4b. Fehler beim Senden
                    console.error('Fehler beim Senden des Formulars:', error);
                    formMessages.textContent = 'Leider gab es einen Fehler beim Senden Ihrer Nachricht. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.';
                    formMessages.classList.add('error'); // Rote Box anzeigen
                })
                .finally(() => {
                    // 5. Button wieder aktivieren (egal ob Erfolg oder Fehler)
                    submitButton.disabled = false;
                    submitButton.textContent = 'Nachricht senden';
                });
        });
    }

    // --- NEU: Cookie Consent Banner ---
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const rejectBtn = document.getElementById('cookie-reject-btn');
    const consentKey = 'cookieConsentGiven'; // Schlüssel für localStorage

    // Prüfen, ob bereits eine Zustimmung (oder Ablehnung) gespeichert ist
    const consentGiven = localStorage.getItem(consentKey);

    // Banner nur anzeigen, wenn noch keine Entscheidung getroffen wurde
    // (consentGiven ist null, wenn der Key nicht existiert)
    if (consentGiven === null) {
        // Kurze Verzögerung vor dem Einblenden (optional, für Effekt)
        setTimeout(() => {
            if (cookieBanner) { // Sicherstellen, dass Banner existiert
                cookieBanner.classList.add('show');
            }
        }, 500); // 500ms Verzögerung
    }

    // Event Listener für "Akzeptieren"-Button
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(consentKey, 'true'); // Zustimmung speichern
            if (cookieBanner) {
                cookieBanner.classList.remove('show'); // Banner ausblenden
                // Banner nach dem Ausblenden entfernen oder permanent auf display:none setzen
                setTimeout(() => { cookieBanner.style.display = 'none'; }, 500); // Warte auf Transition
            }
            console.log("Cookies akzeptiert. Hier Tracking-Skripte etc. laden!");
            // !!! HIER MUSS DEINE LOGIK HIN, UM TRACKING-SKRIPTE ZU LADEN !!!
            // loadTrackingScripts(); // Beispielaufruf einer Funktion
        });
    }

    // Event Listener für "Ablehnen"-Button
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem(consentKey, 'false'); // Ablehnung speichern
            if (cookieBanner) {
                cookieBanner.classList.remove('show'); // Banner ausblenden
                setTimeout(() => { cookieBanner.style.display = 'none'; }, 500); // Warte auf Transition
            }
            console.log("Nur notwendige Cookies akzeptiert.");
            // Hier sicherstellen, dass nur notwendige Cookies laufen
        });
    }
}); // Ende DOMContentLoaded