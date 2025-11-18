// ===== MODALS =====
const modals = {
    "payment": `
        <div class="modal__background" role="presentation" data-modal="payment">
            <div class="modal__active" role="dialog" aria-modal="true">
                <div class="modal__close" data-modal-close>
                    <span>×</span>
                </div>
                <div class="modal__window">
                    <h2>Данные для доставки</h2>
                    <div class="form-scroll-container">
                        <form id="deliveryForm">
                            <div class="form-group">
                                <label for="userName">Имя:</label>
                                <input type="text" id="userName" name="userName" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group" id="shareAgree">
                                <input type="checkbox" id="shareAgreeCheckbox" checked name="shareAgreeCheckbox" value="true">
                                <label for="shareAgreeCheckbox">Получать рекламные уведомления</label>
                            </div>
                            <div class="form-group">
                                <label for="userAddress">Адрес доставки:</label>
                                <textarea id="userAddress" name="userAddress" placeholder="Введите адрес доставки..." required></textarea>
                                <div class="input-caption">Доставка только по Москве</div>
                            </div>
                            <div class="form-group">
                                <label for="userPhone">Телефон:</label>
                                <input type="tel" id="userPhone" name="userPhone" placeholder="+7 (___) ___-__-__" required>
                            </div>
                            <div class="form-group">
                                <label for="userComment">Комментарий к заказу:</label>
                                <textarea id="userComment" name="userComment" placeholder="Ваши пожелания к заказу..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Время доставки:</label>
                                <div class="radio-group">
                                    <label class="radio-label">
                                        <input type="radio" name="deliveryType" value="standard" checked>
                                        <span>Как можно скорее</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="deliveryType" value="timed">
                                        <span>К указанному времени</span>
                                    </label>
                                </div>
                                <div id="timeInputContainer" class="hidden">
                                    <label for="deliveryTime">Время доставки:</label>
                                    <input type="time" id="deliveryTime" name="deliveryTime">
                                    <div class="input-caption">Время доставки с 7:00 до 23:00</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-actions">
                        <button type="button" id="resetBtn" class="btn btn-secondary">Сбросить форму</button>
                        <button type="submit" form="deliveryForm" class="btn btn-primary">Оформить заказ</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    "basket": `
        <div class="modal__background" role="presentation" data-modal="basket">
            <div class="modal__active" role="dialog" aria-modal="true">
                <div class="modal__close" data-modal-close>
                    <span>×</span>
                </div>
                <div class="modal__window">
                    <h2>Корзина</h2>
                    <div class="cart-modal__body">
                        <ul id="cartModalList" class="cart-list"></ul>
                        <div class="cart-modal__footer">
                            <div class="cart-total">Итого: <strong id="cartModalTotal">0₽</strong></div>
                            <button id="cartModalCheckout" class="fullwidth" type="button">Перейти к оплате</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Регистрируем модальные окна
ModalCore.register('payment', modals.payment);
ModalCore.register('basket', modals.basket);

// ==== Upload Menu =====
fetch('https://rimashi.github.io/Shipilov-web-dev-2025-1/lab5/scripts/menu.json')
    .then((res) => {
        if (!res.ok) {
            console.log("error");
            return;
        }
        return res.json();
    })
    .then((jsonData) => {
        let element = document.getElementById('dish_menu');
        addMenu(jsonData, element);
    })
    .catch(err => {
        console.error(err);
    });

function groupByCategory(menuList) {
    return menuList.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});
}

function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRuType(str) {
    const types = {
        "vegan": "Веганское",
        "meat": "Мясное",
        "fish": "Рыбное",
        "seafood": "Морепродукты",
        "cold": "Холодные",
        "hot": "Горячие",
    }

    return types[str] || str;
}

// ===== FILTER FUNCTIONALITY =====
function initFilters() {
    // Обработчики для кнопок фильтров
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('type__button')) {
            const button = e.target;
            const section = button.closest('.dish__block');
            const filterType = button.dataset.type;

            section.querySelectorAll('.type__button').forEach(btn => {
                btn.classList.remove('type__button--selected');
            });
            button.classList.add('type__button--selected');

            filterDishes(section, filterType);
        }
    });
}

