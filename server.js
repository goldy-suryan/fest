const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const stripe = require('stripe')('secret_key');
const port = 9876;
const path = require('path');
const cors = require('cors');


// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist/stripePayment/assets')))
app.use(cors());
// Routes
app.post('/payme', async (req, res) => {
    try {
        let charge = await stripe.charges.create({
            amount: 10000,
            currency: 'INR',
            source: req.body.token
        });
        res.status(200).json({ charge, status: true, msg: 'Payment done' });
    } catch (e) {
        console.log(e, '==============')
        res.status(500).json({ error: e })
    }
});

app.use('*', (req, res) => {
    res.sendFile('./dist/stripePayment/index.html', { root: __dirname });
})

// server
app.listen(process.env.PORT || port, () => console.log(`http://localhost:${port}`))