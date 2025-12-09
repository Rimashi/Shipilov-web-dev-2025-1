class FoodConstructAPI {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.key = API_KEY;
    }

    // Получить данные всех блюд
    async getDishes() {
        try {
            const response = await fetch(
                `${this.baseUrl}/dishes?key=${this.key}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error (getDishes):', error);
            throw error;
        }
    }

    // Получить данные конкретного блюда
    async getDishById(id) {
        try {
            const response = await fetch(
                `${this.baseUrl}/dishes/${id}?key=${this.key}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error (getDishById):', error);
            return null;
        }
    }

    // Создать новый заказ
    async createOrder(orderData) {
        try {
            console.log('Sending order data:', orderData);
            console.log('URL:', `${this.baseUrl}/orders?key=${this.key}`);

            const response = await fetch(
                `${this.baseUrl}/orders?key=${this.key}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        // Попробуйте добавить эти заголовки
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify(orderData),
                    mode: 'cors',
                    credentials: 'omit' // Явно указываем без credentials
                });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                let errorText;
                try {
                    errorText = await response.text();
                } catch (e) {
                    errorText = 'Не удалось получить текст ошибки';
                }
                console.error('Server error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Order created successfully:', result);
            return result;
        } catch (error) {
            console.error('API Error (createOrder):', error);
            throw error;
        }
    }

    // Получить данные всех заказов
    async getOrders() {
        try {
            const response = await fetch(
                `${this.baseUrl}/orders?key=${this.key}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Ошибка загрузки заказов');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error (getOrders):', error);
            throw error;
        }
    }

    // Получить данные конкретного заказа
    async getOrderById(id) {
        try {
            const response = await fetch(
                `${this.baseUrl}/orders/${id}?key=${this.key}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Ошибка загрузки заказа');
            }
            return await response.json();
        } catch (error) {
            console.error('Ошибка загрузки заказа:', error);
            throw error;
        }
    }

    // Изменить заказ
    async updateOrder(id, orderData) {
        try {
            const response = await fetch(
                `${this.baseUrl}/orders/${id}?key=${this.key}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

            if (!response.ok) {
                throw new Error('Ошибка обновления заказа');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error (updateOrder):', error);
            throw error;
        }
    }

    // Удалить заказ
    async deleteOrder(id) {
        try {
            const response = await fetch(
                `${this.baseUrl}/orders/${id}?key=${this.key}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json'
                    }
                });

            if (!response.ok) {
                throw new Error('Ошибка удаления заказа');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error (deleteOrder):', error);
            throw error;
        }
    }
}

// Создаем глобальный экземпляр API
window.basketAPI = new FoodConstructAPI();