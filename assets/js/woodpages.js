/**
 * WoodPages shared JavaScript.
 * Loaded at the bottom of every page after Bootstrap JS.
 *
 * Responsibilities:
 *   1. Load centralised header.html and footer.html for the current language.
 *   2. Update the language-switcher links so they point to the equivalent
 *      page in every other language.
 *   3. Hamburger / language-dropdown toggle behaviour.
 *   4. Cookie sync with WoodStore.
 */
(function () {
    'use strict';

    // ── Helpers ────────────────────────────────────────────────
    var pathParts = window.location.pathname.split('/');
    var currentLang = pathParts[1] || 'es';                  // "es", "en", …
    var currentPage = pathParts[2] || 'faq.html';            // "faq.html", …

    // Pages whose filename differs between languages.
    // Any page NOT listed here keeps its filename across all languages.
    var pageEquivalents = {
        'condiciones.html': { es: 'condiciones.html', en: 'conditions.html', fr: 'conditions.html', de: 'agbs.html' },
        'conditions.html':  { es: 'condiciones.html', en: 'conditions.html', fr: 'conditions.html', de: 'agbs.html' },
        'agbs.html':        { es: 'condiciones.html', en: 'conditions.html', fr: 'conditions.html', de: 'agbs.html' }
    };

    /** Return the correct page filename for a given target language. */
    function pageForLang(targetLang) {
        var map = pageEquivalents[currentPage];
        if (map && map[targetLang]) {
            return map[targetLang];
        }
        return currentPage; // same filename
    }

    // ── Include loader ─────────────────────────────────────────
    function loadFragment(url, placeholderId, callback) {
        var el = document.getElementById(placeholderId);
        if (!el) return;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                el.innerHTML = xhr.responseText;
                if (callback) callback();
            }
        };
        xhr.send();
    }

    /** After header is injected, fix language-switcher hrefs and wire events. */
    function initHeader() {
        // Update language-switcher links
        var links = document.querySelectorAll('#woodstore-header [data-lang]');
        for (var i = 0; i < links.length; i++) {
            var lang = links[i].getAttribute('data-lang');
            links[i].setAttribute('href', '/' + lang + '/' + pageForLang(lang));
        }

        // ── Hamburger menu toggle ──────────────────────────────
        var hamburgerToggle = document.getElementById('hamburger-toggle');
        var hamburgerMenu   = document.getElementById('hamburger-menu');

        if (hamburgerToggle && hamburgerMenu) {
            hamburgerToggle.addEventListener('click', function () {
                var langBtn = document.getElementById('lang-switcher');
                if (langBtn) {
                    var bsDropdown = bootstrap.Dropdown.getInstance(langBtn);
                    if (bsDropdown) bsDropdown.hide();
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
    }

    // Load header and footer fragments
    loadFragment('/' + currentLang + '/header.html', 'header-placeholder', initHeader);
    loadFragment('/' + currentLang + '/footer.html', 'footer-placeholder');

    // ── Cookie sync ────────────────────────────────────────────
    var localeMap = { es: 'es_ES', en: 'en_EN', fr: 'fr_FR', de: 'de_DE' };
    if (localeMap[currentLang]) {
        document.cookie = 'woodstore_lang=' + localeMap[currentLang]
            + ';path=/;max-age=31536000;SameSite=Lax'
            + (location.protocol === 'https:' ? ';Secure' : '');
    }
})();
