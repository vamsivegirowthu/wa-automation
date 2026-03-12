const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const pino = require("pino")
const fs = require("fs")
const qrcode = require("qrcode-terminal")

async function startImageSender(){

const { state, saveCreds } = await useMultiFileAuthState("auth_info")

const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update) => {

const { connection, qr } = update

if(qr){
console.log("Scan QR")
qrcode.generate(qr, { small: true })
}

if(connection === "open"){

console.log("✅ WhatsApp Connected")

const numbers = [
"918501830360"
]

const images = [
"./images/reminder1.png",
"./images/reminder2.png",
"./images/reminder3.png"
]

for (let num of numbers){

for (let img of images){

await sock.sendMessage(num + "@s.whatsapp.net", {
image: fs.readFileSync(img),
caption: "Reminder message"
})

console.log("Image sent:", img)

await new Promise(r => setTimeout(r, 5000))

}

}

console.log("✅ All images sent")

}

})

}

startImageSender()