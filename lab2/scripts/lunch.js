// ===== MODALS =====
const modals = {
    "constructor": `
        <div class="modal__background" id="modalBackground">
            <div class="modal__active modal__constructor">
                <div class="modal__close" data-modal-close>
                    <span>×</span>
                </div>
                <div class="modal__window constructor-modal">
                    <div class="constructor">
                        <h2 class="constructor__title">Конструктор ланча</h2>
                        <p class="constructor__description">Собери свой идеальный обед из наших свежих и вкусных блюд</p>

                        <div class="constructor__steps">
                            <div class="step active" data-step="1">
                                <h3>1. Выберите основное блюдо</h3>
                                <div class="options-container">
                                    <div class="option-card" data-price="385" data-name="Лазанья">
                                        <img src="https://via.placeholder.com/150" alt="Лазанья">
                                        <h4>Лазанья</h4>
                                        <p>Сочная лазанья с мясным рагу и сыром</p>
                                        <span class="price">385₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                    <div class="option-card" data-price="365" data-name="Том Ям с креветками">
                                        <img src="https://via.placeholder.com/150" alt="Том Ям">
                                        <h4>Том Ям с креветками</h4>
                                        <p>Острый тайский суп с креветками и кокосовым молоком</p>
                                        <span class="price">365₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                    <div class="option-card" data-price="270" data-name="Норвежский суп">
                                        <img src="https://via.placeholder.com/150" alt="Норвежский суп">
                                        <h4>Норвежский суп</h4>
                                        <p>Сытный суп с лососем и сливками</p>
                                        <span class="price">270₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                </div>
                            </div>

                            <div class="step" data-step="2">
                                <h3>2. Выберите гарнир</h3>
                                <div class="options-container">
                                    <div class="option-card" data-price="100" data-name="Рис с овощами">
                                        <img src="https://via.placeholder.com/150" alt="Рис с овощами">
                                        <h4>Рис с овощами</h4>
                                        <p>Рис с свежими сезонными овощами</p>
                                        <span class="price">100₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                    <div class="option-card" data-price="120" data-name="Картофельное пюре">
                                        <img src="https://via.placeholder.com/150" alt="Картофельное пюре">
                                        <h4>Картофельное пюре</h4>
                                        <p>Нежное картофельное пюре с зеленью</p>
                                        <span class="price">120₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                    <div class="option-card" data-price="150" data-name="Овощи на гриле">
                                        <img src="https://via.placeholder.com/150" alt="Овощи на гриле">
                                        <h4>Овощи на гриле</h4>
                                        <p>Смесь сезонных овощей на гриле</p>
                                        <span class="price">150₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                </div>
                            </div>

                            <div class="step" data-step="3">
                                <h3>3. Выберите салат</h3>
                                <div class="options-container">
                                    <div class="option-card" data-price="120" data-name="Греческий салат">
                                        <img src="https://via.placeholder.com/150" alt="Греческий салат">
                                        <h4>Греческий салат</h4>
                                        <p>Классический греческий салат с фетаксой</p>
                                        <span class="price">120₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                    <div class="option-card" data-price="110" data-name="Цезарь">
                                        <img src="https://via.placeholder.com/150" alt="Цезарь">
                                        <h4>Цезарь</h4>
                                        <p>Салат Цезарь с курицей и соусом</p>
                                        <span class="price">110₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                    <div class="option-card" data-price="130" data-name="Овощной салат">
                                        <img src="https://via.placeholder.com/150" alt="Овощной салат">
                                        <h4>Овощной салат</h4>
                                        <p>Свежий салат из сезонных овощей</p>
                                        <span class="price">130₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                </div>
                            </div>

                            <div class="step" data-step="4">
                                <h3>4. Выберите напиток</h3>
                                <div class="options-container">
                                    <div class="option-card" data-price="80" data-name="Морс">
                                        <img src="https://via.placeholder.com/150" alt="Морс">
                                        <h4>Морс</h4>
                                        <p>Ягодный морс</p>
                                        <span class="price">80₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                    <div class="option-card" data-price="90" data-name="Компот">
                                        <img src="https://via.placeholder.com/150" alt="Компот">
                                        <h4>Компот</h4>
                                        <p>Компот из свежих фруктов</p>
                                        <span class="price">90₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                    <div class="option-card" data-price="75" data-name="Вода">
                                        <img src="https://via.placeholder.com/150" alt="Вода">
                                        <h4>Вода</h4>
                                        <p>Минеральная вода без газа</p>
                                        <span class="price">75₽</span>
                                        <button class="select-btn">Выбрать</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="constructor__summary">
                            <h3>Ваш ланч:</h3>
                            <div class="selected-items">
                                <p>Основное блюдо: <span id="main-dish">Не выбрано</span></p>
                                <p>Гарнир: <span id="side-dish">Не выбрано</span></p>
                                <p>Салат: <span id="salad">Не выбрано</span></p>
                                <p>Напиток: <span id="drink">Не выбрано</span></p>
                            </div>
                            <div class="total-price">
                                <h3>Итого: <span id="total">0</span>₽</h3>
                            </div>
                            <button class="add-to-cart-btn fullwidth" id="add-to-cart" disabled>Добавить в корзину</button>
                        </div>

                        <div class="navigation-buttons">
                            <button class="nav-btn prev-btn" id="prev-btn">Назад</button>
                            <button class="nav-btn next-btn" id="next-btn">Далее</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    "basket": `
        <div class="modal__background" role="presentation">
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
    `,
}


ModalCore.register('constructor', modals.constructor);
ModalCore.register('basket', modals.basket);

// ==== Upload Menu =====
fetch('https://rimashi.github.io/Shipilov-web-dev-2025-1/lab2/scripts/menu.json')
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

        // Блок с блюдами
        let st = `<section class="dish__block" id="${category}">
                    <h2 class="dish__block-name">${ucfirst(dishes[0].category_ru)}</h2>
                    <div class="dish__block-dishes">`;

        dishes.forEach(item => {
            st += `
                <div class="dish__block-dish" data-id="${item.id}" data-price="${item.price}">
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
    sidebarNavSt += ``;

    sidebarNav.innerHTML = sidebarNavSt;
    menuBlock.innerHTML = appendList.join('');
}


