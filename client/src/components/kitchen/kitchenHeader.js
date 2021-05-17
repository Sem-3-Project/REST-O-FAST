import React, { useState, useContext } from 'react'
import Menu from './svg/bars-solid.svg'
import Close from './svg/times-solid.svg'
import Cart from './svg/cart.svg'
import { Link, Redirect } from 'react-router-dom'
//import { DataContext } from './DataProvider'

export default function KitchenHeader() {

    const logout = () => {
        if (window.confirm("You will no longer be able to look for new orders from customers! Are you sure you want to log out?")) {
            localStorage.clear();
            window.location.href = "/login";
        }
    }

    const [menu, setMenu] = useState(false)




    const styleMenu = {
        left: menu ? 0 : "-100%"
    }

    return (
        <header>
            <div className="logo">
                <h1><Link to="/kitchenOrder"><i>Rest-O-Fast --KITCHEN INTERFACE</i></Link></h1>
            </div>
            <ul style={styleMenu}>
                <li><Link>{localStorage.getItem("Name")}</Link></li>
                <li onClick={() => logout()}><Link>
                    {localStorage.getItem("Name") &&
                        <>Logout</>
                    }
                </Link></li>
            </ul>
        </header>
    )
}
