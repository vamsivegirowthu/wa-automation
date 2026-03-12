const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const pino = require("pino")
const qrcode = require("qrcode-terminal")
const cron = require("node-cron")

let sock

async function startBot(){

const { state, saveCreds } = await useMultiFileAuthState("auth_info")
const { version } = await fetchLatestBaileysVersion()

sock = makeWASocket({
version,
auth: state,
logger: pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => {

const { connection, qr } = update

if(qr){
console.log("Scan QR")
qrcode.generate(qr, { small: true })
}

if(connection === "open"){
console.log("✅ WhatsApp connected")

startScheduler()
}

})

}

function startScheduler(){

console.log("🚀 Scheduler started")

cron.schedule("0 9 * * *", async () => {

if(!sock){
console.log("WhatsApp not ready")
return
}

console.log("⏰ Sending messages")

const numbers = [
"918501830360",
"917508612345"
]

for (let num of numbers){

await sock.sendMessage(num + "@s.whatsapp.net", {
text: "Hello 👋 Bulk message from Railway bot 🚀"
})

console.log("✅ Message sent:", num)

await new Promise(r => setTimeout(r,5000))

}

console.log("🎉 Bulk sending finished")

})

}

startBot()