function filterDishes(section, filterType) {
    const dishes = section.querySelectorAll('.dish__block-dish');

    dishes.forEach(dish => {
        if (filterType === 'all') {
            dish.style.display = 'flex';
        } else {
            const dishType = dish.dataset.type;
            dish.style.display = dishType === filterType ? 'flex' : 'none';
        }
    });
}

function getAllTypesForCatagery(menuList) {
    const typesSet = new Set();
    menuList.forEach(item => typesSet.add(item.type));
    return Array.from(typesSet);
}

function addMenu(menuJson, element) {
    const menuList = groupByCategory(menuJson);
    const menuBlock = element;
    const sidebarNav = document.querySelector('.side__nav ul');

    let appendList = [];
    sidebarNav.innerHTML = '';
    let sidebarNavSt = ``;

    const grouped = menuJson.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    for (const category in grouped) {
        const dishes = grouped[category];

        console.log(dishes);

        let st = `<section class="dish__block" id="${category}">
                    <h2 class="dish__block-name">${ucfirst(dishes[0].category_ru)}</h2>
                    <div class="dish__block-type">
                        <button class="type__button type__button--selected" data-type="all">Все</button>`;

        let allTypes = getAllTypesForCatagery(dishes);
        allTypes.forEach(type => {
            st += `<button class="type__button" data-type="${type}">${getRuType(type)}</button>`;
        });

        st += `     </div>
                    <div class="dish__block-dishes">`;

        dishes.forEach(item => {
            st += `
                <div class="dish__block-dish" data-id="${item.id}" data-price="${item.price}" data-type="${item.type}">
                    <div class="dish__image">
                        <img src="${item.img}" alt="${ucfirst(item.name)}">
                    </div>
                    <div class="dish__price">
                        <p>${item.price}₽</p>
                    </div>
                    <div class="dish__name">
                        <p>${ucfirst(item.name)}</p>
                    </div>
                    <div class="dish__weight">${item.weight}</div>
                    <div class="dish__add-button"><input type="button" value="Добавить"></div>
                </div>
            `;
        });

        st += `</div></section>`;
        appendList.push(st);
        sidebarNavSt += `<li><a href="#${category}">${ucfirst(dishes[0].category_ru)}</a></li>`
    }

    sidebarNav.innerHTML = sidebarNavSt;
    menuBlock.innerHTML = appendList.join('');

    initFilters();
}

// ===== SIMPLE CART =====
class SimpleCart {
    constructor() {
        this.STORAGE_KEY = 'fc_cart';
        this.items = this.loadCart();
        this.isFloatingCartVisible = false;
        this.hasUserScrolledToCart = false;
        this.renderCart();
        this.bindEvents();
        this.initFloatingCart();
    }

