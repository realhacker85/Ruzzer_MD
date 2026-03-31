module.exports = {
    name: "alive",
    execute: async (conn, msg, args, config) => {
        const from = msg.key.remoteJid;
        await conn.sendMessage(from, { text: `✅ ${config.BOT_NAME} is active\nOwner: ${config.OWNER_NAME}` });
    }
};
