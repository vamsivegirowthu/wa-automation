const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const pino = require("pino")
const qrcode = require("qrcode-terminal")
const cron = require("node-cron")

let sock

async function startBot(){

const { state, saveCreds } = await useMultiFileAuthState("auth_info")

sock = makeWASocket({
auth: state,
logger: pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => {

const { connection, qr } = update

if(qr){
qrcode.generate(qr, { small: true })
}

if(connection === "open"){
console.log("✅ WhatsApp connected")
}

})
}

startBot()

// scheduler
cron.schedule("40 22 * * *", async () => {

console.log("⏰ Sending messages")

const numbers = [
"+918501830360",
"+917508612345"
]

for (let num of numbers){

const cleanNumber = num.replace("+","")

await sock.sendMessage(cleanNumber + "@s.whatsapp.net", {
text: "Hello 👋 Bulk message"
})

console.log("Message sent:", num)

await new Promise(r => setTimeout(r,5000))

}

})
