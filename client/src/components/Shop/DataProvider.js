import React, { createContext, useState, useEffect } from 'react';
import Axios from 'axios'

export const DataContext = createContext();

export const DataProvider = (props) => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        Axios.get('http://localhost:3001/api/getAllProducts')
            .then(resolve => {
                let data = resolve.data.data;
                setProducts(data);
            })
            .catch(reject => console.log(reject))
    }, [])

    //     "_id": "1",
    //     "title": "Wacth Product 01",
    //     "images": [
    //         "https://www.upsieutoc.com/images/2020/07/18/img1.jpg",
    //         "https://www.upsieutoc.com/images/2020/07/18/img2.jpg",
    //         "https://www.upsieutoc.com/images/2020/07/18/img3.jpg",
    //         "https://www.upsieutoc.com/images/2020/07/18/img4.jpg"
    //     ],
    //     "description": "How to and tutorial videos of cool CSS effect, Web Design ideas,JavaScript libraries, Node.",
    //     "content": "Welcome to our channel Dev AT. Here you can learn web designing, UI/UX designing, html css tutorials, css animations and css effects, javascript and jquery tutorials and related so on.",
    //     "colors": ["red", "black", "teal"],
    //     "sizes": ["XL", "L", "M", "XM", "LX"],
    //     "price": 101,
    //     "count": 1
    // },
    // 


    const [cart, setCart] = useState([])

    const addCart = (id, desc) => {
        const check = cart.every(item => {
            return item._id !== id
        })

        if (check) {
            const data = products.filter(product => {
                return product._id === id
            })
            //data.push({ sn: desc })
            if (desc) {
                data.map((a) => {
                    a.special_note = desc
                })
            }
            else {
                data.map((a) => {
                    a.special_note = null
                })
            }
            //console.log(data)
            setCart([...cart, ...data])
        } else {
            alert("The product has been added to cart.")
        }
    }

    useEffect(() => {
        const dataCart = JSON.parse(localStorage.getItem('dataCart'))
        if (dataCart) setCart(dataCart)
    }, [])

    useEffect(() => {
        localStorage.setItem('dataCart', JSON.stringify(cart))
    }, [cart])


    const value = {
        products: [products, setProducts],
        cart: [cart, setCart],
        addCart: addCart
    }


    return (
        <DataContext.Provider value={value}>
            {props.children}
        </DataContext.Provider>
    )
}
