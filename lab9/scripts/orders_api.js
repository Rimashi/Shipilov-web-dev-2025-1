const modals = {
    "order_info": `
    <div class="modal__background" role="presentation" data-modal="order_info">
        <div class="modal__active" role="dialog" aria-modal="true">
            <div class="modal__close" data-modal-close>
                <span>×</span>
            </div>
            <div class="modal__window">
                <h2>Детали заказа <span id="orderNumber"></span></h2>
                <div class="order__details-content">
                    <div class="order__info-section">
                        <h3>Информация о заказе</h3>
                        <div class="info__grid">
                            <div class="info__item">
                                <span class="info__label">Статус:</span>
                                <span class="info__value" id="orderStatus">
                                </span>
                            </div>
                            <div class="info__item">
                                <span class="info__label">Дата создания:</span>
                                <span class="info__value" id="orderDate"></span>
                            </div>
                            <div class="info__item">
                                <span class="info__label">Время доставки:</span>
                                <span class="info__value" id="deliveryTime">
                                </span>
                            </div>
                            <div class="info__item">
                                <span class="info__label">
                                    Способ доставки:
                                </span>
                                <span class="info__value" id="deliveryType">
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="customer__info-section">
                        <h3>Данные клиента</h3>
                        <div class="info__grid">
                            <div class="info__item">
                                <span class="info__label">
                                    Имя:
                                </span>
                                <span class="info__value" id="customerName">
                                </span>
                            </div>
                            <div class="info__item">
                                <span class="info__label">
                                    Телефон:
                                </span>
                                <span class="info__value" id="customerPhone">
                                </span>
                            </div>
                            <div class="info__item">
                                <span class="info__label">
                                    Адрес:
                                </span>
                                <span class="info__value" id="customerAddress">
                                </span>
                            </div>
                            <div class="info__item">
                                <span class="info__label">
                                    Email:
                                </span>
                                <span class="info__value" id="customerEmail">
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="order__items-section">
                        <h3>Состав заказа</h3>
                        <div class="order__items-list" id="orderItemsList">
                            <!-- Товары будут загружены через JS -->
                        </div>
                        <div class="order__total-section">
                            <div class="total__line">
                                <span>Итого:</span>
                                <span class="total__amount" id="orderTotalAmount">
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="order__notes-section">
                        <h3>Комментарий к заказу</h3>
                        <p id="orderNotes" class="order__notes"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    "edit_order": `
    <div class="modal__background" role="presentation" data-modal="edit_order">
        <div class="modal__active" role="dialog" aria-modal="true">
            <div class="modal__close" data-modal-close>
                <span>×</span>
            </div>
            <div class="modal__window">
                <h2>Редактирование заказа <span id="editOrderNumber"></span></h2>
                <form id="editOrderForm" class="checkout-form">
                    <div class="form-group">
                        <label for="editFullName">Имя:</label>
                        <input type="text" id="editFullName" name="full_name" required>
                    </div>
                    <div class="form-group">
                        <label for="editEmail">Email:</label>
                        <input type="email" id="editEmail" name="email" required>
                    </div>
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="editSubscribe" name="subscribe" value="true">
                        <label for="editSubscribe">Получать рекламные уведомления</label>
                    </div>
                    <div class="form-group">
                        <label for="editPhone">Телефон:</label>
                        <input type="tel" id="editPhone" name="phone" placeholder="+7 (___) ___-__-__" required>
                    </div>
                    <div class="form-group">
                        <label for="editDeliveryAddress">Адрес доставки:</label>
                        <textarea id="editDeliveryAddress" name="delivery_address" placeholder="Введите адрес доставки..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="editDeliveryType">Время доставки:</label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="editDeliveryType" value="now" checked>
                                <span>Как можно скорее</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="editDeliveryType" value="by_time">
                                <span>К указанному времени</span>
                            </label>
                        </div>
                        <div id="editDeliveryTimeContainer" class="hidden">
                            <label for="editDeliveryTime">Время доставки:</label>
                            <input type="time" id="editDeliveryTime" name="delivery_time" min="07:00" max="23:00" step="300">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editComment">Комментарий к заказу:</label>
                        <textarea id="editComment" name="comment" placeholder="Ваши пожелания к заказу..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="editStatus">Статус заказа:</label>
                        <select id="editStatus" name="status" required>
                            <option value="active">Активный</option>
                            <option value="completed">Завершен</option>
                            <option value="cancelled">Отменен</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" data-modal-close>Отмена</button>
                        <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
};

