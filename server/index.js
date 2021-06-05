const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const fs = require('fs')
var easyinvoice = require('easyinvoice');
const PORT = 3001;

const setData = async (invoiceid, date, name, products) => {

    var product = []

    products.map((val) => {
        row = {
            "quantity": val.count,
            "description": val.name,
            "tax": 5,
            "price": val.price
        }
        product.push(row)
    })

    var data = {
        //"documentTitle": "CASH INVOICE", //Defaults to INVOICE
        "currency": "INR",
        "taxNotation": "GST", //or gst
        "marginTop": 25,
        "marginRight": 25,
        "marginLeft": 25,
        "marginBottom": 25,
        "logo": "", //or base64
        //"logoExtension": "png", //only when logo is base64
        "sender": {
            "company": "REST-O-FAST inc.",
            "address": "Pune",
            "zip": "411038",
            "city": "Pune",
            "state": "Maharashtra",
            "country": "INDIA"
            //"custom1": "custom value 1",
            //"custom2": "custom value 2",
            //"custom3": "custom value 3"
        },
        "client": {
            "company": name,
            "address": "",
            "zip": "",
            "city": "",
            "state": "",
            "country": ""
            //"custom1": "custom value 1",
            //"custom2": "custom value 2",
            //"custom3": "custom value 3"
        },
        "invoiceNumber": "RF-" + invoiceid,
        "invoiceDate": date,
        "products": product,
        "bottomNotice": "This is a system generated invoice and you have already paid the bill! Thank You, REST-O-FAST."
    };

    return data
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'food.restofast@gmail.com',
        pass: 'restofast007',
    }
});

app.use(express.json())
app.use(cors());

const otpMailSend = (to, text) => {
    let mailOptions = {
        from: 'food.restofast@gmail.com',
        to: to,
        subject: 'One Time Password REST-O-FAST inc.',
        text: text,
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Email sent : " + info.response);
        }
    })
}

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "1248",
    database: "rproject",
    dateStrings: 'date',
});


app.post('/api/sendOTP', (req, res) => {
    const email = req.body.email;
    // console.log(email)
    let otp = Math.floor(Math.random() * 90000) + 10000;
    let text = `Your one time password for REST-O-FAST inc. food services is : ${otp} \n Eat, Share, Celebrate. \n Thank You! \n REST-O-FAST.`;
    otpMailSend(email, text);
    res.json({ msg: `Email Sent!`, otp: otp })
})


app.post('/api/clearUserDetails', (req, res) => {
    const tid = req.body.tid;
    const userid = null;
    db.query("UPDATE tableuser SET user_id=? WHERE t_id=?;", [userid, tid], (err, result) => {
        if (err) {
            //console.log("In ClearUserDetails", err);
            res.json({ msg: "Failure in removing!" })
        }
        else {
            res.json({ msg: "Success in removing!" })
        }
    })
})

app.post('/api/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const tableNumber = req.body.tableNumber;
    var flag;

    await checkIfLoggedInAlready(tableNumber)
        .then(res => flag = res)
        .catch(rej => console.log(rej));

    if (flag === 1) {
        res.json({ login: false, msg: "There is already a user logged in from this table. 1 Table 1 Login!!" })
    }
    else {
        db.query("SELECT username FROM user where username=?;", username, (err, result) => {
            if (err) {
                res.json({ login: false, err: err, msg: "Error" });
            }
            else {
                if (result.length > 0) {
                    db.query("SELECT id,username, name, password,email FROM user where username = ? and password = ?;", [username, password], (err1, result1) => {
                        if (err1) {
                            res.json({ login: false, err: err1, msg: "Error" });
                        }
                        else {
                            if (result1.length > 0) {
                                insertTableUser(tableNumber, result1[0].id)
                                let message = "Welcome " + result1[0].name;
                                res.json({ login: true, msg: message, uname: result1[0].name, id: result1[0].id, tid: tableNumber, email: result1[0].email });
                            }
                            else {
                                res.json({ login: false, msg: "Wrong Username-Password combination" });
                            }
                        }
                    })
                }
                else {
                    res.json({ login: false, msg: "User Doesnt Exist Kindly SIGNUP!" });
                }
            }
        })
    }
})

