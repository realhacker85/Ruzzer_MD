module.exports = {
    name: "ping",
    execute: async (conn, msg) => {
        const from = msg.key.remoteJid;
        await conn.sendMessage(from, { text: "Pong ⚡" });
    }
};