// Регистрируем модальные окна
ModalCore.register('order_info', modals.order_info);
ModalCore.register('edit_order', modals.edit_order);

class OrdersAPIManager {
    constructor() {
        this.orders = [];
        this.currentOrderId = null;
        this.dishesCache = new Map(); // Кэш для блюд
        this.init();
    }

    async init() {
        await this.loadOrders();
        this.renderOrders();
        this.bindEvents();
    }

    async loadOrders() {
        try {
            this.orders = await basketAPI.getOrders();
            console.log('Orders loaded from API:', this.orders);
            this.updateStats();
        } catch (error) {
            console.error('Failed to load orders:', error);
            this.orders = [];
            notifications.error('Не удалось загрузить заказы');
        }
    }

    async loadDishesForOrder(order) {
        // Загружаем информацию о блюдах для заказа
        const dishesWithDetails = [];
        
        for (const dishId of order.dish_ids) {
            if (this.dishesCache.has(dishId)) {
                dishesWithDetails.push(this.dishesCache.get(dishId));
            } else {
                try {
                    const dish = await basketAPI.getDishById(dishId);
                    if (dish) {
                        this.dishesCache.set(dishId, dish);
                        dishesWithDetails.push(dish);
                    }
                } catch (error) {
                    console.error(`Failed to load dish ${dishId}:`, error);
                }
            }
        }
        
        return dishesWithDetails;
    }

