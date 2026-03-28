/**
 * WoodPages shared JavaScript.
 * Loaded at the bottom of every page after Bootstrap JS.
 */
(function () {
    'use strict';

    // ── Hamburger menu toggle ──────────────────────────────────
    var hamburgerToggle = document.getElementById('hamburger-toggle');
    var hamburgerMenu = document.getElementById('hamburger-menu');

    if (hamburgerToggle && hamburgerMenu) {
        hamburgerToggle.addEventListener('click', function () {
            // Close the language dropdown if it is open
            var langBtn = document.getElementById('lang-switcher');
            if (langBtn) {
                var bsDropdown = bootstrap.Dropdown.getInstance(langBtn);
                if (bsDropdown) {
                    bsDropdown.hide();
                }
            }
            this.classList.toggle('open');
            hamburgerMenu.classList.toggle('show');
            this.setAttribute('aria-expanded',
                this.classList.contains('open'));
        });
    }

    // When the language dropdown opens, close the hamburger menu
    var langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('show.bs.dropdown', function () {
            if (hamburgerToggle && hamburgerMenu) {
                hamburgerToggle.classList.remove('open');
                hamburgerMenu.classList.remove('show');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ── Cookie sync ────────────────────────────────────────────
    // Detect current language from the URL path (first path segment)
    var pathLang = window.location.pathname.split('/')[1]; // "es", "en", etc.
    var localeMap = { es: 'es_ES', en: 'en_EN', fr: 'fr_FR', de: 'de_DE' };
    if (localeMap[pathLang]) {
        document.cookie = 'woodstore_lang=' + localeMap[pathLang]
            + ';path=/;max-age=31536000;SameSite=Lax'
            + (location.protocol === 'https:' ? ';Secure' : '');
    }
})();
