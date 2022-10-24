import React from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";
import Orders from "./pages/Orders";
import Drawer from "./components/Drawer";

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [cartOpened, setCartOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [cartResponse, favoriteResponse, itemsResponse] =
                    await Promise.all([
                        axios.get(
                            "https://634d55e6f5d2cc648ea33890.mockapi.io/cart"
                        ),
                        axios.get(
                            "https://634d55e6f5d2cc648ea33890.mockapi.io/favorites"
                        ),
                        axios.get(
                            "https://634d55e6f5d2cc648ea33890.mockapi.io/items"
                        ),
                    ]);

                setIsLoading(false);

                setCartItems(cartResponse.data);
                setFavorites(favoriteResponse.data);
                setItems(itemsResponse.data);
            } catch (error) {
                alert("Произошла ошибка загрузки");
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const addCart = async (item) => {
        try {
            const findItem = cartItems.find(
                (obj) => Number(obj.parentId) === Number(item.id)
            );
            if (findItem) {
                setCartItems((prev) =>
                    prev.filter((e) => Number(e.parentId) !== Number(item.id))
                );
                axios.delete(
                    `https://634d55e6f5d2cc648ea33890.mockapi.io/cart/${findItem.id}`
                );
            } else {
                setCartItems((prev) => [...prev, item]);
                const { data } = await axios.post(
                    "https://634d55e6f5d2cc648ea33890.mockapi.io/cart",
                    item
                );
                setCartItems((prev) =>
                    prev.map((item) => {
                        if (item.parentId === data.parentId) {
                            return {
                                ...item,
                                id: data.id,
                            };
                        }
                        return item;
                    })
                );
            }
        } catch (error) {
            alert("Не удалось добавить товар в корзину");
            console.error(error);
        }
    };

    const deleteOrder = (id) => {
        try {
            axios.delete(
                `https://634d55e6f5d2cc648ea33890.mockapi.io/cart/${id}`
            );
            console.log(id);
            setCartItems((prev) => prev.filter((e) => +e.id !== +id));
        } catch (error) {
            alert("Не удалось удалить товар из корзины");
            console.error(error);
        }
    };

    const onFavorite = async (item) => {
        try {
            const findItem = favorites.find((obj) => obj.parentId === item.id);
            if (findItem) {
                axios.delete(
                    `https://634d55e6f5d2cc648ea33890.mockapi.io/favorites/${findItem.id}`
                );
                setFavorites((prev) =>
                    prev.filter((e) => Number(e.parentId) !== Number(item.id))
                );
            } else {
                const { data } = await axios.post(
                    "https://634d55e6f5d2cc648ea33890.mockapi.io/favorites",
                    item
                );
                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert("Не удалось добавить товар в избранное");
            console.error(error);
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    const isItemAdded = (id) => {
        return cartItems.some((obj) => +obj.parentId === +id);
    };
    const isFavoriteItem = (id) => {
        return favorites.some((obj) => +obj.parentId === +id);
    };

    return (
        <AppContext.Provider
            value={{
                items,
                cartItems,
                favorites,
                isItemAdded,
                setCartOpened,
                setCartItems,
                isFavoriteItem,
            }}
        >
            <div className="wrapper clear">
                <Drawer
                    items={cartItems}
                    key={cartItems.map((item) => item.id)}
                    closeCart={() => setCartOpened(!cartOpened)}
                    deleteOrder={deleteOrder}
                    opened={cartOpened}
                />
                <Header onClickCart={() => setCartOpened(true)} />
                <Routes>
                    <Route
                        path=""
                        element={
                            <Home
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                onChangeSearchInput={onChangeSearchInput}
                                onFavorite={onFavorite}
                                addCart={addCart}
                                deleteOrder={deleteOrder}
                                isLoading={isLoading}
                            />
                        }
                    />
                    <Route
                        path="favorites"
                        element={
                            <Favorites
                                onFavorite={onFavorite}
                                key={items.map((item) => item.id)}
                            />
                        }
                    />
                    <Route path="orders" element={<Orders />} />
                </Routes>
            </div>
        </AppContext.Provider>
    );
}

export default App;
