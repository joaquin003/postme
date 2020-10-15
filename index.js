//Empezando a trabajar con node.js, express, bodyParser y web-push
const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const publicVapidKey = 'BD88qOfboklZ1bnEcnQ3OgJQZSLPV1G5WrgP_gN6aYRHwX0nTep9WHwhkrIp3Bz2sSgtZGttZPDRWIit6_TSwDQ';
const privateVapidKey = 'G2J7JYJ1Oa6k9hQm5gltat5oPA47tuQ3ymN2oBxRxCk';

webPush.setVapidDetails('mailto:joaquinuliambre.ju@gmail.com', publicVapidKey, privateVapidKey);

app.get('/', (req, res) => {
    res.send('Funcionando corectamente...');
});

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
  
    res.status(201).json({});
  
    const payload = JSON.stringify({
      title: 'Notificaciones desde tu backend',
      body: 'Este es el cuerpo de la notificacion pero desde un backend'
    });
  
    webPush.sendNotification(subscription, payload)
      .catch(error => console.error(error));
});

app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en ${server.address().port}`);
});