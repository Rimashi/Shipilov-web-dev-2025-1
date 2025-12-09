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
    `
};

// Регистрируем модальное окно
ModalCore.register('order_info', modals.order_info);

class OrdersManager {
    constructor() {
        this.STORAGE_KEY = 'fc_orders';
        this.orders = this.loadOrders();
        this.currentOrderId = null;
        this.init();
    }

    loadOrders() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        } catch (error) {
            console.error('Error loading orders:', error);
            return [];
        }
    }

    saveOrders() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orders));
        } catch (error) {
            console.error('Error saving orders:', error);
        }
    }

    init() {
        this.renderOrders();
        this.bindEvents();
        this.startAutoRefresh();
    }

    markAsCompleted(orderId) {
        const order = this.orders.find(o => o.id == orderId);
        if (order && order.status === 'active') {
            order.status = 'completed';
            order.completedAt = new Date().toISOString();
            this.saveOrders();
            this.renderOrders();
            return true;
        }
        return false;
    }

    getActiveOrders() {
        return this.orders.filter(order => order.status === 'active');
    }

    getCompletedOrders() {
        return this.orders.filter(order => order.status === 'completed');
    }

    getOrderById(orderId) {
        return this.orders.find(order => order.id == orderId);
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
        if (!timeString || timeString === 'Как можно скорее') {
            return timeString;
        }
        return timeString;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }

    renderOrders() {
        const activeOrders = this.getActiveOrders();
        const completedOrders = this.getCompletedOrders();
        const totalOrders = this.orders.length;

        // Обновляем статистику
        const activeOrdersCount = document.getElementById('activeOrdersCount');
        const totalOrdersCount = document.getElementById('totalOrdersCount');

        if (activeOrdersCount) {
            activeOrdersCount.textContent = activeOrders.length;
        }
        if (totalOrdersCount) {
            totalOrdersCount.textContent = totalOrders;
        }

        // Рендерим активные заказы
        this.renderOrderList('activeOrdersList', activeOrders, true);

        // Рендерим завершенные заказы
        this.renderOrderList('completedOrdersList', completedOrders, false);

        // Показываем сообщения если заказов нет
        this.handleEmptyStates(activeOrders, completedOrders);
    }

    renderOrderList(containerId, orders, isActive) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = this.getEmptyStateHTML(isActive);
            return;
        }

        container.innerHTML = orders.map(order =>
            this.getOrderCardHTML(order, isActive)).join('');
    }

    handleEmptyStates(activeOrders, completedOrders) {
        const activeContainer = document.getElementById('activeOrdersList');
        
        const completedContainer = document.getElementById('completedOrdersList');

        if (activeOrders.length === 0 && activeContainer) {
            activeContainer.innerHTML = this.getEmptyStateHTML(true);
        }

        if (completedOrders.length === 0 && completedContainer) {
            completedContainer.innerHTML = this.getEmptyStateHTML(false);
        }
    }

    getEmptyStateHTML(isActive) {
        let message;
        let description;

        if (isActive) {
            message = 'У вас нет активных заказов';
            description = 'Сделайте заказ на странице "Собрать ланч"';
            return `
            <div class="empty__state">
                <h3>${message}</h3>
                <p>${description}</p>
                <a href="./lunch.html" class="btn btn__primary">
                    Сделать заказ
                </a>
            </div>
            `;
        } else {
            message = 'У вас нет завершенных заказов';
            description = 'Завершенные заказы появятся здесь';
            return `
            <div class="empty__state">
                <h3>${message}</h3>
                <p>${description}</p>
                ''
            </div>
            `;
        }
    }

    getOrderCardHTML(order, isActive) {
        const itemsPreview = order.items.slice(0, 2).map(item =>
            `${item.title} (${item.qty} шт.)`
        ).join(', ');

        const hiddenItemsCount = order.items.length - 2;
        let itemsText;
        if (hiddenItemsCount > 0) {
            itemsText = `${itemsPreview} ... и еще ${hiddenItemsCount}`;
        } else {
            itemsText = itemsPreview;
        }

        return `
            <div class="order__card ${!isActive ? 'completed' : ''}" data-order-id="${order.id}">
                <div class="order__card-header">
                    <div class="order__card-info">
                        <h3>Заказ ${order.number}</h3>
                        <div class="order__meta">
                            <span class="meta__item">
                                <i>📅</i> 
                                ${this.formatDate(order.createdAt)}
                            </span>
                            <span class="meta__item">
                                <i>🕒</i> 
                                ${this.formatTime(order.userData.deliveryTime)}
                            </span>
                            <span class="meta__item">
                                <i>👤</i> ${order.userData.userName}
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
                        ${this.formatPrice(order.total)}₽
                    </div>
                    <div class="order__actions">
                        ${isActive ? `
                            <button class="btn__small btn__success complete__order-btn" data-order-id="${order.id}">
                                Отметить как полученный
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'Активный',
            'completed': 'Завершен',
            'cancelled': 'Отменен'
        };
        return statusMap[status] || status;
    }

    showOrderDetails(orderId) {
        const order = this.getOrderById(orderId);
        if (!order) return;

        this.currentOrderId = orderId;

        // Открываем модальное окно через ModalCore
        ModalCore.open('order_info');

        // Даем время для отрисовки модального окна, затем заполняем данные
        setTimeout(() => {
            this.fillOrderModalData(order);
        }, 50);
    }

    fillOrderModalData(order) {
        const orderNumber = document.getElementById('orderNumber');
        const orderStatus = document.getElementById('orderStatus');
        const orderDate = document.getElementById('orderDate');
        const deliveryTime = document.getElementById('deliveryTime');
        const deliveryType = document.getElementById('deliveryType');
        const customerName = document.getElementById('customerName');
        const customerPhone = document.getElementById('customerPhone');
        const customerAddress = document.getElementById('customerAddress');
        const customerEmail = document.getElementById('customerEmail');
        const orderTotalAmount = document.getElementById('orderTotalAmount');
        const orderNotes = document.getElementById('orderNotes');

        if (orderNumber) {
            orderNumber.textContent = order.number;
        }
        if (orderStatus) {
            orderStatus.textContent = this.getStatusText(order.status);
            orderStatus.className = `status--${order.status}`;
        }
        if (orderDate) {
            orderDate.textContent = this.formatDate(order.createdAt);
        }
        if (deliveryTime) {
            
            deliveryTime.textContent = this.formatTime(order.userData.deliveryTime);
        }
        if (deliveryType) {
            if (order.userData.deliveryType === 'timed') {
                deliveryType.textContent = 'Ко времени';
            } else {
                deliveryType.textContent = 'Как можно скорее';
            }
        }
        if (customerName) {
            customerName.textContent = order.userData.userName;
        }
        if (customerPhone) {
            customerPhone.textContent = order.userData.userPhone;
        }
        if (customerAddress) {
            customerAddress.textContent = order.userData.userAddress;
        }
        if (customerEmail) {
            customerEmail.textContent = order.userData.email;
        }

        if (orderTotalAmount) {
            orderTotalAmount.textContent = `${this.formatPrice(order.total)}₽`;
        }

        if (orderNotes) {
            
            orderNotes.textContent = order.userData.userComment || 'Нет комментария';
        }

        this.renderOrderItems(order.items);
    }

    renderOrderItems(items) {
        const container = document.getElementById('orderItemsList');
        if (!container) return;

        container.innerHTML = items.map(item => `
            <div class="order__item">
                <div class="item__info">
                    <div class="item__name">
                        ${item.title}
                    </div>
                    <div class="item__meta">
                        ${item.price}₽ × ${item.qty} шт.
                    </div>
                </div>
                <div class="item__total">${this.formatPrice(item.total)}₽</div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Обработчики вкладок
        const tabButtons = document.querySelectorAll('.tab__btn');
        if (tabButtons.length > 0) {
            tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tab = e.target.dataset.tab;

                    // Обновляем активные вкладки
                    
                    document.querySelectorAll('.tab__btn').forEach(b => b.classList.remove('tab__btn--active'));
                    
                    document.querySelectorAll('.tab__content').forEach(c => c.classList.remove('tab__content--active'));

                    e.target.classList.add('tab__btn--active');
                    
                    const contentElement = document.getElementById(`${tab}Orders`);
                    if (contentElement) {
                        contentElement.classList.add('tab__content--active');
                    }
                });
            });
        }

        // Делегирование событий для карточек заказов
        document.addEventListener('click', (e) => {
            // Кнопка "Получен"
            if (e.target.classList.contains('complete__order-btn')) {
                const orderId = e.target.dataset.orderId;
                const order = this.getOrderById(orderId);
                notifications.confirm({
                    title: 'Подтверждение получения',
                    
                    message: `Вы уверены, что хотите отметить заказ ${order.number} как полученный?`,
                    yesText: 'Да, получен',
                    noText: 'Нет'
                }).then(confirmed => {
                    if (confirmed) {
                        this.markAsCompleted(orderId);
                        
                        notifications.success(`Заказ ${order.number} отмечен как полученный!`);
                    }
                });

                e.stopPropagation();
            }

            // Клик по карточке заказа
            const orderCard = e.target.closest('.order__card');
            if (orderCard && !e.target.closest('.order__actions')) {
                const orderId = orderCard.dataset.orderId;
                this.showOrderDetails(orderId);
            }
        });
    }

    // Автоматическая проверка времени доставки
    startAutoRefresh() {
        setInterval(() => {
            this.checkDeliveryTimes();
        }, 60000); // каждую минуту
    }

    checkDeliveryTimes() {
        const now = new Date();
        let updated = false;

        this.orders.forEach(order => {
            if (order.status === 'active' && 
                order.userData.deliveryTime && 
                order.userData.deliveryTime !== 'Как можно скорее') {
                    
                const [hours, minutes] = order.userData.deliveryTime.split(':');
                const deliveryTime = new Date(order.createdAt);
                deliveryTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                // Если время доставки прошло, отмечаем как завершенный
                if (deliveryTime < now) {
                    order.status = 'completed';
                    order.completedAt = now.toISOString();
                    updated = true;
                }
            }
        });

        if (updated) {
            this.saveOrders();
            this.renderOrders();
        }
    }
}