    loadCart() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    }

    saveCart() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    }

    addItem(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            this.items.push({ ...product, qty: 1 });
        }
        this.updateCart();
    }

    removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.updateCart();
    }

    increaseQty(id) {
        const item = this.items.find(i => i.id === id);
        if (item) item.qty++;
        this.updateCart();
    }

    decreaseQty(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;
        item.qty--;
        if (item.qty <= 0) this.removeItem(id);
        else this.updateCart();
    }

    clearCart() {
        this.items = [];
        this.updateCart();
    }

    getTotal() {
        return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    }

    getTotalCount() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    }

    getNoun(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) {
            return five;
        }
        n %= 10;
        if (n === 1) {
            return one;
        }
        if (n >= 2 && n <= 4) {
            return two;
        }
        return five;
    }

    renderCart() {
        const cartList = document.getElementById('cartList');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const cartWrapper = document.getElementById('cartWrapper');

        const cartModalList = document.getElementById('cartModalList');
        const cartModalTotal = document.getElementById('cartModalTotal');
        const cartModalCheckout = document.getElementById('cartModalCheckout');

        this.updateFloatingCart();

        // Сайдбар корзина
        if (cartList) {
            cartList.innerHTML = '';
            if (this.items.length === 0) {
                cartList.innerHTML = '<li class="cart-empty">Корзина пуста</li>';
                if (cartTotal) cartTotal.textContent = '0₽';
                if (checkoutBtn) checkoutBtn.disabled = true;
                if (cartWrapper) cartWrapper.classList.remove('compact');
            } else {
                const displayItems = this.items.slice(0, 4);
                const hiddenCount = this.items.length - 4;

                displayItems.forEach(item => {
                    cartList.innerHTML += `
                        <li class="cart-item">
                            <div class="cart-item__name">${item.title}</div>
                            <div class="cart-item__total">${item.price * item.qty}₽</div>
                            <div class="cart-item__price">${item.price}₽ за шт.</div>
                            <div class="cart-item__controls">
                                <div class="cart-controls">
                                    <button class="cart-decr" data-id="${item.id}">−</button>
                                    <span class="cart-qty">${item.qty}</span>
                                    <button class="cart-incr" data-id="${item.id}">+</button>
                                    <button class="cart-remove" data-id="${item.id}">✕</button>
                                </div>
                            </div>
                        </li>
                    `;
                });

                if (hiddenCount > 0) {
                    const hiddenElement = document.createElement('li');
                    hiddenElement.className = 'cart-hidden-items';
                    hiddenElement.textContent = `... и еще ${hiddenCount} товар${this.getNoun(hiddenCount, '', 'а', 'ов')}`;
                    cartList.appendChild(hiddenElement);
                }

                if (cartTotal) cartTotal.textContent = this.getTotal() + '₽';
                if (checkoutBtn) checkoutBtn.disabled = false;
                if (cartWrapper) cartWrapper.classList.toggle('compact', this.items.length > 4);
            }
        }

        // Модальное окно корзины
        if (cartModalList) {
            cartModalList.innerHTML = '';
            if (this.items.length === 0) {
                cartModalList.innerHTML = '<li class="cart-empty">Корзина пуста</li>';
                if (cartModalTotal) cartModalTotal.textContent = '0₽';
                if (cartModalCheckout) cartModalCheckout.disabled = true;
            } else {
                this.items.forEach(item => {
                    cartModalList.innerHTML += `
                        <li class="cart-item cart-item-modal">
                            <div class="cart-item__name">${item.title}</div>
                            <div class="cart-item__price">${item.price}₽ за шт.</div>
                            <div class="cart-item__controls">
                                <div class="cart-controls">
                                    <button class="cart-decr" data-id="${item.id}">−</button>
                                    <span class="cart-qty">${item.qty}</span>
                                    <button class="cart-incr" data-id="${item.id}">+</button>
                                    <button class="cart-remove" data-id="${item.id}">✕</button>
                                </div>
                            </div>
                            <div class="cart-item__total">${item.price * item.qty}₽</div>
                        </li>
                    `;
                });
                if (cartModalTotal) cartModalTotal.textContent = this.getTotal() + '₽';
                if (cartModalCheckout) cartModalCheckout.disabled = false;
            }
        }
    }

    updateFloatingCart() {
        const floatingCart = document.getElementById('floatingCart');
        const floatingCartCount = document.getElementById('floatingCartCount');
        const floatingCartTotal = document.getElementById('floatingCartTotal');

        if (floatingCart && floatingCartCount && floatingCartTotal) {
            const totalCount = this.getTotalCount();
            const totalPrice = this.getTotal();

            floatingCartCount.textContent = `${totalCount} ${this.getNoun(totalCount, 'товар', 'товара', 'товаров')}`;
            floatingCartTotal.textContent = `${totalPrice}₽`;

            if (totalCount === 0) {
                this.hideFloatingCart();
            } else if (!this.hasUserScrolledToCart) {
                this.showFloatingCart();
            }
        }
    }

    showFloatingCart() {
        const floatingCart = document.getElementById('floatingCart');
        if (floatingCart && !this.isFloatingCartVisible) {
            floatingCart.style.display = 'flex';
            setTimeout(() => {
                floatingCart.classList.add('visible');
                floatingCart.classList.remove('hidden');
            }, 10);
            this.isFloatingCartVisible = true;
        }
    }

    hideFloatingCart() {
        const floatingCart = document.getElementById('floatingCart');
        if (floatingCart && this.isFloatingCartVisible) {
            floatingCart.classList.remove('visible');
            floatingCart.classList.add('hidden');
            setTimeout(() => {
                if (floatingCart.classList.contains('hidden')) {
                    floatingCart.style.display = 'none';
                }
            }, 300);
            this.isFloatingCartVisible = false;
        }
    }

    initFloatingCart() {
        const floatingCartBtn = document.getElementById('floatingCartBtn');
        if (floatingCartBtn) {
            floatingCartBtn.addEventListener('click', () => {
                this.scrollToCart();
            });
        }

        this.initScrollHandler();
    }

    initScrollHandler() {
        let scrollTimeout;

        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.checkCartVisibility();
            }, 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    checkCartVisibility() {
        if (this.items.length === 0) return;

        const cartElement = document.querySelector('.side__menu-basket');
        if (!cartElement) return;

        const rect = cartElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8) {
            this.hasUserScrolledToCart = true;
            this.hideFloatingCart();
        } else {
            this.hasUserScrolledToCart = false;
            this.showFloatingCart();
        }
    }

    scrollToCart() {
        const cartElement = document.querySelector('.side__menu-basket');
        if (cartElement) {
            cartElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            cartElement.style.boxShadow = '0 0 0 2px var(--accent-color)';
            setTimeout(() => {
                cartElement.style.boxShadow = '';
            }, 2000);

            this.hideFloatingCart();
            this.hasUserScrolledToCart = true;
        }
    }

    updateCart() {
        this.saveCart();
        this.renderCart();
    }

    bindEvents() {
        document.addEventListener('click', e => {
            // Добавление товара
            const addBtn = e.target.closest('.dish__add-button input');
            if (addBtn) {
                const card = addBtn.closest('.dish__block-dish');
                this.addItem({
                    id: card.dataset.id,
                    title: card.querySelector('.dish__name p').textContent,
                    price: Number(card.dataset.price)
                });
            }
            // Контролы корзины
            if (e.target.matches('.cart-incr')) this.increaseQty(e.target.dataset.id);
            if (e.target.matches('.cart-decr')) this.decreaseQty(e.target.dataset.id);
            if (e.target.matches('.cart-remove')) this.removeItem(e.target.dataset.id);
        });

        // Checkout (сайдбар)
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length === 0) return alert('Корзина пуста');
                ModalCore.open('payment');
            });
        }

        // Checkout (модальное окно корзины)
        document.addEventListener('click', e => {
            if (e.target && e.target.id === 'cartModalCheckout') {
                if (this.items.length === 0) return alert('Корзина пуста');
                ModalCore.close();
                ModalCore.open('payment');
            }
        });

        // Открытие модального окна корзины
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                ModalCore.open('basket');
                this.renderCart();
            });
        }
    }
}

