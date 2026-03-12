const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const pino = require("pino")
const qrcode = require("qrcode-terminal")

async function startBulkSender(){

const { state, saveCreds } = await useMultiFileAuthState("auth_info")

const sock = makeWASocket({
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

console.log("WhatsApp Connected")

const numbers = [
"+918501830360",
"+917508612345"
]

for (let num of numbers){

const cleanNumber = num.replace("+","")

await sock.sendMessage(cleanNumber + "@s.whatsapp.net", {
text: "Hello 👋 Bulk message"
})

console.log("Message sent to:", num)

await new Promise(r => setTimeout(r, 5000))

}

console.log("Bulk sending finished")

}

})

}

startBulkSender()