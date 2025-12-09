from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
import json
from datetime import datetime, time
import os

app = FastAPI(title="Order Management API", version="1.0.0")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Файл для хранения данных
DATA_FILE = "orders.json"

# Модель данных заказа
class Order(BaseModel):
    order_id: Optional[int] = None
    api_key: str
    full_name: str = ""
    email: str = ""
    phone: str = ""
    comment: str = ""
    delivery_address: str
    delivery_type: str
    delivery_time: Optional[str] = None
    subscribe: bool = False
    dish_ids: List[int] = Field(default_factory=list)
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    status: str = "active"  # Добавляем поле статуса

    @validator('delivery_time')
    def validate_delivery_time(cls, v, values):
        """Валидация времени доставки"""
        if v is not None:
            try:
                if len(v) != 5 or v[2] != ':':
                    raise ValueError("Time must be in format HH:MM")
                hour = int(v[:2])
                minute = int(v[3:])
                if not (0 <= hour <= 23 and 0 <= minute <= 59):
                    raise ValueError("Invalid time value")
            except ValueError as e:
                raise ValueError(f"Invalid delivery_time format: {e}")
        return v

class OrderUpdate(BaseModel):
    api_key: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    comment: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_type: Optional[str] = None
    delivery_time: Optional[str] = None
    subscribe: Optional[bool] = None
    dish_ids: Optional[List[int]] = None
    status: Optional[str] = None  # Добавляем поле статуса

# Вспомогательные функции для работы с файлом
def load_orders() -> Dict[int, Dict[str, Any]]:
    """Загружает заказы из файла"""
    if not os.path.exists(DATA_FILE):
        return {}

    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            orders = {int(k): v for k, v in data.items()}
            
            # Добавляем статус для старых заказов
            for order_id, order in orders.items():
                if 'status' not in order:
                    order['status'] = 'active'
                    
            return orders
    except (json.JSONDecodeError, FileNotFoundError):
        return {}
    except (ValueError, TypeError):
        return {}

def save_orders(orders: Dict[int, Dict[str, Any]]) -> None:
    """Сохраняет заказы в файл"""
    orders_str_keys = {str(k): v for k, v in orders.items()}
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(orders_str_keys, f, indent=2, ensure_ascii=False)

def get_next_order_id(orders: Dict[int, Dict[str, Any]]) -> int:
    """Генерирует следующий ID заказа"""
    if not orders:
        return 1
    return max(orders.keys()) + 1

# API endpoints
@app.get("/labs/api/orders", response_model=List[Order])
def get_all_orders():
    """Получить все заказы"""
    orders = load_orders()
    return [Order(**order) for order in orders.values()]

@app.get("/labs/api/orders/{order_id}", response_model=Order)
def get_order(order_id: int):
    """Получить конкретный заказ по ID"""
    orders = load_orders()

    if order_id not in orders:
        raise HTTPException(status_code=404, detail="Order not found")

    return Order(**orders[order_id])

@app.post("/labs/api/orders", response_model=Order)
def create_order(order: Order):
    """Создать новый заказ"""
    orders = load_orders()

    order_id = get_next_order_id(orders)
    current_time = datetime.now().isoformat()

    order_data = order.dict(exclude_unset=True)
    order_data["order_id"] = order_id
    order_data["created_at"] = current_time
    order_data["updated_at"] = current_time
    order_data["status"] = order_data.get("status", "active")  # Устанавливаем статус

    if order_data.get("delivery_type") != "by_time" and "delivery_time" in order_data:
        order_data["delivery_time"] = None

    orders[order_id] = order_data
    save_orders(orders)

    return Order(**order_data)

@app.put("/labs/api/orders/{order_id}", response_model=Order)
def update_order(order_id: int, order_update: OrderUpdate):
    """Обновить существующий заказ"""
    orders = load_orders()

    if order_id not in orders:
        raise HTTPException(status_code=404, detail="Order not found")

    current_order = orders[order_id]

    update_data = order_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            current_order[field] = value

    if "delivery_type" in update_data and update_data["delivery_type"] != "by_time":
        current_order["delivery_time"] = None

    current_order["updated_at"] = datetime.now().isoformat()

    save_orders(orders)

    return Order(**current_order)

@app.delete("/labs/api/orders/{order_id}", response_model=Order)
def delete_order(order_id: int):
    """Удалить заказ"""
    orders = load_orders()

    if order_id not in orders:
        raise HTTPException(status_code=404, detail="Order not found")

    order_data = orders[order_id]
    del orders[order_id]
    save_orders(orders)

    return Order(**order_data)

# Эндпоинт для поиска заказов по dish_id
@app.get("/labs/api/orders/by-dish/{dish_id}")
def get_orders_by_dish_id(dish_id: int):
    """Получить заказы, содержащие определенное блюдо"""
    orders = load_orders()

    matching_orders = []
    for order_id, order in orders.items():
        if "dish_ids" in order and dish_id in order["dish_ids"]:
            matching_orders.append(Order(**order))

    return matching_orders

# Эндпоинт для получения заказов по типу доставки
@app.get("/labs/api/orders/by-delivery-type/{delivery_type}")
def get_orders_by_delivery_type(delivery_type: str):
    """Получить заказы по типу доставки"""
    orders = load_orders()

    matching_orders = []
    for order_id, order in orders.items():
        if order.get("delivery_type") == delivery_type:
            matching_orders.append(Order(**order))

    return matching_orders

# Эндпоинт для обработки OPTIONS запросов
@app.options("/labs/api/orders")
@app.options("/labs/api/orders/{order_id}")
@app.options("/labs/api/orders/by-dish/{dish_id}")
@app.options("/labs/api/orders/by-delivery-type/{delivery_type}")
async def options_handler():
    return {"message": "OK"}

# Корневой эндпоинт для проверки
@app.get("/")
def root():
    return {
        "message": "Order Management API",
        "endpoints": {
            "GET /labs/api/orders": "Get all orders",
            "GET /labs/api/orders/{id}": "Get order by ID",
            "POST /labs/api/orders": "Create new order",
            "PUT /labs/api/orders/{id}": "Update order",
            "DELETE /labs/api/orders/{id}": "Delete order",
            "GET /labs/api/orders/by-dish/{dish_id}": "Get orders containing specific dish",
            "GET /labs/api/orders/by-delivery-type/{type}": "Get orders by delivery type"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)