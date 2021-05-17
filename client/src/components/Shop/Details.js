import React, { useContext, useState, useRef, useEffect } from 'react'
import { DataContext } from './DataProvider'
import { Link } from 'react-router-dom'
import Axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar'
import { TextField } from '@material-ui/core';

export default function Details(props) {
    const id = props.match.params.id;
    const value = useContext(DataContext)

    const [products, setProducts] = useState([])
    const [productState, setProductState] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [specialNote, setSpecialNote] = useState('')
    //const [specialNotes, setSpecialNotes] = useState([])

    const Note = (desc) => {
        details["special_note"] = desc
    }

    const addCart = value.addCart

    useEffect(() => {
        Axios.get('http://localhost:3001/api/getAllProducts')
            .then(resolve => {
                let data = resolve.data.data;
                setProducts(data);
                setProductState(true)
            })
            .catch(reject => console.log(reject))
    }, [])

    let details = [];

    if (productState) {
        details = products.filter(product => {
            return parseInt(product._id) === parseInt(id)
        })
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            // action={
            //     <React.Fragment>
            //         <IconButton>
            //             <CloseIcon />
            //         </IconButton>
            //     </React.Fragment>
            // }

            />
            {
                details.map(product => (
                    <div className="details" key={product._id}>
                        <div className="img-container"
                            style={{ backgroundImage: `url(${product.image}` }}
                        />
                        <div className="box-details">
                            <h2 title={product.name}>{product.name}</h2>
                            <h3>₹{product.price}</h3>
                            <br></br>
                            <p>{product.description}</p>
                            <br></br>
                            <h3>Enter the special note along with this item if you want any specific thing!</h3>
                            <br></br>
                            <TextField
                                style={{ width: '75%' }}
                                id="standard-basic"
                                label="ADD A SPECIAL NOTE"
                                onChange={(e) => setSpecialNote(e.target.value)}
                            />
                            {/* <p></p> */}
                            {/* <DetailsThumb images={product.images} setIndex={setIndex} /> */}
                            <br /><br />
                            <Link className="cart" onClick={() => {
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
                                            //console.log(specialNote)
                                            addCart(product._id, specialNote)
                                            //Note(product._id, specialNote)
                                            setOpenSnackbar(true)
                                            setSnackbarMessage("Item has been successfully Added to cart!")
                                        }
                                        else {
                                            alert("The login for this table has been done! Please order by that login! 1 Table 1 login!")
                                        }
                                    })
                            }}>
                                Add to cart
                            </Link>
                        </div>

                    </div>
                ))
            }
        </>
    )
}
