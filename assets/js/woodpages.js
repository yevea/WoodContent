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
    var supportedLangs = ['es', 'en', 'fr', 'de'];
    var pathParts = window.location.pathname.split('/');

    // Find the language directory in the URL path. This works whether the
    // site is at the root (e.g. /es/faq.html) or under a subdirectory
    // (e.g. /WoodContent/es/faq.html).
    var langIndex = -1;
    for (var i = 0; i < pathParts.length; i++) {
        if (supportedLangs.indexOf(pathParts[i]) !== -1) {
            langIndex = i;
            break;
        }
    }
    var currentLang = langIndex !== -1 ? pathParts[langIndex] : 'es';
    var currentPage = (langIndex !== -1 && pathParts[langIndex + 1])
        ? pathParts[langIndex + 1]
        : 'faq.html';

    // Pages whose filename differs between languages.
    // Any page NOT listed here keeps its filename across all languages.
    var pageEquivalents = {
        // Contact pages
        'contactanos.html':  { es: 'contactanos.html', en: 'contact-us.html', fr: 'contact.html', de: 'kontakt.html' },
        'contact-us.html':   { es: 'contactanos.html', en: 'contact-us.html', fr: 'contact.html', de: 'kontakt.html' },
        'contact.html':      { es: 'contactanos.html', en: 'contact-us.html', fr: 'contact.html', de: 'kontakt.html' },
        'kontakt.html':      { es: 'contactanos.html', en: 'contact-us.html', fr: 'contact.html', de: 'kontakt.html' },
        // Terms / Conditions pages
        'condiciones-de-venta.html': { es: 'condiciones-de-venta.html', en: 'terms-of-sale.html', fr: 'conditions-de-vente.html', de: 'agbs.html' },
        'terms-of-sale.html':        { es: 'condiciones-de-venta.html', en: 'terms-of-sale.html', fr: 'conditions-de-vente.html', de: 'agbs.html' },
        'conditions-de-vente.html':  { es: 'condiciones-de-venta.html', en: 'terms-of-sale.html', fr: 'conditions-de-vente.html', de: 'agbs.html' },
        'agbs.html':                 { es: 'condiciones-de-venta.html', en: 'terms-of-sale.html', fr: 'conditions-de-vente.html', de: 'agbs.html' },
        // Instructions pages
        'instrucciones-de-uso.html':  { es: 'instrucciones-de-uso.html', en: 'instructions-for-use.html', fr: 'mode-d-emploi.html', de: 'gebrauchsanleitung.html' },
        'instructions-for-use.html':  { es: 'instrucciones-de-uso.html', en: 'instructions-for-use.html', fr: 'mode-d-emploi.html', de: 'gebrauchsanleitung.html' },
        'mode-d-emploi.html':         { es: 'instrucciones-de-uso.html', en: 'instructions-for-use.html', fr: 'mode-d-emploi.html', de: 'gebrauchsanleitung.html' },
        'gebrauchsanleitung.html':    { es: 'instrucciones-de-uso.html', en: 'instructions-for-use.html', fr: 'mode-d-emploi.html', de: 'gebrauchsanleitung.html' }
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
    /**
     * Fetch an HTML fragment from the same origin and inject it into a
     * placeholder element.  Only same-origin, whitelisted paths are loaded;
     * the content is trusted first-party HTML (our own header/footer files).
     */
    function loadFragment(url, placeholderId, callback) {
        var el = document.getElementById(placeholderId);
        if (!el) return;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
                    el.innerHTML = xhr.responseText; // safe: same-origin trusted HTML
                    if (callback) callback();
                } else {
                    // eslint-disable-next-line no-console
                    console.error('WoodPages: failed to load ' + url + ' (HTTP ' + xhr.status + ')');
                }
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
            if (supportedLangs.indexOf(lang) !== -1) {
                links[i].setAttribute('href', '../' + lang + '/' + pageForLang(lang));
            }
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

    // Load header and footer fragments (relative paths — works from any base URL)
    loadFragment('header.html', 'header-placeholder', initHeader);
    loadFragment('footer.html', 'footer-placeholder');

    // ── Cookie sync ────────────────────────────────────────────
    var localeMap = { es: 'es_ES', en: 'en_EN', fr: 'fr_FR', de: 'de_DE' };
    if (localeMap[currentLang]) {
        document.cookie = 'woodstore_lang=' + localeMap[currentLang]
            + ';path=/;max-age=31536000;SameSite=Lax'
            + (location.protocol === 'https:' ? ';Secure' : '');
    }
})();
