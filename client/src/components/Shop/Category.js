import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';
import TextField from '@material-ui/core/TextField'

export default function Category() {
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        Axios.get('http://localhost:3001/api/getCategoryNames')
            .then(res => {
                const data = res.data.data;
                setCategories(data)
            })
    }, [])

    return (
        <>
            <TextField
                style={{ width: '50%' }}
                id="standard-basic"
                label="SEARCH CATEGORY"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="products">
                {
                    categories.filter((val) => {
                        if (searchTerm == "") {
                            return val
                        }
                        else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return val
                        }
                    }).map(category => (
                        <div className="card" key={category.id}>
                            <Link to={`/productTable/products/${category.id}`}>
                                <img src={process.env.PUBLIC_URL + category.image} alt="" />
                            </Link>
                            <div className="box">
                                <h3 title={category.name}>
                                    <Link to={`/productTable/products/${category.id}`}>{category.name}</Link>
                                </h3>
                                <p>{category.description}</p>
                                <h2 title={category.name}>
                                    <Link to={`/productTable/products/${category.id}`}>Discover More</Link>
                                </h2>
                            </div>
                        </div>
                    ))
                }
            </div >
        </>
    )
}
