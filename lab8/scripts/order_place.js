class CheckoutManager {
    constructor() {
        this.STORAGE_KEY = 'fc_cart';
        this.API_BASE = '/labs/api';
        this.API_KEY = this.getApiKey();
        this.selectedDishes = this.loadCart();
        this.menu = [];
        this.init();
    }

    getApiKey() {
        // Здесь должен быть код для получения API ключа
        // Пока используем заглушку
        return 'api-key-here';
    }

    loadCart() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    }

    saveCart() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.selectedDishes));
    }

    async init() {
        await this.loadMenu();
        this.renderOrderItems();
        this.bindEvents();
        this.setupFormValidation();
    }

    async loadMenu() {
        try {
            const response = await fetch('https://rimashi.github.io/Shipilov-web-dev-2025-1/lab5/scripts/menu.json');
            if (!response.ok) throw new Error('Failed to load menu');
            this.menu = await response.json();
        } catch (error) {
            console.error('Error loading menu:', error);
            notifications.error('Ошибка загрузки меню');
        }
    }

    getDishById(id) {
        return this.menu.find(dish => dish.id === id);
    }

    renderOrderItems() {
        const container = document.getElementById('orderItems');
        const totalAmount = document.getElementById('orderTotalAmount');

        if (this.selectedDishes.length === 0) {
            container.innerHTML = `
                <div class="empty-order">
                    <p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="./lunch.html">Собрать ланч</a>.</p>
                </div>
            `;
            totalAmount.textContent = '0₽';
            return;
        }

        let total = 0;
        const itemsHTML = this.selectedDishes.map(item => {
            const dish = this.getDishById(item.id);
            if (!dish) return '';

            total += dish.price * item.qty;

            return `
                <div class="order-item" data-id="${item.id}">
                    <div class="order-item__image">
                        <img src="${dish.img}" alt="${dish.name}">
                    </div>
                    <div class="order-item__info">
                        <div class="order-item__name">${this.ucfirst(dish.name)}</div>
                        <div class="order-item__meta">
                            <span class="order-item__price">${dish.price}₽</span>
                            <span class="order-item__weight">${dish.weight}</span>
                        </div>
                    </div>
                    <button type="button" class="order-item__remove" data-id="${item.id}">Удалить</button>
                </div>
            `;
        }).join('');

        container.innerHTML = itemsHTML;
        totalAmount.textContent = `${total}₽`;
    }

    removeItem(id) {
        this.selectedDishes = this.selectedDishes.filter(item => item.id !== id);
        this.saveCart();
        this.renderOrderItems();
        this.updateFormSelections();
    }

    updateFormSelections() {
        // Здесь будет логика обновления отображения выбранных блюд в форме
        // Пока просто перерисовываем весь блок
        this.renderOrderItems();
    }

    ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    setupFormValidation() {
        const form = document.getElementById('checkoutForm');
        const deliveryTypeRadios = document.querySelectorAll('input[name="deliveryType"]');
        const deliveryTimeContainer = document.getElementById('deliveryTimeContainer');
        const deliveryTimeInput = document.getElementById('deliveryTime');
        const phoneInput = document.getElementById('phone');

        // Маска для телефона
        this.createPhoneMask(phoneInput);

        // Показ/скрытие поля времени доставки
        deliveryTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const showTime = document.querySelector('input[name="deliveryType"]:checked').value === 'by_time';
                deliveryTimeContainer.classList.toggle('hidden', !showTime);
                if (showTime) {
                    deliveryTimeInput.required = true;
                } else {
                    deliveryTimeInput.required = false;
                }
            });
        });

        // Валидация времени доставки
        deliveryTimeInput.addEventListener('change', () => {
            this.validateDeliveryTime(deliveryTimeInput);
        });

        // Авто-растягивание textarea
        const addressTextarea = document.getElementById('deliveryAddress');
        const commentTextarea = document.getElementById('comment');
        this.setupAutoResize(addressTextarea);
        this.setupAutoResize(commentTextarea);
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

    validateDeliveryTime(timeInput) {
        if (!timeInput.value) return true;

        const [hours, minutes] = timeInput.value.split(':').map(Number);
        const now = new Date();
        const selectedTime = new Date();
        selectedTime.setHours(hours, minutes, 0, 0);

        // Проверяем время работы (7:00-23:00)
        const isValidTime = hours >= 7 && hours <= 23;
        // Проверяем, что время не раньше текущего (для доставки ко времени)
        const isFutureTime = selectedTime > now;

        if (!isValidTime) {
            timeInput.setCustomValidity('Время доставки должно быть между 7:00 и 23:00');
        } else if (!isFutureTime) {
            timeInput.setCustomValidity('Время доставки должно быть позже текущего времени');
        } else {
            timeInput.setCustomValidity('');
        }

        return timeInput.validity.valid;
    }

    checkComboValidity() {
        // Проверяем, соответствует ли состав заказа одному из комбо
        // Минимальное комбо: суп + горячее + напиток
        const categories = this.selectedDishes.map(item => {
            const dish = this.getDishById(item.id);
            return dish ? dish.category : null;
        }).filter(Boolean);

        const hasSoup = categories.includes('soups');
        const hasMain = categories.includes('hots');
        const hasDrink = categories.includes('drinks');

        return hasSoup && hasMain && hasDrink;
    }

    async submitOrder(formData) {
        if (!this.checkComboValidity()) {
            notifications.error('Выберите блюда из всех обязательных категорий: суп, горячее и напиток');
            return false;
        }

        if (this.selectedDishes.length === 0) {
            notifications.error('Корзина пуста');
            return false;
        }

        const orderData = {
            full_name: formData.get('userName'),
            email: formData.get('email'),
            subscribe: formData.get('subscribe') === 'true',
            phone: formData.get('phone'),
            delivery_address: formData.get('deliveryAddress'),
            delivery_type: formData.get('deliveryType'),
            delivery_time: formData.get('deliveryTime') || null,
            comment: formData.get('comment') || '',
            // Преобразуем выбранные блюда в формат для API
            ...this.formatDishesForAPI()
        };

        try {
            const response = await fetch(`${this.API_BASE}/orders?api_key=${this.API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Order submission error:', error);
            throw error;
        }
    }

    formatDishesForAPI() {
        const formatted = {
            drink_id: null,
            soup_id: null,
            main_course_id: null,
            salad_id: null,
            dessert_id: null
        };

        this.selectedDishes.forEach(item => {
            const dish = this.getDishById(item.id);
            if (!dish) return;

            switch (dish.category) {
                case 'drinks':
                    formatted.drink_id = dish.id;
                    break;
                case 'soups':
                    formatted.soup_id = dish.id;
                    break;
                case 'hots':
                    formatted.main_course_id = dish.id;
                    break;
                // Добавьте другие категории по необходимости
            }
        });

        return formatted;
    }

    bindEvents() {
        // Удаление блюд
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('order-item__remove')) {
                const id = e.target.dataset.id;
                this.removeItem(id);
            }
        });

        // Кнопка "Вернуться к выбору"
        document.getElementById('backToLunch').addEventListener('click', () => {
            window.location.href = './lunch.html';
        });

        // Отправка формы
        document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const formData = new FormData(form);

            // Валидация времени доставки
            const deliveryTimeInput = document.getElementById('deliveryTime');
            if (formData.get('deliveryType') === 'by_time' && !this.validateDeliveryTime(deliveryTimeInput)) {
                notifications.error('Пожалуйста, выберите корректное время доставки');
                return;
            }

            // Блокируем кнопку отправки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            try {
                const result = await this.submitOrder(formData);

                // Успешная отправка
                notifications.success('Заказ успешно оформлен!');

                // Очищаем корзину
                this.selectedDishes = [];
                this.saveCart();

                // Перенаправляем на страницу заказов
                setTimeout(() => {
                    window.location.href = './orders.html';
                }, 2000);

            } catch (error) {
                console.error('Order submission failed:', error);
                notifications.error(`Ошибка при оформлении заказа: ${error.message}`);

                // Разблокируем кнопку
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить заказ';
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutManager = new CheckoutManager();
});