// ==== Basket Functions ====

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
        // Сайдбар корзина
        const cartList = document.getElementById('cartList');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const cartWrapper = document.getElementById('cartWrapper');

        // Модальное окно корзины
        const cartModalList = document.getElementById('cartModalList');
        const cartModalTotal = document.getElementById('cartModalTotal');
        const cartModalCheckout = document.getElementById('cartModalCheckout');

        // Обновляем плавающую панель
        this.updateFloatingCart();

        // Сайдбар
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

                // Показываем сообщение о скрытых товарах
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

        // Модальное окно
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

    // Методы для плавающей панели
    updateFloatingCart() {
        const floatingCart = document.getElementById('floatingCart');
        const floatingCartCount = document.getElementById('floatingCartCount');
        const floatingCartTotal = document.getElementById('floatingCartTotal');

        if (floatingCart && floatingCartCount && floatingCartTotal) {
            const totalCount = this.getTotalCount();
            const totalPrice = this.getTotal();

            // Обновляем информацию
            floatingCartCount.textContent = `${totalCount} ${this.getNoun(totalCount, 'товар', 'товара', 'товаров')}`;
            floatingCartTotal.textContent = `${totalPrice}₽`;

            // Управляем видимостью
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

        // Отслеживаем скролл для показа/скрытия плавающей корзины
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

        // Если корзина видна в области просмотра (верхняя часть корзины выше 80% экрана)
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

            // Добавляем небольшую подсветку для привлечения внимания
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
            // Контролы корзины (работают для сайдбара и модального окна)
            if (e.target.matches('.cart-incr')) this.increaseQty(e.target.dataset.id);
            if (e.target.matches('.cart-decr')) this.decreaseQty(e.target.dataset.id);
            if (e.target.matches('.cart-remove')) this.removeItem(e.target.dataset.id);
        });

        // Checkout (сайдбар)
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length === 0) return alert('Корзина пуста');
                if (confirm(`Оформить заказ на сумму ${this.getTotal()}₽?`)) {
                    alert('Спасибо за заказ!');
                    this.clearCart();
                    ModalCore.close();
                }
            });
        }

        // Checkout (модальное окно)
        document.addEventListener('click', e => {
            if (e.target && e.target.id === 'cartModalCheckout') {
                if (this.items.length === 0) return alert('Корзина пуста');
                if (confirm(`Оформить заказ на сумму ${this.getTotal()}₽?`)) {
                    alert('Спасибо за заказ!');
                    this.clearCart();
                    ModalCore.close();
                }
            }
        });

        // Открытие модального окна корзины
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                ModalCore.open('basket');
                this.renderCart(); // обновить корзину в модальном окне
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.simpleCart = new SimpleCart();
});

