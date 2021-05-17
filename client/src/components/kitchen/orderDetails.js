import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';

export default function OrderDetails(props) {
    const oid = props.match.params.oid;
    const tno = props.match.params.tno;
    const [orders, setOrders] = useState([])

    useEffect(() => {
        Axios.post('http://localhost:3001/api/getOrderDetails', {
            oid: oid,
        })
            .then(resolve => {
                let data = resolve.data.data;
                //console.log(resolve.data.data);
                setOrders(data);
            })
            .catch(reject => console.log(reject))
    }, [])

    return (
        <>
            <div className="details">
                <div className="box-details">
                    <h3>ORDER NUMBER {oid}</h3>
                    <h3 style={{ color: '#000000' }}>Serving FOR TABLE NUMBER :- {tno}</h3>
                </div>
            </div>

            {
                orders.map(product => (

                    <div className="details" key={product.itemid}>
                        {/* <div className="img-container"
                        //    style={{backgroundImage: `url(${product.images[index]})`}}
                        /> */}
                        <div className="box-details">
                            <h3 title={product.name}>ITEM NAME : {product.name} :- {product.qty} PLATE(S)</h3>
                            <h4>Special Note : {product.special_note}</h4>
                        </div>
                    </div>
                ))
            }
            <div className="details">
                {/* {console.log(orders)} */}
                <div className="box-details">
                    <Link to="#" className="cart">
                        ACCEPT and PREPARE
                    </Link>
                    <Link to="/kitchenOrder" className="cart">
                        GO BACK
                    </Link>
                </div>

            </div>


        </>
    )
}
