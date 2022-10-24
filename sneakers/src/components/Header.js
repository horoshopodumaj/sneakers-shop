import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export default function Header(props) {
    const { totalPrice } = useCart();
    return (
        <header className="d-flex justify-between align-center p-40">
            <Link to="">
                <div className="d-flex align-center">
                    <img
                        className="mr-15"
                        width={40}
                        height={40}
                        src="img/logo.png"
                        alt="Logo"
                    />
                    <div>
                        <h3 className="text-uppercase">react sneakers</h3>
                        <p className="opacity-5">Магазин лучших кроссовок</p>
                    </div>
                </div>
            </Link>
            <ul className="d-flex">
                <li className="mr-30 cu-p" onClick={props.onClickCart}>
                    <img
                        className="mr-15"
                        width={18}
                        height={18}
                        src="img/cart.svg"
                        alt="cart"
                    />
                    <span>
                        {totalPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                        RUB
                    </span>
                </li>
                <li className="mr-20 cu-p">
                    <Link to="favorites">
                        <img
                            width={18}
                            height={18}
                            src="img/like-icon.svg"
                            alt="bookmarks"
                        />
                    </Link>
                </li>
                <li>
                    <Link to="orders">
                        <img
                            width={18}
                            height={18}
                            src="img/user.svg"
                            alt="user"
                        />
                    </Link>
                </li>
            </ul>
        </header>
    );
}
