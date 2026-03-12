const XLSX = require("xlsx")
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const pino = require("pino")

const workbook = XLSX.readFile("./numbers.xlsx")
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const data = XLSX.utils.sheet_to_json(sheet)

async function startExcelSender(){

const { state, saveCreds } = await useMultiFileAuthState("auth_info")

const sock = makeWASocket({
auth: state,
logger: pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async ({ connection }) => {

if(connection === "open"){

console.log("WhatsApp Connected")

for (let row of data){

let num = String(row.number).replace("+","")

await sock.sendMessage(num + "@s.whatsapp.net", {
text: "Hello from Excel automation 🚀"
})

console.log("Message sent:", num)

await new Promise(r => setTimeout(r, 5000))

}

console.log("Excel bulk sending finished")

}

})

}

startExcelSender()