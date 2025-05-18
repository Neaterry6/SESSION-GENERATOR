const express = require('express');
const app = express();
__path = process.cwd();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

let server = require('./ultratitanqr.js'),  // Updated file reference
    code = require('./pair');

require('events').EventEmitter.defaultMaxListeners = 500;

app.use('/ultratitanqr', server);
app.use('/code', code);
app.use('/pair', async (req, res, next) => {
    res.sendFile(__path + '/pair.html'); // Ensure this file exists in your project directory
});

app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/ultratitanpage.html'); // Updated for Ultra Titan branding
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`
⭐ Ultra Titan MD Bot is now live!

🚀 Server running on http://localhost:${PORT}
`);
});

module.exports = app;

/**
    🔥 Powered by Ultra Titan MD Bot Team  
    📢 Join our WhatsApp Channel for updates: https://whatsapp.com/channel/0029Vb63QCJ9Gv7Q5ec5rt3e  
**/
