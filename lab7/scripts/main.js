// ===== BURGER MENU =====
document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.menu__icon');
    const menu = document.querySelector('.header__menu');
    const menuOverlay = document.getElementById('menu_overlay');
    const body = document.body;

    // Проверяем, что все элементы существуют :cite[2]:cite[3]
    if (!menuIcon || !menu || !menuOverlay) {
        console.error('One or more menu elements not found:', {
            menuIcon: !!menuIcon,
            menu: !!menu,
            menuOverlay: !!menuOverlay
        });
        return;
    }

    // Функция открытия/закрытия меню
    function toggleMenu() {
        menuIcon.classList.toggle('active');
        menu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');

        console.log('Menu toggled. Active:', menu.classList.contains('active'));
    }

    // Обработчик клика по иконке меню
    menuIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        console.log('Menu icon clicked');
        toggleMenu();
    });

    // Обработчик клика по оверлею (закрытие меню)
    menuOverlay.addEventListener('click', function (e) {
        e.stopPropagation();
        if (menu.classList.contains('active')) {
            console.log('Overlay clicked, closing menu');
            toggleMenu();
        }
    });

    // Закрытие меню при клике на ссылку
    const menuLinks = document.querySelectorAll('.menu__list a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (menu.classList.contains('active')) {
                console.log('Menu link clicked, closing menu');
                toggleMenu();
            }
        });
    });

    // Закрытие меню при изменении размера окна 
    // (на случай перехода с мобильной на десктопную версию)
    window.addEventListener('resize', function () {
        if (window.innerWidth > 767 && menu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// ===== ModalManager =====
(function (global) {
    class ModalManager {
        constructor(container = document.body) {
            this.templates = {}; // ключ -> html шаблон (string)
            this.container = container;
            this.active = null; // текущая открытая модалка (DOM element)
            document.addEventListener('click', this._click.bind(this));
            document.addEventListener('keydown', this._key.bind(this));
        }

        // Регистрируем шаблон (строкой) по ключу
        register(key, html) {
            if (!key || typeof html !== 'string') return;
            this.templates[key] = html;
        }

        // Делегированный клик-обработчик
        _click(e) {
            const open = e.target.closest('[data-modal-open]');
            if (open) {
                const key = open.dataset.modalOpen;
                this.open(key);
                return;
            }

            if (e.target.closest('[data-modal-close]')) {
                this.close();
                return;
            }

            const backdrop = e.target.closest('.modal__background');
            // клик по реальному фон-блоку (не по внутреннему содержимому)
            if (backdrop &&
                e.target === backdrop &&
                backdrop.classList.contains('active')) {
                this.close();
            }
        }

        // Esc -> закрыть
        _key(e) {
            if (e.key === 'Escape') this.close();
        }

        // Вставляем шаблон в DOM, если его ещё нет
        _ensureInDOM(key) {
            if (!this.templates[key]) return;
            if (this.container.querySelector(`[data-modal="${key}"]`)) return;

            const wrap = document.createElement('div');
            wrap.innerHTML = this.templates[key].trim();
            const el = wrap.firstElementChild;
            if (!el) return;

            // помечаем модалку датасетом, чтобы находить её позже
            el.dataset.modal = key;

            // в шаблонах не использовать фиксированные ID, чтобы не дублировать
            this.container.appendChild(el);
        }

        // Открыть модалку по ключу
        open(key) {
            if (!key) return;
            if (!this.templates[key]) {
                console.warn('Modal template not registered:', key);
                return;
            }
            this._ensureInDOM(key);
            const el = this.container.querySelector(`[data-modal="${key}"]`);
            if (!el) return;
            el.classList.add('active');
            document.body.classList.add('modal-open');
            this.active = el;

            // фокус на первый фокусируемый элемент
            
            const focusEl = el.querySelector('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
            if (focusEl) focusEl.focus();
        }


        // Закрыть текущую модалку
        close() {
            if (!this.active) return;
            this.active.classList.remove('active');
            document.body.classList.remove('modal-open');
            this.active = null;
        }
    }
    global.ModalCore = new ModalManager();
})(window);

// ==== Theme Switcher ====
class ThemeSwitcher {
    constructor(toggleSelector = '#themeToggle') {
        this.el = document.querySelector(toggleSelector);
        this.themeKey = 'theme';
        this._applySaved();
        this._bind();
    }

    _applySaved() {
        const current = localStorage.getItem(this.themeKey) || 'light';
        if (current === 'dark') document.body.classList.add('dark-theme');
        if (this.el) {
            if (document.body.classList.contains('dark-theme')) {
                this.el.textContent = '☀️';
            } else {
                this.el.textContent = '🌙';
            }
        }
    }

    _bind() {
        if (!this.el) return;
        this.el.addEventListener('click', () => this.toggle());
    }

    toggle() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
        if (this.el) this.el.textContent = isDark ? '☀️' : '🌙';
    }
}
window.themeSwitcher = new ThemeSwitcher();
