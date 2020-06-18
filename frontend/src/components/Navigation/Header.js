import React, { useState, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Drower } from './Drower'
import { MenuToggle } from './MenuToggle'
import { BasketContext } from '../../context/basket/BasketContext'
import { AuthContext } from '../../context/auth/AuthContext'

export const Header = () => {

    const [menu, setMenu] = useState(false)
    const { token, onLogout } = useContext(AuthContext)
    const { price, count, fetchBasket } = useContext(BasketContext)
    const isAuthenticated = !!token

    useEffect(() => {
        fetchBasket()
    // eslint-disable-next-line
    }, [price, count])

    return (
        <div className="header">
            <div className="cont">
                <div className="ro">
                    <div className="header-logo">
                        <NavLink exact to="/" className="nav-link">Shop</NavLink>
                    </div>
                    <div className="header-body">
                        <div className="header-item">
                            <NavLink exact to="/" className="nav-link">Главная</NavLink>
                        </div>
                        <div className="header-item">
                            <NavLink exact to="/items" className="nav-link">Каталог</NavLink>
                        </div>
                        <div className="header-item">
                            <NavLink to="/about" className="nav-link">О нас</NavLink>
                        </div>
                        {
                            isAuthenticated
                                ? <div className="header-item">
                                    <NavLink to="/account/info" className="nav-link">Личный кабинет</NavLink>
                                </div>
                                : null
                        }
                        <div className="header-right">
                            <div className="header-item">
                                <NavLink to="/basket" className="nav-link">Корзина</NavLink>
                                {count === 0 ? null : <span>{count}</span>}
                            </div>
                            <div className="header-item">
                                {
                                    isAuthenticated
                                        ? <NavLink exact to="/" className="nav-link active-none" onClick={() => onLogout()}>Выйти</NavLink>
                                        : <NavLink to="/log" className="nav-link">Войти</NavLink>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Drower isOpen={menu} onClose={() => setMenu(!menu)} />
                <MenuToggle isOpen={menu} isToggle={() => setMenu(!menu)} />
            </div>
        </div>
    )
}