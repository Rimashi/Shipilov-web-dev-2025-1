// ===== MODALS =====
const modals = {
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
                            <div class="cart-total">
                                Итого: <strong id="cartModalTotal">0₽</strong>
                            </div>
                            <button id="cartModalCheckout" class="fullwidth">
                                Перейти к оплате
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Регистрируем модальные окна
ModalCore.register('basket', modals.basket);

// ===== FILTER FUNCTIONALITY =====
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

function initFilters() {
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

function addMenu(menuJson, element) {
    const menuBlock = element;
    const sidebarNav = document.querySelector('.side__nav ul');

    let appendList = [];
    sidebarNav.innerHTML = '';
    let sidebarNavSt = ``;

    const grouped = fcUtils.groupByCategory(menuJson);

    for (const category in grouped) {
        const dishes = grouped[category];

        let st = `<section class="dish__block" id="${category}">
                    <h2 class="dish__block-name">${fcUtils.getRuCategory(category)}</h2>
                    <div class="dish__block-type">
                        <button class="type__button type__button--selected" data-type="all">Все</button>`;

        let allTypes = fcUtils.getAllTypesForCategory(dishes);
        allTypes.forEach(type => {
            st += `<button class="type__button" data-type="${type}">${fcUtils.getRuType(type)}</button>`;
        });

        st += `     </div>
                    <div class="dish__block-dishes">`;

        dishes.forEach(item => {
            st += `
                <div class="dish__block-dish" data-id="${item.id}" data-price="${item.price}" data-type="${item.kind}" data-category="${item.category}">
                    <div class="dish__image">
                        <img src="${item.image}" alt="${fcUtils.ucfirst(item.name)}">
                    </div>
                    <div class="dish__price">
                        <p>${item.price}₽</p>
                    </div>
                    <div class="dish__name">
                        <p>${fcUtils.ucfirst(item.name)}</p>
                    </div>
                    <div class="dish__weight">${item.count}</div>
                    <div class="dish__add-button"><input type="button" class="add-to-cart-btn" data-id="${item.id}" value="Добавить"></div>
                </div>
            `;
        });

        st += `</div></section>`;
        appendList.push(st);
        sidebarNavSt += `<li><a href="#${category}">${fcUtils.getRuCategory(category)}</a></li>`;
    }

    sidebarNav.innerHTML = sidebarNavSt;
    menuBlock.innerHTML = appendList.join('');

    initFilters();
}

// ==== Upload Menu =====
async function loadMenu() {
    try {
        const menuData = await basketAPI.getDishes();
        const element = document.getElementById('dish_menu');
        addMenu(menuData, element);

        // Сохраняем в глобальную переменную для быстрого доступа
        window.menuData = menuData;
    } catch (err) {
        console.error('Ошибка загрузки меню:', err);
        notifications.error('Не удалось загрузить меню');
    }
}

// ===== BASKET MANAGEMENT =====
class BasketManager {
    constructor() {
        this.init();
    }

    async init() {
        await this.renderBasket();
        this.bindEvents();
    }

    async renderBasket() {
        await this.updateSidebarBasket();
        await this.updateModalBasket();
        this.updateFloatingBasket();
    }

    async updateSidebarBasket() {
        const cartList = document.getElementById('cartList');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!cartList) return;

        const basket = basketStorage.getBasket();

        if (basket.length === 0) {
            cartList.innerHTML = '<li class="cart-empty">Корзина пуста</li>';
            if (cartTotal) cartTotal.textContent = '0₽';
            if (checkoutBtn) checkoutBtn.classList.add('basket__btn--disabled');
            return;
        }

        // Получаем детали для товаров
        const itemsWithDetails = await basketStorage.getBasketWithDetails();
        let total = 0;

        cartList.innerHTML = '';
        itemsWithDetails.forEach(item => {
            total += item.price * item.quantity;

            cartList.innerHTML += `
                <li class="cart-item" data-id="${item.id}">
                    <div class="cart-item__name">${fcUtils.ucfirst(item.name)}</div>
                    <div class="cart-item__total">${item.price * item.quantity}₽</div>
                    <div class="cart-item__price">${item.price}₽ за шт.</div>
                    <div class="cart-item__controls">
                        <div class="cart-controls">
                            <button class="cart-decr" data-id="${item.id}">−</button>
                            <span class="cart-qty">${item.quantity}</span>
                            <button class="cart-incr" data-id="${item.id}">+</button>
                            <button class="cart-remove" data-id="${item.id}">✕</button>
                        </div>
                    </div>
                </li>
            `;
        });

        if (cartTotal) cartTotal.textContent = `${total}₽`;
        if (checkoutBtn) checkoutBtn.classList.remove('basket__btn--disabled');
    }

    async updateModalBasket() {
        const cartModalList = document.getElementById('cartModalList');
        const cartModalTotal = document.getElementById('cartModalTotal');

        if (!cartModalList) return;

        const basket = basketStorage.getBasket();

        if (basket.length === 0) {
            cartModalList.innerHTML = '<li class="cart-empty">Корзина пуста</li>';
            if (cartModalTotal) cartModalTotal.textContent = '0₽';
            return;
        }

        const itemsWithDetails = await basketStorage.getBasketWithDetails();
        let total = 0;

        cartModalList.innerHTML = '';
        itemsWithDetails.forEach(item => {
            total += item.price * item.quantity;

            cartModalList.innerHTML += `
                <li class="cart-item cart-item-modal" data-id="${item.id}">
                    <div class="cart-item__name">${fcUtils.ucfirst(item.name)}</div>
                    <div class="cart-item__price">${item.price}₽ за шт.</div>
                    <div class="cart-item__controls">
                        <div class="cart-controls">
                            <button class="cart-decr" data-id="${item.id}">−</button>
                            <span class="cart-qty">${item.quantity}</span>
                            <button class="cart-incr" data-id="${item.id}">+</button>
                            <button class="cart-remove" data-id="${item.id}">✕</button>
                        </div>
                    </div>
                    <div class="cart-item__total">${item.price * item.quantity}₽</div>
                </li>
            `;
        });

        if (cartModalTotal) cartModalTotal.textContent = `${total}₽`;
    }

    updateFloatingBasket() {
        const floatingCartCount = document.getElementById('floatingCartCount');
        const floatingCartTotal = document.getElementById('floatingCartTotal');

        if (!floatingCartCount || !floatingCartTotal) return;

        const basket = basketStorage.getBasket();
        const totalCount = basketStorage.getTotalCount();

        floatingCartCount.textContent = `${totalCount} товар${this.getNoun(totalCount)}`;

        // Асинхронно обновляем сумму
        basketStorage.getTotalPrice().then(total => {
            floatingCartTotal.textContent = `${total}₽`;
        }).catch(() => {
            floatingCartTotal.textContent = '0₽';
        });
    }

    getNoun(number) {
        return fcUtils.getNoun(number, '', 'а', 'ов');
    }

    bindEvents() {
        // Добавление товара в корзину
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const id = e.target.dataset.id;
                basketStorage.addItem(id);
                await this.renderBasket();
                notifications.success('Товар добавлен в корзину!');
            }

            // Управление количеством
            if (e.target.classList.contains('cart-incr')) {
                const id = e.target.dataset.id;
                const basket = basketStorage.getBasket();
                const item = basket.find(item => item.id === id);
                if (item) {
                    basketStorage.updateQuantity(id, (item.quantity || 1) + 1);
                    await this.renderBasket();
                }
            }

            if (e.target.classList.contains('cart-decr')) {
                const id = e.target.dataset.id;
                const basket = basketStorage.getBasket();
                const item = basket.find(item => item.id === id);
                if (item) {
                    basketStorage.updateQuantity(id, (item.quantity || 1) - 1);
                    await this.renderBasket();
                }
            }

            if (e.target.classList.contains('cart-remove')) {
                const id = e.target.dataset.id;
                basketStorage.removeItem(id);
                await this.renderBasket();
            }
        });

        // Кнопка перехода к оплате в сайдбаре
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', async () => {
                const basket = basketStorage.getBasket();
                if (basket.length === 0) {
                    notifications.warning('Корзина пуста', 'Выберите хотя бы один товар для оформления заказа');
                    return;
                }

                // Проверяем обязательные категории
                const missingCategories = await basketStorage.getMissingCategories();

                if (missingCategories.length > 0) {
                    const categoryNames = missingCategories.map(cat => cat.name).join(', ');
                    const message = `Вы не выбрали: ${categoryNames}. Хотите перейти к оплате?`;

                    notifications.confirm({
                        title: 'Не все категории выбраны',
                        message: message,
                        yesText: 'Да, к оплате',
                        noText: 'Посмотреть ещё'
                    }).then(proceed => {
                        if (proceed) {
                            window.location.href = './order_place.html';
                        } else {
                            // Прокручиваем к первой недостающей категории
                            const firstMissing = missingCategories[0];
                            if (firstMissing) {
                                const categorySection = document.getElementById(firstMissing.id);
                                if (categorySection) {
                                    categorySection.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }
                            }
                        }
                    });
                } else {
                    window.location.href = './order_place.html';
                }
            });
        }

        // Кнопка перехода к оплате в модальном окне
        document.addEventListener('click', async (e) => {
            if (e.target && e.target.id === 'cartModalCheckout') {
                const basket = basketStorage.getBasket();
                if (basket.length === 0) {
                    notifications.warning('Корзина пуста', 'Выберите хотя бы один товар для оформления заказа');
                    return;
                }

                // Проверяем обязательные категории
                const missingCategories = await basketStorage.getMissingCategories();

                if (missingCategories.length > 0) {
                    const categoryNames = missingCategories.map(cat => cat.name).join(', ');
                    const message = `Вы не выбрали: ${categoryNames}. Хотите перейти к оплате?`;

                    notifications.confirm({
                        title: 'Не все категории выбраны',
                        message: message,
                        yesText: 'Да, к оплате',
                        noText: 'Посмотреть ещё'
                    }).then(proceed => {
                        if (proceed) {
                            ModalCore.close('basket');
                            window.location.href = './order_place.html';
                        } else {
                            ModalCore.close('basket');
                            // Прокручиваем к первой недостающей категории
                            const firstMissing = missingCategories[0];
                            if (firstMissing) {
                                const categorySection = document.getElementById(firstMissing.id);
                                if (categorySection) {
                                    categorySection.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }
                            }
                        }
                    });
                } else {
                    ModalCore.close('basket');
                    window.location.href = './order_place.html';
                }
            }
        });

        // Открытие модального окна корзины
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                ModalCore.open('basket');
                this.updateModalBasket();
            });
        }

        // Плавающая кнопка корзины
        const floatingCartBtn = document.getElementById('floatingCartBtn');
        if (floatingCartBtn) {
            floatingCartBtn.addEventListener('click', () => {
                ModalCore.open('basket');
                this.updateModalBasket();
            });
        }

        // Слушаем обновления корзины
        window.addEventListener('basket-updated', async () => {
            await this.renderBasket();
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    await loadMenu();
    window.basketManager = new BasketManager();
});