// ==== LUNCH CONSTRUCTOR LOGIC ====
class LunchConstructor {
    constructor() {
        this.currentStep = 1;
        this.userSelection = {
            main: null,
            side: null,
            salad: null,
            drink: null
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.showStep(1);
        this.updateNavigation();
        this.updateSummary();
    }

    bindEvents() {
        // Делегирование событий для модального окна
        document.addEventListener('click', (e) => {
            if (e.target.closest('.option-card')) {
                this.handleOptionSelect(e.target.closest('.option-card'));
            }

            if (e.target.id === 'prev-btn') {
                this.goToPrevStep();
            }

            if (e.target.id === 'next-btn') {
                this.goToNextStep();
            }

            if (e.target.id === 'add-to-cart') {
                this.addToCart();
            }
        });
    }

    handleOptionSelect(card) {
        const step = card.closest('.step');
        const stepNum = parseInt(step.dataset.step);
        const category = this.getCategoryByStep(stepNum);

        // Убираем выделение с других карточек в этой категории
        step.querySelectorAll('.option-card').forEach(c => {
            c.classList.remove('selected');
        });

        // Выделяем текущую карточку
        card.classList.add('selected');

        // Сохраняем выбор
        this.userSelection[category] = {
            name: card.dataset.name,
            price: parseFloat(card.dataset.price)
        };

        // Обновляем итоги
        this.updateSummary();

        // Активируем кнопку "Далее"
        this.updateNavigation();
    }

    showStep(stepNum) {
        const steps = document.querySelectorAll('.constructor .step');
        steps.forEach(step => {
            step.classList.remove('active');
        });

        const currentStep = document.querySelector(`.constructor .step[data-step="${stepNum}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        this.currentStep = stepNum;
        this.updateNavigation();
    }

    goToPrevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    goToNextStep() {
        if (this.currentStep < 4) {
            this.showStep(this.currentStep + 1);
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const addToCartBtn = document.getElementById('add-to-cart');

        if (!prevBtn || !nextBtn) return;

        prevBtn.disabled = this.currentStep === 1;

        if (this.currentStep === 4) {
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            prevBtn.style.display = 'inline-block';
            nextBtn.disabled = !this.isStepCompleted(this.currentStep);
        }

        // Активируем/деактивируем кнопку "Добавить в корзину"
        if (addToCartBtn) {
            addToCartBtn.disabled = !this.isLunchComplete();
        }
    }

    isStepCompleted(stepNum) {
        const category = this.getCategoryByStep(stepNum);
        return this.userSelection[category] !== null;
    }

    isLunchComplete() {
        return this.userSelection.main &&
            this.userSelection.side &&
            this.userSelection.salad &&
            this.userSelection.drink;
    }

    getCategoryByStep(stepNum) {
        switch (stepNum) {
            case 1: return 'main';
            case 2: return 'side';
            case 3: return 'salad';
            case 4: return 'drink';
            default: return '';
        }
    }

    updateSummary() {
        // Обновляем информацию о выбранных блюдах
        this.updateElement('main-dish', this.userSelection.main?.name);
        this.updateElement('side-dish', this.userSelection.side?.name);
        this.updateElement('salad', this.userSelection.salad?.name);
        this.updateElement('drink', this.userSelection.drink?.name);

        // Рассчитываем и обновляем общую стоимость
        let total = 0;
        for (const category in this.userSelection) {
            if (this.userSelection[category]) {
                total += this.userSelection[category].price;
            }
        }
        this.updateElement('total', total);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || 'Не выбрано';
        }
    }

    addToCart() {
        if (!this.isLunchComplete()) return;

        // Собираем информацию о ланче
        const lunch = {
            id: 'lunch-' + Date.now(),
            title: 'Собранный ланч',
            price: this.calculateTotal(),
            description: this.getLunchDescription(),
            isLunch: true
        };

        // Добавляем в корзину
        if (window.simpleCart) {
            window.simpleCart.addItem(lunch);
            ModalCore.close();

            // Показываем уведомление
            this.showSuccessMessage();
        }
    }

    calculateTotal() {
        let total = 0;
        for (const category in this.userSelection) {
            if (this.userSelection[category]) {
                total += this.userSelection[category].price;
            }
        }
        return total;
    }

    getLunchDescription() {
        return `Ланч: ${this.userSelection.main.name}, ${this.userSelection.side.name}, ${this.userSelection.salad.name}, ${this.userSelection.drink.name}`;
    }

    showSuccessMessage() {
        // Можно добавить красивое уведомление
        alert('Ланч добавлен в корзину!');
    }

    reset() {
        this.currentStep = 1;
        this.userSelection = {
            main: null,
            side: null,
            salad: null,
            drink: null
        };

        // Сбрасываем визуальное состояние
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });

        this.showStep(1);
        this.updateSummary();
        this.updateNavigation();
    }
}

// Инициализация конструктора при открытии модального окна
document.addEventListener('modalOpened', (e) => {
    if (e.detail.name === 'constructor') {
        setTimeout(() => {
            window.lunchConstructor = new LunchConstructor();
        }, 100);
    }
});

// Сброс конструктора при закрытии модального окна
document.addEventListener('modalClosed', (e) => {
    if (e.detail.name === 'constructor' && window.lunchConstructor) {
        window.lunchConstructor.reset();
    }
});