// ===== PAYMENT MODAL FUNCTIONALITY =====
class PaymentModal {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Вешаем обработчики один раз при создании класса
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-modal-open="payment"]') ||
                e.target.id === 'checkoutBtn' ||
                e.target.id === 'cartModalCheckout') {

                // Инициализируем модалку при первом открытии
                if (!this.isInitialized) {
                    this.initializeModal();
                    this.isInitialized = true;
                }
            }
        });
    }

    initializeModal() {
        const form = document.getElementById('deliveryForm');
        if (!form) return;

        // Маска для номера телефона
        const phoneInput = document.getElementById('userPhone');
        if (phoneInput) this.createPhoneMask(phoneInput);

        // Динамическое расширение textarea
        const addressTextarea = document.getElementById('userAddress');
        const commentTextarea = document.getElementById('userComment');
        if (addressTextarea) this.setupAutoResize(addressTextarea);
        if (commentTextarea) this.setupAutoResize(commentTextarea);

        // Показ/скрытие поля времени
        this.setupConditionalTimeField();

        // Кнопка сброса формы
        this.setupResetButton();

        // Обработчик отправки формы
        this.setupFormSubmit();
    }

    createPhoneMask(input) {
        const handler = (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '+7 (';

            if (value.length > 1) {
                value = value.substring(1);
            }

            if (value.length > 0) {
                formattedValue += value.substring(0, 3);
            }
            if (value.length > 3) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length > 6) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length > 8) {
                formattedValue += '-' + value.substring(8, 10);
            }

            e.target.value = formattedValue;
        };

        input.addEventListener('input', handler);
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbers = pastedText.replace(/\D/g, '');
            input.value = '+7 (' + numbers.substring(1, 4) + ') ' + numbers.substring(4, 7) + '-' + numbers.substring(7, 9) + '-' + numbers.substring(9, 11);
        });
    }

    setupAutoResize(textarea) {
        const resize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
        };

        textarea.addEventListener('input', resize);
        setTimeout(resize, 10);
    }

    setupConditionalTimeField() {
        const deliveryRadios = document.querySelectorAll('input[name="deliveryType"]');
        const timeInputContainer = document.getElementById('timeInputContainer');

        const toggleTimeField = () => {
            const timedDeliverySelected = document.querySelector('input[name="deliveryType"]:checked').value === 'timed';
            if (timeInputContainer) {
                timeInputContainer.classList.toggle('hidden', !timedDeliverySelected);
            }
        };

        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', toggleTimeField);
        });

        // Инициализация при загрузке
        toggleTimeField();
    }

    validateTime(timeValue) {
        if (!timeValue) return true; // Пустое время - валидно (не обязательно)

        const [hours, minutes] = timeValue.split(':').map(Number);
        // Проверяем, находится ли время в допустимом диапазоне (7:00-23:00)
        return hours >= 7 && hours <= 23;
    }

    setupResetButton() {
        const resetBtn = document.getElementById('resetBtn');
        const form = document.getElementById('deliveryForm');

        if (resetBtn && form) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Вы уверены, что хотите сбросить все данные формы?')) {
                    form.reset();
                    const timeInputContainer = document.getElementById('timeInputContainer');
                    if (timeInputContainer) timeInputContainer.classList.add('hidden');

                    const addressTextarea = document.getElementById('userAddress');
                    const commentTextarea = document.getElementById('userComment');
                    if (addressTextarea) addressTextarea.style.height = 'auto';
                    if (commentTextarea) commentTextarea.style.height = 'auto';

                    // Сбрасываем валидацию времени
                    const deliveryTime = document.getElementById('deliveryTime');
                    const timeValidationError = document.getElementById('timeValidationError');
                    if (deliveryTime) deliveryTime.classList.remove('invalid');
                    if (timeValidationError) timeValidationError.classList.add('hidden');

                    const userName = document.getElementById('userName');
                    if (userName) userName.focus();
                }
            });
        }
    }

    setupFormSubmit() {
        const form = document.getElementById('deliveryForm');
        if (!form) return;

        // находим кнопку отправки (вне формы она задана через form="deliveryForm")
        const submitBtn = document.querySelector('button[form="deliveryForm"][type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Валидация телефона
            const phoneInput = document.getElementById('userPhone');
            const phoneValue = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
            if (phoneValue.length !== 11) {
                alert('Пожалуйста, введите корректный номер телефона');
                if (phoneInput) phoneInput.focus();
                return;
            }

            // Валидация времени доставки (только при отправке)
            const deliveryTime = document.getElementById('deliveryTime');
            const timeValue = deliveryTime ? deliveryTime.value : '';
            if (timeValue && !this.validateTime(timeValue)) {
                if (deliveryTime) deliveryTime.classList.add('invalid');
                alert('Время доставки должно быть между 7:00 и 23:00');
                if (deliveryTime) deliveryTime.focus();
                return;
            } else {
                if (deliveryTime) deliveryTime.classList.remove('invalid');
            }

            // Сбор данных
            const formData = new FormData(form);
            const deliveryData = {
                userName: formData.get('userName'),
                email: formData.get('email'),
                userAddress: formData.get('userAddress'),
                userPhone: formData.get('userPhone'),
                userComment: formData.get('userComment'),
                deliveryType: formData.get('deliveryType'),
                deliveryTime: formData.get('deliveryTime'),
                cartItems: window.simpleCart?.items || [],
                advertismentAgree: formData.get('shareAgreeCheckbox') === "true",
                total: window.simpleCart?.getTotal() || 0
            };

            // Блокируем кнопку отправки
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.dataset.prevText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
            }

            try {
                const resp = await fetch('https://httpbin.org/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(deliveryData),
                });

                if (!resp.ok) throw new Error(`Сервер вернул ${resp.status}`);

                const respJson = await resp.json();

                console.log(respJson);

                // Очистка корзины после успешной отправки
                if (window.simpleCart) window.simpleCart.clearCart();
                ModalCore.close();
            } catch (err) {
                console.error(err);
                alert('Ошибка при отправке заказа: ' + (err.message || err));
            } finally {
                // Восстанавливаем кнопку (если форма по-прежнему присутствует)
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.prevText || 'Оформить заказ';
                }
            }
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.simpleCart = new SimpleCart();
    window.paymentModal = new PaymentModal();
});