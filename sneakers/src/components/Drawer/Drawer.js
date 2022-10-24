import axios from "axios";

import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import Info from "../Info";

import style from "./drawer.module.scss";

const delay = () => new Promise((resolve) => setTimeout(resolve, 1000));

function Drawer({ closeCart, items = [], deleteOrder, opened }) {
    const { cartItems, setCartItems, totalPrice } = useCart();
    const [orderId, setOrderId] = useState(null);
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onClickOrder = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.post(
                "https://634d55e6f5d2cc648ea33890.mockapi.io/orders",
                { items: cartItems }
            );
            setOrderId(data.id);
            setIsOrderComplete(true);
            setCartItems([]);

            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                await axios.delete(
                    `https://634d55e6f5d2cc648ea33890.mockapi.io/cart/${item.id}`
                );
                await delay();
            }
        } catch (error) {
            alert("Не удалось создать заказ");
        }
        setIsLoading(false);
    };
    return (
        <div
            className={`${style.overlay} ${opened ? style.overlayVisible : ""}`}
        >
            <div className={style.drawer}>
                <h2 className="mb-30 d-flex justify-between">
                    Корзина{" "}
                    <img
                        onClick={closeCart}
                        className="removeBtn cu-p"
                        src="img/remove.svg"
                        alt="remove"
                    />
                </h2>
                {items.length > 0 ? (
                    <React.Fragment>
                        <div className="items">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="cartItem d-flex align-center mb-20"
                                >
                                    <div
                                        style={{
                                            backgroundImage: `url(${item.img})`,
                                        }}
                                        className="cartItemImg"
                                    ></div>
                                    <div className="mr-20 flex">
                                        <p className="mb-5">{item.name}</p>
                                        <b>
                                            {item.price
                                                .toString()
                                                .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    " "
                                                )}{" "}
                                            руб.
                                        </b>
                                    </div>
                                    <img
                                        onClick={() => {
                                            deleteOrder(item.id);
                                        }}
                                        className="removeBtn"
                                        src="img/remove.svg"
                                        alt="remove"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="cartTotalBlock">
                            <ul>
                                <li className="d-flex">
                                    <span>Итого: </span>
                                    <div></div>
                                    <b>
                                        {totalPrice
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                " "
                                            )}{" "}
                                        RUB
                                    </b>
                                </li>
                                <li className="d-flex">
                                    <span>Налог 5%: </span>
                                    <div></div>
                                    <b>
                                        {Math.round((totalPrice / 100) * 5)
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                " "
                                            )}{" "}
                                        RUB
                                    </b>
                                </li>
                            </ul>
                            <button
                                disabled={isLoading}
                                onClick={onClickOrder}
                                className="greenButton"
                            >
                                {"Оформить заказ"}
                                <img src="img/arrow.svg" alt="arrow" />
                            </button>
                        </div>
                    </React.Fragment>
                ) : (
                    <Info
                        title={
                            isOrderComplete ? "Заказ оформлен" : "Корзина пуста"
                        }
                        description={
                            isOrderComplete
                                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                                : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
                        }
                        image={
                            isOrderComplete
                                ? "img/order.jpg"
                                : "img/cart-empty.jpg"
                        }
                    />
                )}
            </div>
        </div>
    );
}

export default Drawer;
