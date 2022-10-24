import React from "react";
import Card from "../components/Card";
import AppContext from "../context";
import { useContext } from "react";

export default function Favorites({ onFavorite }) {
    const { favorites } = useContext(AppContext);
    return (
        <div className="content p-40">
            <div className="d-flex align-center mb-40 justify-between">
                <h1>Мои кроссовки</h1>
            </div>
            <div className="d-flex flex-wrap card-container">
                {favorites.map((sneaker) => (
                    <Card
                        key={sneaker.id}
                        onFavorite={onFavorite}
                        {...sneaker}
                    />
                ))}
            </div>
        </div>
    );
}
