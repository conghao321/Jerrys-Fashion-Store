const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});


//be careful! The token has changed! 
app.post('/payment', (req, res) => {
  const body = {
    source: 'tok_visa',
    amount: req.body.amount,
    currency: 'usd'
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
        console.log("stripe error");
        console.log(stripeErr);

      res.status(500).send({ error: stripeErr });
    } else {
        console.log(stripeRes);
        res.status(200).send({ success: stripeRes });
    }
  });
});

// Start the server, refer to google cloud platform documentation
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_quickstart]

module.exports = app;