import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';

export default function OrderNumbers() {
    const [orderNumbers, setOrderNumbers] = useState([])

    useEffect(() => {
        Axios.get('http://localhost:3001/api/getOrderNumbers')
            .then(res => {
                const data = res.data.data;
                let oid = data.map(JSON.stringify)
                let uniques = new Set(oid)
                let uniqueOid = Array.from(uniques).map(JSON.parse)
                setOrderNumbers(uniqueOid)
            })
    }, [])

    return (
        <div className="products">
            {
                orderNumbers.map(category => (
                    <div className="card" key={category.oid}>
                        <Link to={`/kitchenOrder/orderDetails/${category.oid}/${category.tableid}`}>
                            <img src={process.env.PUBLIC_URL + "/MENU.jpg"} alt="" />
                        </Link>
                        <div className="box">
                            <h3 title={category.oid}>
                                <Link to={`/kitchenOrder/orderDetails/${category.oid}/${category.tableid}`}>Order Number : {category.oid}</Link>
                            </h3>
                            <p>TABLE NUMBER : {category.tableid}</p>
                            <h2 title={category.oid}>
                                <Link to={`/kitchenOrder/orderDetails/${category.oid}/${category.tableid}`}>TAP TO VIEW</Link>
                            </h2>
                        </div>
                    </div>
                ))
            }
        </div >
    )
}
