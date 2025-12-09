class BasketStorage {
    constructor() {
        this.STORAGE_KEY = 'fc_basket';
        this.menuData = null;
        this.init();
    }

    async init() {
        await this.loadMenu();
    }

    async loadMenu() {
        try {
            this.menuData = await basketAPI.getDishes();
            console.log('Menu loaded successfully:', this.menuData);
        } catch (error) {
            console.error('Failed to load menu:', error);
            this.menuData = [];
        }
    }

    // Получить блюдо по ID из кэша
    getDishById(id) {
        if (!this.menuData) return null;
        return this.menuData.find(dish => dish.id == id);
    }

    // Получить текущую корзину
    getBasket() {
        try {
            const basket = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
            console.log('Current basket:', basket);
            return basket;
        } catch {
            return [];
        }
    }

    // Сохранить корзину
    saveBasket(basket) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(basket));
        console.log('Basket saved:', basket);
        this.dispatchBasketUpdate();
    }

    // Добавить товар в корзину (только ID)
    addItem(id) {
        const basket = this.getBasket();
        const existingItem = basket.find(item => item.id == id);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            basket.push({ id, quantity: 1 });
        }

        this.saveBasket(basket);
    }

    // Удалить товар из корзины
    removeItem(id) {
        const basket = this.getBasket().filter(item => item.id != id);
        this.saveBasket(basket);
    }

    // Изменить количество товара
    updateQuantity(id, quantity) {
        const basket = this.getBasket();
        const item = basket.find(item => item.id == id);

        if (item) {
            if (quantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = quantity;
                this.saveBasket(basket);
            }
        }
    }

    // Очистить корзину
    clearBasket() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.dispatchBasketUpdate();
    }

    // Получить общее количество товаров
    getTotalCount() {
        const basket = this.getBasket();
        return basket.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }

    // Получить полную информацию о товарах в корзине
    async getBasketWithDetails() {
        const basket = this.getBasket();
        const itemsWithDetails = [];

        // Если меню не загружено, загружаем
        if (!this.menuData || this.menuData.length === 0) {
            await this.loadMenu();
        }

        for (const item of basket) {
            const dish = this.getDishById(item.id);
            if (dish) {
                itemsWithDetails.push({
                    ...item,
                    name: dish.name,
                    price: dish.price,
                    image: dish.image,
                    category: dish.category
                });
            } else {
                console.warn(`Dish with id ${item.id} not found in menu`);
            }
        }

        return itemsWithDetails;
    }

    // Получить общую стоимость
    async getTotalPrice() {
        const items = await this.getBasketWithDetails();
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Проверить, какие обязательные категории отсутствуют
    async getMissingCategories() {
        const items = await this.getBasketWithDetails();
        const categories = new Set(items.map(item => item.category));
        
        const requiredCategories = ['soup', 'main-course', 'drink'];
        const missing = [];

        requiredCategories.forEach(category => {
            if (!categories.has(category)) {
                missing.push({
                    id: category,
                    name: fcUtils.getRuCategory(category),
                    category: category
                });
            }
        });

        return missing;
    }

    // Событие обновления корзины
    dispatchBasketUpdate() {
        window.dispatchEvent(new CustomEvent('basket-updated'));
    }
}

// Создаём глобальный экземпляр
window.basketStorage = new BasketStorage();