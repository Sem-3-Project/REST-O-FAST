import React, { useContext, useState, useEffect } from 'react'
import { DataContext } from './DataProvider'
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Axios from 'axios';


export default function Cart() {

    const value = useContext(DataContext)
    const [cart, setCart] = value.cart;
    const [total, setTotal] = useState(0)
    const [buttonTitle, setButtonTitle] = useState("PLACE")
    const [progressState, setProgressState] = useState(false)
    const [count, setCount] = useState(1);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (localStorage.getItem('refresh') === '1') {
            console.log("Executed!")
            JSON.parse(localStorage.getItem('cart')) ? setCart(JSON.parse(localStorage.getItem('cart'))) : console.log("No")
            localStorage.setItem('refresh', '0')
        }
    }, [cart])

    const insertValues = (no, cart) => {
        Axios.post('http://localhost:3001/api/insertOrderDetails', {
            no: no,
            order: cart,
        })
    }

    useEffect(() => {
        const getTotal = () => {
            const res = cart.reduce((prev, item) => {
                return prev + (item.price * item.count)
            }, 0)
            setTotal(res)
        }
        getTotal()
    }, [cart])

    const insertIntoDB = () => {
        window.alert("Your order has been successfully placed! Order Number is : RF-007")
        const table_no = localStorage.getItem("TableId");
        insertValues(table_no, cart);
        localStorage.setItem("Placed", true);
        setCart([]);
    }

    useEffect(() => {
        let timeout;
        let timer;

        if (progressState) {

            timeout = setTimeout(() => {
                setProgressState(false);
                insertIntoDB();
                clearTimeout(timeout);
            }, 10000);

            timer = setInterval(() => {
                setCount((prevCount) => {
                    if (prevCount === 0)
                        return 10;
                    return prevCount - 1;
                });
            }, 1000);
        }
        return () => { clearTimeout(timeout); clearInterval(timer); setCount(10) }
    }, [progressState])



    const orderPlace = () => {
        if (buttonTitle === "PLACE") {
            handleClickOpen()
        }
        if (buttonTitle === "CANCEL") {
            setProgressState(false);
            setButtonTitle("PLACE");
        }
    }


    const proceed = () => {
        setProgressState(true);
        setButtonTitle("CANCEL");
        setOpen(false);
    }

    const reduction = id => {
        cart.forEach(item => {
            if (item._id === id) {
                item.count === 1 ? item.count = 1 : item.count -= 1;
            }
        })
        setCart([...cart])
    }

    const increase = id => {
        cart.forEach(item => {
            if (item._id === id) {
                item.count += 1;
            }
        })
        setCart([...cart])
    }

    const removeProduct = id => {
        if (window.confirm("Do you want to delete this product?")) {
            cart.forEach((item, index) => {
                if (item._id === id) {
                    cart.splice(index, 1)
                }
            })
            setCart([...cart])
        }
    }

    if (cart.length === 0)
        return <h4 style={{ textAlign: "center", fontSize: "1.5rem" }}>Nothing's there in Cart, Navigate to CATEGORIES to order some food!</h4>

    const toCheckout = () => {
        localStorage.setItem('cart', JSON.stringify(cart))
        localStorage.setItem('refresh', '1')
        //console.log(JSON.parse(localStorage.getItem('cart')))
        setCart([])
        window.location.href = '/checkout'
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Place Order?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        REST-O-FAST will give you a window of 10 seconds in which you will be able to
                        cancel your order. Once the time expires the order will be automatically placed.
                        Once placed you cannot cancel the order!
                        Thank you,
                        REST-O-FAST!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        GO BACK
                    </Button>
                    <Button onClick={proceed} color="primary" autoFocus>
                        PROCEED
                    </Button>
                </DialogActions>
            </Dialog>
            {
                cart.map(product => (
                    <div className="details cart" key={product._id}>
                        <div className="img-container"
                            style={{ backgroundImage: `url(${product.image}` }}
                        />
                        {/* <img src={process.env.PUBLIC_URL + product.image} alt="" /> */}
                        <div className="box-details">
                            <h2 title={product.name}>{product.name}</h2>
                            <h3>Rs.{product.price}</h3>
                            <div className="amount">
                                <button className="count" onClick={() => reduction(product._id)}> - </button>
                                <span>{product.count}</span>
                                <button className="count" onClick={() => increase(product._id)}> + </button>
                            </div>
                            <div className="delete" onClick={() => removeProduct(product._id)}>X</div>
                        </div>

                    </div>
                ))
            }
            <div className="total">
                {/* {progressState &&
                    <>
                        <CircularProgress color="secondary" />
                        <div style={{ fontFamily: "Consolas", fontSize: "20px", marginBottom: "6px" }}>
                            {count}
                        </div>

                    </>
                } */}
                <h3>AMOUNT  :  ₹{total}</h3>
                <h3>GST 5%  :  ₹{total * 0.05}</h3>
                <h3>TOTAL  :  ₹{total + (total * 0.05)}</h3>
            </div>
            <br />
            <Button style={{ backgroundColor: "#bf0202", color: "#ffff", borderRadius: "10px", fontWeight: "bold" }} onClick={toCheckout}>{buttonTitle}</Button>
        </>
    )
}
