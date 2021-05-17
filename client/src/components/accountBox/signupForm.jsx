import React, { useContext, useState } from 'react';
import { BoldLink, BoxContainer, FormContainer, Input, MutedLink, SubmitButton } from './common';
import { AccountContext } from "./accountContext";
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import { CloseIcon } from '../Sidebar/SidebarElements';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import Axios from 'axios';

export function SignupForm(props) {

    const { switchtoSignin } = useContext(AccountContext);

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [email, setEmail] = useState('');
    const [emailIdForOTP, setEmailIDForOTP] = useState('')

    //let emailIdForOTP;

    const [sentOTP, setSentOTP] = useState(0)
    const [enteredOTP, setEnteredOTP] = useState(0)


    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [openDialog, setOpenDialog] = useState(false);

    const closeDialogHandle = () => {
        setOpenDialog(false)
    }

    const closeSnackbarhandle = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSnackbar(false);
    }


    const register = () => {
        Axios.post('http://localhost:3001/api/register', {
            name: name,
            username: username,
            password: password,
            email: email,
        }).then(response => {

            setOpenSnackbar(true)
            if (response.data.login) {
                setSnackbarMessage("Successfully Registered! REDIRECTING TO LOGIN PAGE! LOGIN with the same credentials to continue!")
                setTimeout(() => {
                    window.location.href = '/login';
                }, 4000)
            }
            else {
                setSnackbarMessage(response.data.msg);
            }

        })
    }


    const sendOTP = () => {
        Axios.post('http://localhost:3001/api/sendOTP', {
            email: emailIdForOTP,
        }).then(res => {
            let sentOTP = res.data.otp;
            setSentOTP(sentOTP)
        })
    }

    const resendOTP = () => {
        setOpenSnackbar(true);
        setSnackbarMessage("OTP has been resent to the above E-mail id")
        sendOTP()
    }

    const checkEnteredOTP = () => {
        console.log(enteredOTP)
        if (sentOTP === parseInt(enteredOTP)) {
            setOpenSnackbar(true);
            setSnackbarMessage("OTP VALIDATION SUCCESSFUL! Now Registering USER! Please Wait!");
            setTimeout(() => {
                register();
            }, 2000);
        }
        else {
            setOpenSnackbar(true);
            setSnackbarMessage("OTP Entered is wrong! Please enter the correct OTP or click on RESEND to resend the OTP!");
        }
    }

    const checkForUser = () => {
        Axios.post('http://localhost:3001/api/doesUserExist', {
            username: username,
        }).then(res => {
            if (res.data.login) {
                setOpenDialog(true)
                sendOTP()
            }
            else {
                setOpenSnackbar(true)
                setSnackbarMessage(res.data.msg)
            }
        })
    }

    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    const checkAndRequestOTP = async () => {
        if (name.length > 0 && username.length > 0 && password.length > 0 && cpassword.length > 0 && email.length > 0) {
            if (pattern.test(email)) {
                if (password.length >= 8) {
                    if (password === cpassword) {
                        //emailIdForOTP = email
                        checkForUser();
                        //sendOTP()
                    }
                    else {
                        setOpenSnackbar(true)
                        setSnackbarMessage("Passwords do not match!")
                    }
                }
                else {
                    setOpenSnackbar(true)
                    setSnackbarMessage("Password Should be atleast 8 characters long")
                }
            }
            else {
                setOpenSnackbar(true)
                setSnackbarMessage("Enter a valid email!")
            }
        }
        else {
            setOpenSnackbar(true)
            setSnackbarMessage("Not even a single field should remain empty!")
        }
    }

    return <BoxContainer>
        <Dialog
            open={openDialog}
            onClose={closeDialogHandle}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Email Authentication Required!"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    REST-O-FAST has sent you an OTP on the mentioned Email Address,
                    i.e., {emailIdForOTP}. Kindly Enter same OTP to proceed further!
                    Thank you,
                    REST-O-FAST!
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="OTP"
                    label="OTP"
                    type="text"
                    fullWidth
                    onChange={(e) => setEnteredOTP(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialogHandle} color="primary">
                    GO BACK
                    </Button>
                {/* onClick={() => sendOTP(reqOTP,)} */}
                <Button onClick={resendOTP} color="primary">
                    RESEND
                    </Button>
                <Button onClick={checkEnteredOTP} color="primary" autoFocus>
                    PROCEED
                    </Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={closeSnackbarhandle}
            message={snackbarMessage}
            action={
                <React.Fragment>
                    <IconButton>
                        <CloseIcon />
                    </IconButton>
                </React.Fragment>
            }

        />
        <FormContainer>
            <Input type="text" placeholder="Full Name" onChange={(e) => {
                setName(e.target.value)
            }} />
            <Input type="username" placeholder="Username" onChange={(e) => {
                setUsername(e.target.value)
            }} />
            <Input type="email" placeholder="Email ID" onChange={(e) => {
                setEmail(e.target.value)
                setEmailIDForOTP(e.target.value)
            }} />
            <Input type="password" placeholder="Password" onChange={(e) => {
                setPassword(e.target.value)
            }} />
            <Input type="password" placeholder="Confirm Password" onChange={(e) => {
                setCPassword(e.target.value)
            }} />
        </FormContainer>
        <MutedLink href="#">Forget Your Password</MutedLink>
        <SubmitButton type="submit" onClick={checkAndRequestOTP}>SignUp</SubmitButton>
        <MutedLink href="#">Already have an accont?
                <BoldLink href="#" onClick={switchtoSignin}>SignIn</BoldLink>
        </MutedLink>
    </BoxContainer>
}