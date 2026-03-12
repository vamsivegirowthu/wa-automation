const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const pino = require("pino")
const qrcode = require("qrcode-terminal")
const cron = require("node-cron")

async function startBot(){

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
console.log("✅ WhatsApp connected")

// 5:30 PM scheduler
cron.schedule("30 17 * * *", async () => {

console.log("⏰ Sending messages at 5:30 PM")

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

})

}

})

}

// keep bot alive
setInterval(() => {}, 1000)

startBot()
