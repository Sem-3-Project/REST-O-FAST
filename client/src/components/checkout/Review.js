import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Axios from 'axios';

const addresses = ['1 Material-UI Drive', 'Reactville', 'Anytown', '99999', 'USA'];



const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export default function Review(props) {
  const classes = useStyles();

  // const payments =
  let values = props.data[0]
  let cardNoLastFourDigits = values.number.toString().substr(-4)
  let yy = values.expiry_date.substr(-2)

  const payments = [
    {
      name: 'Card type',
      detail: 'Visa'
    },
    {
      name: 'Card holder',
      detail: values.name
    },
    {
      name: 'Card number',
      detail: 'xxxx-xxxx-xxxx-' + cardNoLastFourDigits
    },
    {
      name: 'Expiry date',
      detail: 'xx/20' + yy
    },
  ];
  //const payments = props.data[0]

  const [total, setTotal] = React.useState(0)
  const [products, setProducts] = React.useState([])
  const [cardDetails, setCardDetails] = React.useState([])

  let totalTemp = 0;

  React.useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem('cart')))
    JSON.parse(localStorage.getItem('cart')).map((val) => {
      totalTemp += (val.price * val.count)
    })
    setTotal(totalTemp)
  }, [])


  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <ol disablePadding>
        {products.map((product) => (
          <ListItem className={classes.listItem} key={product.name}>
            <ListItemText primary={product.name} secondary={`= ${product.count}PLATE(S)`} />
            <Typography variant="body2">{product.price}</Typography>
          </ListItem>
        ))}

        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            ₹{total}
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="GST 5% " />
          <Typography variant="subtitle1" className={classes.total}>
            ₹{total * 0.05}
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="GRAND TOTAL" />
          <Typography variant="subtitle1" className={classes.total}>
            ₹{total + (total * 0.05)}
          </Typography>
        </ListItem>
      </ol>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/* <Typography variant="h6" gutterBottom className={classes.title}>
            Shipping
          </Typography>
          <Typography gutterBottom>John Smith</Typography>
          <Typography gutterBottom>{addresses.join(', ')}</Typography> */}
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
