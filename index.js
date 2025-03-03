// index.js

/**
 * Pay attention to the following variables
 * {{your-frontend-application-url}} : The URL to access your view application
 * {{your-mid}} : Your Merchant ID
 * {{your-password}} : Your North Password in the Integration Keys
 * {{your-developerKey}} : Your Developers keys
 * {{your-x-nabwss-appsource}} :  Your x-nabwss-appsource key
 * {{your_gateway_public_key}} :  Your gateway public key
 */

const express = require('express')
var axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express()
const PORT = 4000

app.use(cors({ origin: ["{{your-frontend-application-url}}"], credentials: true }))
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
})


app.post('/send', (req, res) => {

    console.log("start")
    var data = JSON.stringify({
        "mid": "{{your-mid}}",
        "developerKey": "{{your-developerKey}}",
        "password": "{{your-password}}"
    });

    var config = {
        method: 'POST',
        url: 'https://proxy.payanywhere.com/auth',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-nabwss-appsource': '{{your-x-nabwss-appsource}}'
        },
        data: data
    };

    axios(config)
        .then(function (response) {

            var data = JSON.stringify({
                "token": req.body.token,
                "amount": req.body.amount,
                "gateway_public_key": "{{your_gateway_public_key}}",
                "transaction_source": "PA-JS-SDK"
            });

            var config = {
                method: 'POST',
                url: 'https://proxy.payanywhere.com/mids/{{your-mid}}/gateways/payment',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + response.data.token,
                    'x-nabwss-appsource': '{{your-x-nabwss-appsource}}',
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    res.send({ status: "payment successful" });
                })
                .catch(function (error) {
                    res.send({ status: error });
                });

        })
        .catch(function (error) {
            res.send(error);
        });


})

// Export the Express API
module.exports = app