const checkIfLoggedInAlready = async (tableNumber) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT user_id from tableuser where t_id=?;', tableNumber, (err, res) => {
            if (err) {
                return reject(err)
            }
            else {
                if (res[0].user_id === null) {
                    return resolve(0)
                }
                else {
                    return resolve(1)
                }
            }
        })
    })

}

app.post('/api/checkIfLoggedIn', (req, res) => {
    const tableid = req.body.tableId;
    db.query('SELECT user_id from tableuser where t_id=?', tableid, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            const r = result[0].user_id === null ? 0 : 1;
            res.json({ res: r })
        }
    })
})

const insertTableUser = (table, user) => {
    // console.log(table)
    db.query('UPDATE tableuser SET user_id=? WHERE t_id=?;', [user, table], (err, res) => {
        if (err) {
            console.log(err)
        }
        else {
        }
    })
}


app.post('/api/doesUserExist', (req, res) => {
    const username = req.body.username;


    db.query("SELECT username FROM user WHERE username=?", username, (err, result) => {
        if (err) {
            res.json({ msg: err })
        }
        if (result.length > 0) {
            res.json({ login: false, msg: "Username already exists. Please enter a differant username" })
        }
        else {
            res.json({ login: true, msg: "Proceed!" })
        }

    })
})


app.post('/api/register', (req, res) => {
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    db.query("INSERT INTO user(name,username,password,email) values(?,?,?,?);", [name, username, password, email], (err1, result1) => {
        if (err1) {
            res.json({ msg: err })
        }
        else {
            res.json({ login: true, msg: "Successfully Registered! Now LOGIN with the same credentials!" })
        }
    })
})


app.get('/api/getCategoryNames', (req, res) => {
    db.query("SELECT * FROM category", (err, result) => {
        if (err) {
            res.json({ err: err })
        }
        else {
            res.json({ data: result })
        }
    })
})


app.post('/api/getProductDetails', async (req, res) => {
    const id = req.body.id;
    db.query("SELECT * FROM item WHERE category_id = ?", id, (err, result) => {
        if (err) {
            res.json({ err: err })
        }
        else {
            res.json({ data: result })
        }
    })
})

app.get('/api/getAllProducts', async (req, res) => {
    db.query("SELECT * FROM item", (err, result) => {
        if (err) {
            res.json({ err: err })
        }
        else {
            res.json({ data: result })
        }
    })
})

const insert = async (orderId, itemId, itemQty, tableId, viewed, note) => {

    return new Promise((resolve, reject) => {
        db.query("INSERT INTO ordertable VALUES(?,?,?,?,?,?);", [orderId, itemId, itemQty, tableId, viewed, note], (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve("Inserted!");
            }
        })
    })

}

app.post('/api/insertOrderDetails', async (req, res) => {
    const tableid = req.body.no;
    const orders = req.body.order;
    const viewed = 'NO';
    let orderId;
    await getNewOrderId()
        .then(res => {
            let PrevOid = res[0].oid;
            orderId = PrevOid
            let NewOid = PrevOid + 1;
            updateOrderId(PrevOid, NewOid)
                .then(res => console.log(res))
                .catch(rej => console.log(rej))
        });
    // res.json({ orderId: orderId })
    for (let i = 0; i < orders.length; i++) {
        await insert(orderId, orders[i]._id, orders[i].count, tableid, viewed, orders[i].special_note);
    }
    res.json({ success: true })
})


const getDate = async () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    return today
}

const getInvoiceId = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id from invoice;', (err, res) => {
            if (err) {
                reject(err)
            }
            else {
                return resolve(res)
            }
        })
    })
}

