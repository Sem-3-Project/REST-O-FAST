import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import PaymentForm from './PaymentForm';
import Review from './Review';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar'
import Axios from 'axios'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        REST-O-FAST inc.
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  main: {
    marginBottom: theme.spacing(4),
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Payment details', 'Review your order'];

function getStepContent(step, details) {
  switch (step) {
    case 0:
      return <PaymentForm />;
    case 1:
      return <Review data={details} />;
    default:
      throw new Error('Unknown step');
  }
}



export default function Checkout() {

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [buttonTitle, setButtonTitle] = React.useState('PLACE ORDER')
  const [progressState, setProgressState] = React.useState(false)
  const [count, setCount] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [personDetails, setPersonDetails] = React.useState([])

  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  React.useEffect(() => {
    localStorage.removeItem('cardname')
    localStorage.removeItem('cardNumber')
    localStorage.removeItem('cvv')
    localStorage.removeItem('expiry')

  }, [])

  const submit = () => {

    const name = localStorage.getItem('cardname')
    const cardNumber = localStorage.getItem('cardNumber')
    const expiry = localStorage.getItem('expiry')
    const cvv = localStorage.getItem('cvv')

    if (name && cardNumber && expiry && cvv) {
      if (Number.isInteger(parseInt(cardNumber))) {
        if (cardNumber.length > 16 || cardNumber.length < 16) {
          setOpenSnackbar(true)
          setSnackbarMessage("CARD NUMBER MUST BE EXACTLY 16 DIGITS LONG!")
        }
        else {
          if (Number.isInteger(parseInt(cvv))) {
            if (cvv.length > 3 || cvv.length < 3) {
              setOpenSnackbar(true)
              setSnackbarMessage("CVV MUST BE EXACTLY 3 DIGITS LONG!")
            }
            else {
              Axios.post('http://localhost:3001/api/checkCardCreds', {
                name: name,
                cno: cardNumber,
                cvv: cvv,
                expiry: expiry
              }).then(res => {
                if (res.data.success) {
                  setOpenSnackbar(true)
                  setSnackbarMessage("ACCESS GRANTED!")
                  setTimeout(() => {
                    setPersonDetails(res.data.data)
                    handleNext()
                  }, 2000);
                } else {
                  setOpenSnackbar(true)
                  setSnackbarMessage("CARD DETAILS ENTERED ARE NOT CORRECT!")
                }
              })
            }
          }
          else {
            setOpenSnackbar(true)
            setSnackbarMessage("CVV MUST CONTAIN ONLY DIGIT VALUES")
          }
        }
      }
      else {
        setOpenSnackbar(true)
        setSnackbarMessage("CARD NUMBER MUST CONTAIN ONLY DIGIT VALUES")
      }
    }
    else {
      setOpenSnackbar(true)
      setSnackbarMessage("All fields are compulsory!")
    }

    //Axios.post('http://localhost:3000/api/checkCardDetails')
  }

  const closeSnackbarhandle = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false);
  }

  const placeOrder = () => {

    if (buttonTitle === "PLACE ORDER") {
      handleClickOpen()
    }
    if (buttonTitle === "CANCEL") {
      setProgressState(false);
      setButtonTitle("PLACE ORDER")
    }
    //setButtonTitle(prevTitle => prevTitle === "PLACE ORDER" ? "CANCEL" : "PLACE ORDER")
  }

  const insertClearUserGenerateBill = () => {
    Axios.post('http://localhost:3001/api/insertOrderDetails', {
      no: localStorage.getItem("TableId"),
      order: JSON.parse(localStorage.getItem("cart"))
    }).then(res => {
      console.log("Inserted!")
      Axios.post('http://localhost:3001/api/clearUserDetails', {
        tid: localStorage.getItem("TableId"),
      }).then(res => {
        console.log("Cleared the user!")
        Axios.post('http://localhost:3001/api/generateBill', {
          to: localStorage.getItem('emailID'),
          orders: JSON.parse(localStorage.getItem('cart')),
          name: localStorage.getItem('Name')
        }).then(res => {
          console.log("Generate bill complete!")
          let table = localStorage.getItem("TableId")
          localStorage.clear()
          window.location.href = `/home/${table}`
        })
      })
    })
  }

  React.useEffect(() => {
    let timeout;
    let timer;

    if (progressState) {

      timeout = setTimeout(() => {
        setProgressState(false);
        // console.log("Placed")
        clearTimeout(timeout);
        setOpenSnackbar(true)
        setSnackbarMessage("Your order is placed!\nYou will now automatically logged out of the system. And a mail containing all the order details is being sent to you!")
        setTimeout(() => {
          insertClearUserGenerateBill()
        }, 3000);
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


  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setProgressState(false)
    setActiveStep(activeStep - 1);
    setButtonTitle("PLACE ORDER")
  };

  const proceed = () => {
    setProgressState(true);
    setButtonTitle("CANCEL");
    setOpen(false);
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
        onClose={closeSnackbarhandle}
        message={snackbarMessage}
      />
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
      <React.Fragment>
        <CssBaseline />
        <AppBar
          position="absolute"
          color="default"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              REST-O-FAST
          </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" className={classes.main} maxWidth="sm">
          <Paper className={classes.paper} variant="outlined">
            <Typography component="h1" variant="h4" align="center">
              Checkout
          </Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                </Typography>
                  <Typography variant="subtitle1">
                    Your order number is #2001539. We have emailed your order
                    confirmation, and it will arrive at your table within 10 mins.
                    Thank you,
                    REST-O-FAST.
                    EAT, SHARE, CELEBRATE.
                </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {getStepContent(activeStep, personDetails)}
                  <div className={classes.buttons}>
                    {progressState &&
                      <>
                        <CircularProgress color="secondary" style={{ marginTop: "20px", marginRight: "30px" }} />
                        <div style={{ fontFamily: "Consolas", fontSize: "20px", marginTop: "27px", marginRight: "30px" }}>
                          {count}
                        </div>
                      </>
                    }
                    {activeStep !== 0 && (
                      <Button onClick={handleBack} className={classes.button}>
                        Back
                      </Button>
                    )}
                    {activeStep === steps.length - 1 &&
                      < Button
                        variant="contained"
                        onClick={placeOrder}
                        className={classes.button}
                      >
                        {buttonTitle}
                      </Button>
                    }
                    {!(activeStep === steps.length - 1) &&
                      < Button
                        variant="contained"
                        onClick={submit}
                        className={classes.button}
                      >
                        NEXT
                    </Button>
                    }

                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          </Paper>
          <Copyright />
        </Container>
      </React.Fragment >
    </>
  );
}
