import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    "https://634d55e6f5d2cc648ea33890.mockapi.io/orders"
                );
                setOrders(
                    data.reduce((prev, obj) => [...prev, ...obj.items], [])
                );
                setIsLoading(false);
            } catch (error) {
                alert("Что-то пошло не так");
                console.error(error);
            }
        })();
    }, []);
    return (
        <div className="content p-40">
            <div className="d-flex align-center mb-40 justify-between">
                <h1>Мои заказы</h1>
            </div>
            <div className="d-flex flex-wrap card-container">
                {(isLoading ? [...Array(12)] : orders).map((sneaker) => (
                    <Card
                        key={sneaker && sneaker.id}
                        {...sneaker}
                        isLoading={isLoading}
                    />
                ))}
            </div>
        </div>
    );
}
