import React, { useContext, useState } from 'react';
import { AccountContext } from "./accountContext";
import { BoldLink, BoxContainer, FormContainer, Input, MutedLink, SubmitButton } from './common';
import Axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { CloseIcon } from '../Sidebar/SidebarElements';

export function LoginForm() {

    const tableNumber = localStorage.getItem("tempTableId");

    const { switchtoSignup } = useContext(AccountContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const [open, setOpen] = useState(false)
    const [snackbarMessage, setSnackbar] = useState('');


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false);
    }

    const login = () => {
        if (username.length > 0 && password.length > 0) {
            Axios.post('http://localhost:3001/api/login', {
                username: username,
                password: password,
                tableNumber: tableNumber,
            }).then(res => {
                setOpen(true)
                setSnackbar(res.data.msg);
                setTimeout(() => {
                    if (res.data.login) {
                        localStorage.setItem('Name', res.data.uname);
                        localStorage.setItem('Id', res.data.id);
                        localStorage.setItem('TableId', res.data.tid);
                        localStorage.setItem('emailID', res.data.email)
                        localStorage.setItem('thisIsTheUser', 1)
                        console.log(localStorage.getItem('emailID'))
                        window.location.href = `/home/${localStorage.getItem("TableId")}`;
                    }
                }, 2000)

            })
        }
        else {
            setOpen(true)
            //alert("Username and Password Field cannot remain empty!")
            setSnackbar("Username and Password Field cannot remain empty!");
        }
    }

    return <BoxContainer>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            message={snackbarMessage}
            action={
                <React.Fragment>
                    <Button onClick={handleClose}></Button>
                    <IconButton>
                        <CloseIcon />
                    </IconButton>
                </React.Fragment>
            }

        />
        <FormContainer>
            <Input type="username" placeholder="Username" onChange={(e) => {
                setUsername(e.target.value);
            }} />
            <Input type="password" placeholder="Password" onChange={(e) => {
                setPassword(e.target.value);
            }} />
        </FormContainer>
        <MutedLink href="#">-------------------</MutedLink>
        <SubmitButton type="submit" onClick={login}>SignIn</SubmitButton>
        <MutedLink href="#">-------------------</MutedLink>
        <MutedLink>Don't have an account?
                <BoldLink href="#" onClick={switchtoSignup}>SignUp</BoldLink>
        </MutedLink>
    </BoxContainer >
}