module.exports = {
    name: "menu",
    execute: async (conn, msg, args, config) => {
        const from = msg.key.remoteJid;
        await conn.sendMessage(from, {
            text: `╔═══〔 ${config.BOT_NAME} 〕═══╗\n👑 Owner: ${config.OWNER_NAME}\n╚═════════════════╝`,
            footer: "Ruzzer MD",
            buttons: [{ buttonId: ".ping", buttonText: { displayText: "⚡ Ping" }, type: 1 }],
            headerType: 1,
            contextInfo: { externalAdReply: { title: "📢 Join Our Channel", body: "Click to join", mediaType: 1, sourceUrl: config.CHANNEL_LINK, renderLargerThumbnail: true } }
        });
    }
};
