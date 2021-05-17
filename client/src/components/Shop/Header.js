import React, { useState, useContext } from 'react'
import Menu from './svg/bars-solid.svg'
import Close from './svg/times-solid.svg'
import Cart from './svg/cart.svg'
import { Link, Redirect } from 'react-router-dom'
import { DataContext } from './DataProvider'
import Axios from 'axios'

export default function Header() {

    const clearUser = (tableid) => {
        Axios.post('http://localhost:3001/api/clearUserDetails', {
            tid: tableid,
        }).then(res => console.log(res.data.msg))
    }

    const logout = () => {
        // if (localStorage.getItem("Placed")) {
        //     window.alert("You can not log out at this instance, First make payment, then you will be able to log out automatically!")
        // }
        if (window.confirm("Logging out will not provide you the functionality to order! You still want to continue?")) {
            clearUser(localStorage.getItem('TableId'))
            let tableid = localStorage.getItem('TableId')
            localStorage.clear();
            window.location.href = `/home/${tableid}`;
        }
    }

    const [menu, setMenu] = useState(false)
    const value = useContext(DataContext)
    const [cart] = value.cart

    const toggleMenu = () => {
        setMenu(!menu)
    }

    const styleMenu = {
        left: menu ? 0 : "-100%"
    }

    return (
        <header>
            <div className="menu" onClick={toggleMenu}>
                <img src={Menu} alt="" width="30" />
            </div>

            <div className="logo">
                <h1><Link to="/productTable"><i>Rest-O-Fast</i></Link></h1>
            </div>
            <ul style={styleMenu}>
                <li onClick={() => { window.location.href = `/home/${localStorage.getItem("tempTableId")}` }}><Link>Back to Home</Link></li>
                <li><Link to="/productTable">Categories</Link></li>
                <li><Link>{localStorage.getItem("Name")}</Link></li>
                <li onClick={() => logout()}><Link>
                    {localStorage.getItem("Name") &&
                        <>Logout</>
                    }
                </Link></li>

                <li onClick={toggleMenu}>
                    <img src={Close} alt="" width="30" className="menu" />
                </li>
            </ul>

            <div className="cart-icon">
                <span>{cart.length}</span>
                <Link to="/productTable/cart">
                    <img src={Cart} alt="" width="30" />
                </Link>
            </div>

        </header>
    )
}
