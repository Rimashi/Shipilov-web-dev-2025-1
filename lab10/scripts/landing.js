document.addEventListener('DOMContentLoaded', function () {
    initLanding();
    initScrollAnimations();
    initMenuHighlight();
});

function initLanding() {
    console.log('Food Construct Landing инициализирован');

    document.body.classList.add('landing-loaded');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                const menuIcon = document.querySelector('.menu__icon');
                if (menuIcon && menuIcon.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // Валидация формы обратной связи
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Проверяем валидность формы
            if (!this.checkValidity()) {
                event.stopPropagation();
                this.classList.add('was-validated');
                return;
            }

            // Если форма валидна, отправляем данные
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Здесь обычно отправляем данные на сервер
            console.log('Данные формы:', formData);

            // Показываем сообщение об успехе
            alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');

            // Сбрасываем форму
            this.reset();
            this.classList.remove('was-validated');
        });

        // Динамическая валидация при вводе
        feedbackForm.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', function () {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                } else {
                    this.classList.add('is-invalid');
                }
            });
        });
    }
}

// Анимации элементов при скролле
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = [
        '.advantage',
        '.feature',
        '.stat',
        '.contact-card',
        '.hero__content',
        '.about__content',
        '.cta__content'
    ];

    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            observer.observe(element);
        });
    });
}

// Подсветка активного пункта меню при скролле
function initMenuHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const menuItems = document.querySelectorAll('.menu__item a');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const menuItem = document.querySelector(`.menu__item a[href="#${id}"]`);

            if (menuItem) {
                if (entry.isIntersecting) {
                    menuItems.forEach(item => {
                        item.parentElement.classList.remove('menu__item--active');
                    });

                    menuItem.parentElement.classList.add('menu__item--active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

function toggleMobileMenu() {
    const menuIcon = document.querySelector('.menu__icon');
    const menu = document.querySelector('.header__menu');
    const overlay = document.getElementById('menu_overlay');
    const body = document.body;

    if (menuIcon && menu && overlay) {
        menuIcon.classList.toggle('active');
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
}