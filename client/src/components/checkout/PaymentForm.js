import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default function PaymentForm() {


  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
            variant="standard"
            onChange={(e) => localStorage.setItem("cardname", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="standard"
            onChange={(e) => localStorage.setItem("cardNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            helperText="Add date without /"
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
            onChange={(e) => localStorage.setItem("expiry", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            type="password"
            autoComplete="cc-csc"
            variant="standard"
            onChange={(e) => localStorage.setItem("cvv", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          {/* <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          /> */}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
