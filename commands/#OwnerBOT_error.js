const Logger = require('power-logs');
const logger = new Logger();

module.exports = {
    name: "error",
    description: "Recupere le motif du crash (commande OWNER BOT only)",
    aliases: ["error", "erreur"],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    async execute(client, message, args) {
        message.reply(`\`${logger.getWarn(5)}\``)
        message.reply(`\`${logger.getError(5)}\``)
        message.reply(`\`${logger.getFatal(5)}\``)

    }
}
