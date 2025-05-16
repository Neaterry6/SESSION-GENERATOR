
const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
	default: UltraTitanMD,
	useMultiFileAuthState,
	jidNormalizedUser,
	Browsers,
	delay,
	makeInMemoryStore,
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
	if (!fs.existsSync(FilePath)) return false;
	fs.rmSync(FilePath, {
		recursive: true,
		force: true
	});
}

router.get('/', async (req, res) => {
	const id = makeid();
	async function UltraTitan_MD_QR_CODE() {
		const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
		try {
			let Qr_Code_By_UltraTitan = UltraTitanMD({
				auth: state,
				printQRInTerminal: false,
				logger: pino({ level: "silent" }),
				browser: Browsers.macOS("Desktop"),
			});

			Qr_Code_By_UltraTitan.ev.on('creds.update', saveCreds);
			Qr_Code_By_UltraTitan.ev.on("connection.update", async (s) => {
				const { connection, lastDisconnect, qr } = s;
				if (qr) await res.end(await QRCode.toBuffer(qr));

				if (connection == "open") {
					await delay(5000);
					let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
					await delay(800);
					let b64data = Buffer.from(data).toString('base64');
					let session = await Qr_Code_By_UltraTitan.sendMessage(Qr_Code_By_UltraTitan.user.id, { text: '' + b64data });

					let ULTRA_TITAN_MD_TEXT = `
*_Session Connected By Ultra Titan MD Bot_*
*_Made With ❤️_*
______________________________________
╔════◇
║ *『WELCOME TO ULTRA TITAN MD BOT』*
║ _You've successfully set up your WhatsApp bot._
╚════════════════════════╝
╔═════◇
║  『••• CONNECT WITH ME •••』
║❒ *GitHub:* _https://github.com/Team-TitanSquad/ULTRA_TITAN-MD_
║❒ *LinkedIn:* _https://www.linkedin.com/in/akewushola-abdulbakri-659458365_
║❒ *Facebook:* _https://www.facebook.com/profile.php?id=61575627958849_
║❒ *Telegram:* _https://t.me/Heartbreak798453_
║❒ *WhatsApp:* _https://wa.me/2348039896597_
║❒ *Writer's Channel:* _https://whatsapp.com/channel/0029Vb63QCJ9Gv7Q5ec5rt3e_
╚════════════════════════╝
_____________________________________

⭐ _Don't forget to star my GitHub repo!_
`;
					await Qr_Code_By_UltraTitan.sendMessage(Qr_Code_By_UltraTitan.user.id, { text: ULTRA_TITAN_MD_TEXT }, { quoted: session });

					await delay(100);
					await Qr_Code_By_UltraTitan.ws.close();
					return await removeFile("temp/" + id);
				} else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
					await delay(10000);
					UltraTitan_MD_QR_CODE();
				}
			});
		} catch (err) {
			if (!res.headersSent) {
				await res.json({
					code: "Service is Currently Unavailable"
				});
			}
			console.log(err);
			await removeFile("temp/" + id);
		}
	}
	return await UltraTitan_MD_QR_CODE();
});

module.exports = router;