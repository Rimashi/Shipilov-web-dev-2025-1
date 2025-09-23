// Модальное окно
const modalBackground = document.getElementById('modalBackground');
const modalClose = document.getElementById('modalClose');
const configuratorButton = document.querySelector('.side__menu-configure input');

// Функция открытия модального окна
function openModal() {
    modalBackground.classList.add('active');
    document.body.classList.add('modal-open');
}

// Функция закрытия модального окна
function closeModal() {
    modalBackground.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Открытие по кнопке "Попробовать конфигуратор"
if (configuratorButton) {
    configuratorButton.addEventListener('click', openModal);
}

// Закрытие по крестику
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Закрытие по клику вне области
if (modalBackground) {
    modalBackground.addEventListener('click', function (event) {
        if (event.target === modalBackground) {
            closeModal();
        }
    });
}

// Закрытие по клавише Esc
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modalBackground.classList.contains('active')) {
        closeModal();
    }
});

// Бургер меню
const menuIcon = document.getElementById('menuIcon');
const headerMenu = document.getElementById('headerMenu');
const menuOverlay = document.getElementById('menu_overlay');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('active');
    headerMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = headerMenu.classList.contains('active') ? 'hidden' : '';
});

menuOverlay.addEventListener('click', () => {
    menuIcon.classList.remove('active');
    headerMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Переключение темы
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    }
});

// Корзина
(function () {
    const STORAGE_KEY = 'fc_cart_v1';
    let CART = [];

    // Элементы
    const cartListEl = document.getElementById('cartList');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartToggleBtn = document.getElementById('cartToggle');
    const cartWrapper = document.getElementById('cartWrapper');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Загрузка из localStorage
    function loadCart() {
        try {
            CART = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            CART = [];
        }
    }

    function saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(CART));
    }

    // Вспомогательные функции
    function findItem(id) {
        return CART.find(i => i.id === id);
    }

    function formatPrice(n) {
        return n + '₽';
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // Отрисовка корзины
    function renderCart() {
        cartListEl.innerHTML = '';

        if (CART.length === 0) {
            cartListEl.innerHTML = '<li class="cart-empty small-muted">Корзина пуста</li>';
            cartTotalEl.textContent = formatPrice(0);
            cartToggleBtn.style.display = 'none';
            document.querySelector('.side__menu-basket')?.classList.remove('expanded');
            cartToggleBtn.setAttribute('aria-expanded', 'false');
            checkoutBtn.disabled = true;
            return;
        }

        CART.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.dataset.id = item.id;

            li.innerHTML = `
                <div class="left">
                    <div class="name-row">
                        <div class="dish-name" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</div>
                        ${item.qty > 1 ? `<div class="qty">x${item.qty}</div>` : ''}
                    </div>
                    <div class="muted small-muted">${formatPrice(item.price)} за шт.</div>
                </div>
                <div class="right">
                    <div class="price">${formatPrice(item.price * item.qty)}</div>
                    <div class="cart-controls">
                        <button class="cart-decr" data-id="${item.id}" title="Уменьшить">−</button>
                        <button class="cart-incr" data-id="${item.id}" title="Увеличить">+</button>
                        <button class="cart-remove" data-id="${item.id}" title="Удалить">✕</button>
                    </div>
                </div>
            `;
            cartListEl.appendChild(li);
        });

        const total = CART.reduce((sum, item) => sum + item.price * item.qty, 0);
        cartTotalEl.textContent = formatPrice(total);

        if (CART.length > 3) {
            cartToggleBtn.style.display = 'block';
            const expanded = document.querySelector('.side__menu-basket').classList.contains('expanded');
            cartToggleBtn.textContent = expanded ? 'Свернуть' : 'Развернуть';
            cartToggleBtn.setAttribute('aria-expanded', String(expanded));
        } else {
            cartToggleBtn.style.display = 'none';
            document.querySelector('.side__menu-basket').classList.remove('expanded');
            cartToggleBtn.setAttribute('aria-expanded', 'false');
        }

        checkoutBtn.disabled = false;
    }

    // Функции корзины
    function addItem(item) {
        const existing = findItem(item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            CART.push({
                id: item.id,
                title: item.title,
                price: item.price,
                qty: 1
            });
        }
        saveCart();
        renderCart();
    }

    function incrItem(id) {
        const item = findItem(id);
        if (item) {
            item.qty += 1;
            saveCart();
            renderCart();
        }
    }

    function decrItem(id) {
        const item = findItem(id);
        if (!item) return;

        item.qty = Math.max(0, item.qty - 1);
        if (item.qty === 0) {
            CART = CART.filter(x => x.id !== id);
        }
        saveCart();
        renderCart();
    }

    function removeItem(id) {
        CART = CART.filter(x => x.id !== id);
        saveCart();
        renderCart();
    }

    // Обработчики событий
    document.addEventListener('click', function (e) {
        // Добавление в корзину
        if (e.target.closest('.dish__add-button input')) {
            const card = e.target.closest('.dish__block-dish');
            if (!card) return;

            const id = card.dataset.id;
            const price = Number(card.dataset.price);
            const title = card.querySelector('.dish__name p').textContent.trim();

            addItem({ id, title, price });

            // Анимация кнопки
            e.target.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(0.95)' },
                { transform: 'scale(1)' }
            ], { duration: 200 });
        }

        // Управление корзиной
        if (e.target.matches('.cart-incr')) {
            incrItem(e.target.dataset.id);
        }

        if (e.target.matches('.cart-decr')) {
            decrItem(e.target.dataset.id);
        }

        if (e.target.matches('.cart-remove')) {
            if (confirm('Удалить товар из корзины?')) {
                removeItem(e.target.dataset.id);
            }
        }
    });

    // Развернуть/свернуть корзину
    cartToggleBtn.addEventListener('click', function () {
        const basket = document.querySelector('.side__menu-basket');
        basket.classList.toggle('expanded');
        const expanded = basket.classList.contains('expanded');
        cartToggleBtn.textContent = expanded ? 'Свернуть' : 'Развернуть';
        cartToggleBtn.setAttribute('aria-expanded', String(expanded));
    });

    // Оформление заказа
    checkoutBtn.addEventListener('click', function () {
        if (CART.length === 0) {
            alert('Корзина пуста');
            return;
        }

        const total = CART.reduce((sum, item) => sum + item.price * item.qty, 0);
        if (confirm(`Оформить заказ на сумму ${formatPrice(total)}?`)) {
            alert('Спасибо за заказ! Ваш заказ принят в обработку.');
            CART = [];
            saveCart();
            renderCart();
        }
    });

    // Инициализация
    loadCart();
    renderCart();
})();