// Интеграция с существующей системой заказов
document.addEventListener('DOMContentLoaded', () => {
    window.ordersManager = new OrdersManager();
});

// функция для тестирования
function addTestOrders() {
    const testOrders = [
        {
            id: 1,
            number: 'FC-123456',
            items: [
                {
                    id: 'gazpacho',
                    title: 'Гаспачо', 
                    price: 195, 
                    qty: 2, 
                    total: 390 
                },
                {
                    id: 'apple_juice', 
                    title: 'Яблочный сок', 
                    price: 90, 
                    qty: 1, 
                    total: 90 
                },
                {
                    id: 'lasagna', 
                    title: 'Лазанья', 
                    price: 385, 
                    qty: 1, 
                    total: 385 
                }
            ],
            total: 865,
            status: 'active',
            createdAt: new Date().toISOString(),
            userData: {
                userName: 'Иван Тестовый',
                email: 'test@example.com',
                userAddress: 'Москва, Тестовая ул., 123',
                userPhone: '+7 (123) 456-78-90',
                userComment: 'Тестовый заказ с комментарием',
                deliveryType: 'standard',
                deliveryTime: 'Как можно скорее'
            },
            completedAt: null
        },
        {
            id: 2,
            number: 'FC-654321',
            items: [
                {
                    id: 'lasagna', 
                    title: 'Лазанья', 
                    price: 385, 
                    qty: 1, 
                    total: 385 
                }
            ],
            total: 385,
            status: 'completed',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // Вчера
            userData: {
                userName: 'Петр Тестовый',
                email: 'test2@example.com',
                userAddress: 'Москва, Примерная ул., 456',
                userPhone: '+7 (987) 654-32-10',
                userComment: '',
                deliveryType: 'timed',
                deliveryTime: '14:30'
            },
            completedAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('fc_orders', JSON.stringify(testOrders));
    console.log('Test orders added');

    if (window.ordersManager) {
        window.ordersManager.renderOrders();
    }
}

// для добавления тестовых данных
addTestOrders();