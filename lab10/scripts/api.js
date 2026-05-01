class FoodConstructAPI {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.key = API_KEY;
        this.localServerUrl = 'http://localhost:8000';
    }

    // Получить данные всех блюд
    async getDishes() {
        try {
            const response = await fetch(
                `${this.baseUrl}/dishes?api_key=${this.key}`,
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
                `${this.baseUrl}/dishes/${id}?api_key=${this.key}`,
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
            const dataWithKey = {
                ...orderData,
                api_key: this.key
            };

            console.log('Sending order data:', dataWithKey);
            console.log('URL:', `${this.localServerUrl}/labs/api/orders`);

            const response = await fetch(
                `${this.baseUrl}/orders`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(dataWithKey),
                });

            console.log('Response status:', response.status);

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
                `${this.baseUrl}/orders`,
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
            console.error('API Error (getOrders):', error);
            throw error;
        }
    }

    // Получить данные конкретного заказа
    async getOrderById(id) {
        try {
            const response = await fetch(
                `${this.baseUrl}/orders/${id}`,
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
            console.error('API Error (getOrderById):', error);
            throw error;
        }
    }

    // Изменить заказ
    async updateOrder(id, orderData) {
        try {
            const dataWithKey = {
                ...orderData,
                api_key: this.key
            };

            console.log('Updating order:', id, dataWithKey);

            const response = await fetch(
                `${this.baseUrl}/orders/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(dataWithKey),
                });

            console.log('Update response status:', response.status);

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
            console.log('Order updated successfully:', result);
            return result;
        } catch (error) {
            console.error('API Error (updateOrder):', error);
            throw error;
        }
    }

    // Удалить заказ
    async deleteOrder(id) {
        try {
            console.log('Deleting order:', id);

            const response = await fetch(
                `${this.baseUrl}/orders/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json'
                    },
                });

            console.log('Delete response status:', response);

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
            console.log('Order deleted successfully:', result);
            return result;
        } catch (error) {
            console.error('API Error (deleteOrder):', error);
            throw error;
        }
    }
}

// Создаем глобальный экземпляр API
window.basketAPI = new FoodConstructAPI();
