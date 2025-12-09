class OrderPlaceManager {
    constructor() {
        this.init();
    }

    async init() {
        await this.renderOrderItems();
        this.bindEvents();
        this.setupFormValidation();

        window.addEventListener('basket-updated', async () => {
            await this.renderOrderItems();
        });
    }

    async renderOrderItems() {
        const container = document.getElementById('orderItems');
        const totalAmount = document.getElementById('orderTotalAmount');

        if (!container) return;

        const basket = basketStorage.getBasket();

        if (basket.length === 0) {
            container.innerHTML = `
                <div class="empty-order">
                    <p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="./lunch.html">Собрать ланч</a>.</p>
                </div>
            `;
            if (totalAmount) totalAmount.textContent = '0₽';
            return;
        }

        const itemsWithDetails = await basketStorage.getBasketWithDetails();
        let total = 0;

        container.innerHTML = '';
        itemsWithDetails.forEach(item => {
            total += item.price * item.quantity;

            container.innerHTML += `
                <div class="order-item" data-id="${item.id}">
                    <div class="order-item__image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="order-item__info">
                        <div class="order-item__name">${fcUtils.ucfirst(item.name)}</div>
                        <div class="order-item__meta">
                            <span class="order-item__price">${item.price}₽ за шт.</span>
                            <span class="order-item__total">${item.price * item.quantity}₽</span>
                        </div>
                        <div class="order-item__controls">
                            <div class="cart-controls">
                                <button class="cart-decr" data-id="${item.id}">−</button>
                                <span class="cart-qty">${item.quantity}</span>
                                <button class="cart-incr" data-id="${item.id}">+</button>
                                <button class="cart-remove" data-id="${item.id}">✕</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        if (totalAmount) totalAmount.textContent = `${total}₽`;
    }

    setupFormValidation() {
        const form = document.getElementById('checkoutForm');
        const deliveryTypeRadios = document.querySelectorAll('input[name="deliveryType"]');
        const deliveryTimeContainer = document.getElementById('deliveryTimeContainer');
        const deliveryTimeInput = document.getElementById('deliveryTime');
        const phoneInput = document.getElementById('phone');

        // Маска для телефона
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.startsWith('7') || value.startsWith('8')) {
                    value = value.substring(1);
                }
                if (value.length > 0) {
                    value = '+7 (' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 8) + '-' + value.substring(8, 10);
                }
                e.target.value = value;
            });
        }

        // Показ/скрытие поля времени
        if (deliveryTypeRadios.length > 0 && deliveryTimeContainer) {
            deliveryTypeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    const showTime = document.querySelector('input[name="deliveryType"]:checked').value === 'by_time';
                    deliveryTimeContainer.classList.toggle('hidden', !showTime);
                    if (deliveryTimeInput) {
                        deliveryTimeInput.required = showTime;
                    }
                });
            });
        }

        // Авто-растягивание textarea
        const addressTextarea = document.getElementById('deliveryAddress');
        const commentTextarea = document.getElementById('comment');
        if (addressTextarea) this.setupAutoResize(addressTextarea);
        if (commentTextarea) this.setupAutoResize(commentTextarea);
    }

    setupAutoResize(textarea) {
        const resize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
        };
        textarea.addEventListener('input', resize);
        setTimeout(resize, 10);
    }

    prepareDishIds(basket) {
        const dishIds = [];
        basket.forEach(item => {
            const dishId = parseInt(item.id);
            for (let i = 0; i < (item.quantity || 1); i++) {
                dishIds.push(dishId);
            }
        });
        return dishIds;
    }

    bindEvents() {
        // Управление количеством на странице оформления заказа
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('cart-incr')) {
                const id = e.target.dataset.id;
                const basket = basketStorage.getBasket();
                const item = basket.find(item => item.id == id);
                if (item) {
                    basketStorage.updateQuantity(id, (item.quantity || 1) + 1);
                }
            }

            if (e.target.classList.contains('cart-decr')) {
                const id = e.target.dataset.id;
                const basket = basketStorage.getBasket();
                const item = basket.find(item => item.id == id);
                if (item) {
                    basketStorage.updateQuantity(id, (item.quantity || 1) - 1);
                }
            }

            if (e.target.classList.contains('cart-remove')) {
                const id = e.target.dataset.id;
                basketStorage.removeItem(id);
            }
        });

        // Кнопка "Вернуться к выбору"
        const backToLunchBtn = document.getElementById('backToLunch');
        if (backToLunchBtn) {
            backToLunchBtn.addEventListener('click', () => {
                window.location.href = './lunch.html';
            });
        }

        // Отправка формы
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                const formData = new FormData(form);

                // Проверяем, что корзина не пуста
                const basket = basketStorage.getBasket();
                if (basket.length === 0) {
                    notifications.error('Корзина пуста');
                    return;
                }

                // Блокируем кнопку отправки
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';

                try {
                    // Подготавливаем данные для отправки
                    const orderData = {
                        full_name: formData.get('userName'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                        delivery_address: formData.get('deliveryAddress'),
                        delivery_type: formData.get('deliveryType'),
                        comment: formData.get('comment') || '',
                        subscribe: formData.get('subscribe') === 'true',
                        dish_ids: this.prepareDishIds(basket)
                    };

                    // Добавляем время доставки если нужно
                    if (formData.get('deliveryType') === 'by_time') {
                        orderData.delivery_time = formData.get('deliveryTime');
                    }

                    console.log('Отправка заказа:', orderData);

                    const result = await basketAPI.createOrder(orderData);

                    // Успешная отправка
                    notifications.success('Заказ успешно оформлен!');

                    // Очищаем корзину
                    basketStorage.clearBasket();

                    // Перенаправляем на страницу заказов
                    setTimeout(() => {
                        window.location.href = './orders.html';
                    }, 2000);

                } catch (error) {
                    console.error('Order submission failed:', error);

                    let errorMessage = 'Ошибка при оформлении заказа';
                    if (error.message.includes('401')) {
                        errorMessage = 'Ошибка авторизации. Проверьте API ключ.';
                    } else if (error.message.includes('NetworkError')) {
                        errorMessage = 'Проблема с сетью. Проверьте подключение к интернету.';
                    } else if (error.message.includes('CORS')) {
                        errorMessage = 'Проблема с CORS. Возможно, API не поддерживает запросы с этого домена.';
                    }

                    notifications.error(errorMessage);

                    // Разблокируем кнопку
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.orderPlaceManager = new OrderPlaceManager();
});