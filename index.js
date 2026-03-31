const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs");
const config = require("./config");

const commands = new Map();

// Load commands
fs.readdirSync("./commands").forEach(file => {
    if(file.endsWith(".js")) {
        const cmd = require(`./commands/${file}`);
        commands.set(cmd.name, cmd);
    }
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const conn = makeWASocket({ logger: P({ level: "silent" }), auth: state });

    conn.ev.on("creds.update", saveCreds);

    conn.ev.on("connection.update", (update) => {
        const { connection } = update;
        if(connection === "open") console.log(`${config.BOT_NAME} Connected ✅`);
        if(connection === "close") {
            console.log("Connection closed. Reconnecting...");
            startBot();
        }
    });

    conn.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if(!msg?.message) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if(!text) return;

        const from = msg.key.remoteJid;
        if(!text.startsWith(config.PREFIX)) return;

        const args = text.slice(config.PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if(commands.has(command)) {
            try { await commands.get(command).execute(conn, msg, args, config); }
            catch(err) { console.error("Command error:", err); }
        }
    });

    // Auto-session cleaner every 24h
    setInterval(() => {
        if(fs.existsSync("session")) fs.rmSync("session", { recursive: true, force: true });
        console.log("Session cleared ✅");
    }, 24 * 60 * 60 * 1000);
}

// Crash protection
process.on('uncaughtException', err => { console.error("Uncaught Exception:", err); startBot(); });
process.on('unhandledRejection', err => { console.error("Unhandled Rejection:", err); startBot(); });

startBot();