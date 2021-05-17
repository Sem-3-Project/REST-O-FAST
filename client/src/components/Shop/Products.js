import React, { useEffect, useContext, useState } from 'react'
import { DataContext } from './DataProvider'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import TextField from '@material-ui/core/TextField'

export default function Products(props) {

    const [searchTerm, setSearchTerm] = useState('');

    const Cno = props.match.params.id;
    const value = useContext(DataContext)
    const [products, setProducts] = useState([])
    const addCart = value.addCart

    useEffect(() => {
        Axios.post('http://localhost:3001/api/getProductDetails', {
            id: Cno,
        })
            .then(resolve => { let data = resolve.data.data; setProducts(data) })
            .catch(reject => console.log(reject))
    }, [])

    return (
        <>
            <div className="search">
                <h3>After the selection of products. Please Navigate to the cart icon for further order processing!</h3>
                <TextField
                    style={{ width: '50%' }}
                    id="standard-basic"
                    label="SEARCH ITEM"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="products">
                {
                    products.filter((val) => {
                        if (searchTerm == "") {
                            return val
                        }
                        else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return val
                        }
                    }).map(product => (
                        <div className="card" key={product._id}>
                            <Link to={`/productTable/details/${product._id}`}>
                                <img src={process.env.PUBLIC_URL + product.image} alt="" />
                            </Link>
                            <div className="box">
                                <h3 title={product.name}>
                                    <Link to={`/productTable/details/${product._id}`}>{product.name}</Link>
                                </h3>
                                <h4>₹{product.price}</h4>
                                <br></br>
                                <h4>{product.description}</h4>
                                <br></br>
                                <button onClick={() => {

                                    Axios.post('http://localhost:3001/api/checkIfLoggedIn',
                                        {
                                            tableId: localStorage.getItem("tempTableId")
                                        }).then(res => {
                                            let flag = res.data.res
                                            // console.log(res.data.res)
                                            if (flag === 0) { //Not logged in!
                                                alert("Dear user please log in to continue the order process!")
                                                window.location.href = '/login'
                                            }
                                            else if (localStorage.getItem("thisIsTheUser")) {
                                                addCart(product._id)
                                            }
                                            else {
                                                alert("The login for this table has been done! Please order by that login! 1 Table 1 login!")
                                            }
                                        })
                                }}>
                                    Add to cart
                        </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
