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

}); // Ende DOMContentLoaded