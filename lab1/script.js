document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.menu__icon');
    const menu = document.querySelector('.header__menu');
    const menuOverlay = document.getElementById('menu_overlay');
    const body = document.body;

    // Функция открытия/закрытия меню
    function toggleMenu() {
        menuIcon.classList.toggle('active');
        menu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    // Обработчик клика по иконке меню
    menuIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Обработчик клика по оверлею (закрытие меню)
    menuOverlay.addEventListener('click', function () {
        if (menu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Закрытие меню при клике на ссылку
    const menuLinks = document.querySelectorAll('.menu__list a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (menu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Функционал смены темы
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Проверяем сохраненную тему или системные настройки
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme'); // гарантированно светлая
        themeToggle.textContent = '🌙';
    }

    // Обработчик переключения темы
    themeToggle.addEventListener('click', function () {
        const isDark = document.body.classList.toggle('dark-theme');
        if (isDark) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
});