    updateStats() {
        const activeOrdersCount = document.getElementById('activeOrdersCount');
        const totalOrdersCount = document.getElementById('totalOrdersCount');

        if (activeOrdersCount) {
            const activeOrders = this.orders.filter(order => order.status === 'active');
            activeOrdersCount.textContent = activeOrders.length;
        }
        
        if (totalOrdersCount) {
            totalOrdersCount.textContent = this.orders.length;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatTime(timeString) {
        if (!timeString || timeString === 'now') {
            return 'Как можно скорее';
        }
        return timeString;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'Активный',
            'completed': 'Завершен',
            'cancelled': 'Отменен'
        };
        return statusMap[status] || status;
    }

    async calculateOrderTotal(order) {
        const dishes = await this.loadDishesForOrder(order);
        return dishes.reduce((total, dish) => total + dish.price, 0);
    }

    async renderOrders() {
        const activeOrdersList = document.getElementById('activeOrdersList');
        const completedOrdersList = document.getElementById('completedOrdersList');

        if (!activeOrdersList || !completedOrdersList) return;

        // Фильтруем заказы по статусу
        const activeOrders = this.orders.filter(order => order.status === 'active');
        const completedOrders = this.orders.filter(order => order.status === 'completed' || order.status === 'cancelled');

        // Рендерим активные заказы
        await this.renderOrderList(activeOrdersList, activeOrders, true);
        
        // Рендерим завершенные заказы
        await this.renderOrderList(completedOrdersList, completedOrders, false);

        this.updateStats();
    }

    async renderOrderList(container, orders, isActive) {
        if (orders.length === 0) {
            container.innerHTML = this.getEmptyStateHTML(isActive);
            return;
        }

        container.innerHTML = '';
        
        for (const order of orders) {
            const orderElement = await this.createOrderCard(order, isActive);
            container.appendChild(orderElement);
        }
    }

    getEmptyStateHTML(isActive) {
        if (isActive) {
            return `
            <div class="empty__state">
                <h3>У вас нет активных заказов</h3>
                <p>Сделайте заказ на странице "Собрать ланч"</p>
                <a href="./lunch.html" class="btn btn__primary">
                    Сделать заказ
                </a>
            </div>
            `;
        } else {
            return `
            <div class="empty__state">
                <h3>У вас нет завершенных заказов</h3>
                <p>Завершенные заказы появятся здесь</p>
            </div>
            `;
        }
    }

    async createOrderCard(order, isActive) {
        const total = await this.calculateOrderTotal(order);
        const dishes = await this.loadDishesForOrder(order);
        
        const div = document.createElement('div');
        div.className = `order__card ${!isActive ? 'completed' : ''}`;
        div.dataset.orderId = order.id;
        
        const itemsPreview = dishes.slice(0, 2).map(dish => 
            `${dish.name} (1 шт.)`
        ).join(', ');
        
        const hiddenItemsCount = dishes.length - 2;
        let itemsText = itemsPreview;
        if (hiddenItemsCount > 0) {
            itemsText = `${itemsPreview} ... и еще ${hiddenItemsCount}`;
        }

        div.innerHTML = `
            <div class="order__card-header">
                <div class="order__card-info">
                    <h3>Заказ #${order.id}</h3>
                    <div class="order__meta">
                        <span class="meta__item">
                            <i>📅</i> ${this.formatDate(order.created_at || new Date().toISOString())}
                        </span>
                        <span class="meta__item">
                            <i>🕒</i> ${this.formatTime(order.delivery_time)}
                        </span>
                        <span class="meta__item">
                            <i>👤</i> ${order.full_name}
                        </span>
                    </div>
                </div>
                <div class="order__status status--${order.status}">
                    ${this.getStatusText(order.status)}
                </div>
            </div>
            <div class="order__card-body">
                <div class="order__items-preview">
                    ${itemsText}
                </div>
                <div class="order__total">
                    ${this.formatPrice(total)}₽
                </div>
                <div class="order__actions">
                    <button class="btn__small btn__info view__order-btn" data-order-id="${order.id}">
                        Просмотреть
                    </button>
                    ${isActive ? `
                        <button class="btn__small btn__primary edit__order-btn" data-order-id="${order.id}">
                            Редактировать
                        </button>
                        <button class="btn__small btn__danger delete__order-btn" data-order-id="${order.id}">
                            Удалить
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        return div;
    }

    async showOrderDetails(orderId) {
        try {
            const order = await basketAPI.getOrderById(orderId);
            if (!order) {
                notifications.error('Заказ не найден');
                return;
            }

            this.currentOrderId = orderId;
            ModalCore.open('order_info');

            // Заполняем данные в модальном окне
            document.getElementById('orderNumber').textContent = `#${order.id}`;
            document.getElementById('orderStatus').textContent = this.getStatusText(order.status);
            document.getElementById('orderDate').textContent = this.formatDate(order.created_at || new Date().toISOString());
            document.getElementById('deliveryTime').textContent = this.formatTime(order.delivery_time);
            document.getElementById('deliveryType').textContent = order.delivery_type === 'by_time' ? 'Ко времени' : 'Как можно скорее';
            document.getElementById('customerName').textContent = order.full_name;
            document.getElementById('customerPhone').textContent = order.phone;
            document.getElementById('customerAddress').textContent = order.delivery_address;
            document.getElementById('customerEmail').textContent = order.email;
            document.getElementById('orderNotes').textContent = order.comment || 'Нет комментария';

            // Загружаем и отображаем блюда
            const dishes = await this.loadDishesForOrder(order);
            const container = document.getElementById('orderItemsList');
            const totalAmount = document.getElementById('orderTotalAmount');
            
            if (container) {
                container.innerHTML = dishes.map(dish => `
                    <div class="order__item">
                        <div class="item__info">
                            <div class="item__name">${dish.name}</div>
                            <div class="item__meta">${dish.price}₽ × 1 шт.</div>
                        </div>
                        <div class="item__total">${dish.price}₽</div>
                    </div>
                `).join('');
            }
            
            if (totalAmount) {
                const total = dishes.reduce((sum, dish) => sum + dish.price, 0);
                totalAmount.textContent = `${this.formatPrice(total)}₽`;
            }
            
        } catch (error) {
            console.error('Failed to load order details:', error);
            notifications.error('Не удалось загрузить детали заказа');
        }
    }

    async openEditModal(orderId) {
        try {
            const order = await basketAPI.getOrderById(orderId);
            if (!order) {
                notifications.error('Заказ не найден');
                return;
            }

            this.currentOrderId = orderId;
            ModalCore.open('edit_order');

            // Заполняем форму данными заказа
            document.getElementById('editOrderNumber').textContent = `#${order.id}`;
            document.getElementById('editFullName').value = order.full_name;
            document.getElementById('editEmail').value = order.email;
            document.getElementById('editSubscribe').checked = order.subscribe;
            document.getElementById('editPhone').value = order.phone;
            document.getElementById('editDeliveryAddress').value = order.delivery_address;
            
            // Тип доставки
            if (order.delivery_type === 'now') {
                document.querySelector('input[name="editDeliveryType"][value="now"]').checked = true;
                document.getElementById('editDeliveryTimeContainer').classList.add('hidden');
            } else {
                document.querySelector('input[name="editDeliveryType"][value="by_time"]').checked = true;
                document.getElementById('editDeliveryTimeContainer').classList.remove('hidden');
                document.getElementById('editDeliveryTime').value = order.delivery_time;
            }
            
            document.getElementById('editComment').value = order.comment || '';
            document.getElementById('editStatus').value = order.status;

            // Обработчик изменения типа доставки
            document.querySelectorAll('input[name="editDeliveryType"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const showTime = e.target.value === 'by_time';
                    document.getElementById('editDeliveryTimeContainer').classList.toggle('hidden', !showTime);
                });
            });

        } catch (error) {
            console.error('Failed to load order for editing:', error);
            notifications.error('Не удалось загрузить данные заказа');
        }
    }

    async updateOrder() {
        const form = document.getElementById('editOrderForm');
        const formData = new FormData(form);

        const orderData = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            delivery_address: formData.get('delivery_address'),
            delivery_type: formData.get('editDeliveryType'),
            comment: formData.get('comment') || '',
            subscribe: formData.get('subscribe') === 'true',
            status: formData.get('status')
        };

        if (orderData.delivery_type === 'by_time') {
            orderData.delivery_time = formData.get('delivery_time');
        }

        try {
            await basketAPI.updateOrder(this.currentOrderId, orderData);
            notifications.success('Заказ успешно обновлен!');
            ModalCore.close('edit_order');
            await this.loadOrders();
            this.renderOrders();
        } catch (error) {
            console.error('Failed to update order:', error);
            notifications.error('Не удалось обновить заказ');
        }
    }

    async deleteOrder(orderId) {
        const confirmed = await notifications.confirm({
            title: 'Удаление заказа',
            message: 'Вы уверены, что хотите удалить этот заказ?',
            yesText: 'Да, удалить',
            noText: 'Нет'
        });

        if (!confirmed) return;

        try {
            await basketAPI.deleteOrder(orderId);
            notifications.success('Заказ успешно удален!');
            await this.loadOrders();
            this.renderOrders();
        } catch (error) {
            console.error('Failed to delete order:', error);
            notifications.error('Не удалось удалить заказ');
        }
    }

    bindEvents() {
        // Обработчики вкладок
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab__btn')) {
                const tab = e.target.dataset.tab;
                
                // Обновляем активные вкладки
                document.querySelectorAll('.tab__btn').forEach(b => 
                    b.classList.remove('tab__btn--active'));
                document.querySelectorAll('.tab__content').forEach(c => 
                    c.classList.remove('tab__content--active'));
                
                e.target.classList.add('tab__btn--active');
                const contentElement = document.getElementById(`${tab}Orders`);
                if (contentElement) {
                    contentElement.classList.add('tab__content--active');
                }
            }
        });

        // Делегирование событий для карточек заказов
        document.addEventListener('click', async (e) => {
            // Кнопка "Просмотреть"
            if (e.target.classList.contains('view__order-btn')) {
                const orderId = e.target.dataset.orderId;
                await this.showOrderDetails(orderId);
                e.stopPropagation();
            }

            // Кнопка "Редактировать"
            if (e.target.classList.contains('edit__order-btn')) {
                const orderId = e.target.dataset.orderId;
                await this.openEditModal(orderId);
                e.stopPropagation();
            }

            // Кнопка "Удалить"
            if (e.target.classList.contains('delete__order-btn')) {
                const orderId = e.target.dataset.orderId;
                await this.deleteOrder(orderId);
                e.stopPropagation();
            }

            // Клик по карточке заказа
            const orderCard = e.target.closest('.order__card');
            if (orderCard && !e.target.closest('.order__actions')) {
                const orderId = orderCard.dataset.orderId;
                await this.showOrderDetails(orderId);
            }
        });

        // Обработчик формы редактирования
        const editForm = document.getElementById('editOrderForm');
        if (editForm) {
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.updateOrder();
            });
        }

        // Маска для телефона в форме редактирования
        const editPhoneInput = document.getElementById('editPhone');
        if (editPhoneInput) {
            editPhoneInput.addEventListener('input', (e) => {
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
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.ordersAPIManager = new OrdersAPIManager();
});