const updateInvoiceId = async (PrevIid, NewIid) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE invoice SET id=? WHERE id=?;', [NewIid, PrevIid], (err, res) => {
            if (err) {
                reject(err)
            }
            else {
                resolve("DONE")
            }
        })
    })
}

app.post('/api/generateBill', async (req, res) => {
    const to = req.body.to;
    const date = await getDate()
    var invoiceId;
    await getInvoiceId().then(res => {
        let PrevIid = res[0].id;
        invoiceId = PrevIid
        let NewIid = PrevIid + 1;
        updateInvoiceId(PrevIid, NewIid)
            .then(res => console.log(res))
            .catch(rej => console.log(rej))
    })
    const orders = req.body.orders;
    const loggedInUserName = req.body.name;
    const data = await setData(invoiceId, date, loggedInUserName, orders)
    const invoiceName = './invoice/' + invoiceId + '.pdf';
    const text = "PFA an invoice of the food which is on its way to you!\nThank you\nREST-O-FAST\nEAT,SHARE,CELEBRATE"
    easyinvoice.createInvoice(data, async function (result) {
        fs.writeFileSync(invoiceName, result.pdf, 'base64');
        await sendMailInvoice(to, text, invoiceName)
        res.json({ success: true })
    });

})

const sendMailInvoice = async (to, text, path) => {
    let mailOptions = {
        from: 'food.restofast@gmail.com',
        to: to,
        subject: 'REST-O-FAST Food Invoice',
        text: text,
        attachments: [
            {
                path: path,
            }
        ]
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("INVOICE sent : " + info.response);
        }
    })
}

app.post('/api/checkCardCreds', (req, res) => {
    const cno = req.body.cno
    const name = req.body.name
    const expiry = req.body.expiry
    const cvv = req.body.cvv

    // console.log(cno)
    // console.log(name)
    // console.log(expiry)
    // console.log(cvv)

    db.query("SELECT * FROM card where number=? and name=? and expiry_date=? and cvv=?;", [parseInt(cno), name, expiry, parseInt(cvv)], (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if (result.length > 0) {
                res.json({ success: true, data: result })
            }
            else {
                res.json({ success: false })
            }
        }
    })


})


app.get('/api/getOrderNumbers', (req, res) => {
    db.query("SELECT oid,tableid,viewed FROM ordertable;", (err, result) => {
        if (err) {
            res.json({ msg: err })
        }
        else {
            res.json({ data: result, msg: "Success" })
        }
    })
})

app.post('/api/getOrderDetails', (req, res) => {
    const oid = req.body.oid;
    db.query("SELECT ordertable.itemid, name, ordertable.special_note, tableid, qty FROM item,ordertable WHERE ordertable.itemid = item._id and oid = ?;", oid, (err, result) => {
        if (err) {
            res.json({ msg: err })
        }
        else {
            //console.log(result[0])
            res.json({ data: result })
        }
    })
})

// app.post('/api/getCartForUser', (req, res) => {
//     const tid = 2//req.body.tid;
//     console.log(tid)
//     db.query("SELECT ordertable.itemid, price, name, qty FROM item,ordertable WHERE ordertable.itemid = item._id and tableid = ?;", tid, (err, result) => {
//         if (err) {
//             res.json({ msg: err })
//         }
//         else {
//             res.json({ data: result })
//         }
//     })
// })

const getNewOrderId = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT oid from orderid;', (err, res) => {
            if (err) {
                reject(err)
            }
            else {
                return resolve(res)
            }
        })
    })
}

const updateOrderId = async (PrevOid, NewOid) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE orderid SET oid=? WHERE oid=?;', [NewOid, PrevOid], (err, res) => {
            if (err) {
                reject(err)
            }
            else {
                resolve("DONE")
            }
        })
    })
}

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server started running and is listening to port ${PORT}`);
});
