const Logger = require('power-logs');
const logger = new Logger();

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

module.exports = {
    name: "error",
    description: "Recupere le motif du crash (commande OWNER BOT only)",
    aliases: ["error", "erreur"],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    async execute(client, message, args) {
        message.reply(`\`${logger.getWarn(args[0] ?? 5)}\``)
        message.reply(`\`${logger.getError(args[0] ?? 5)}\``)
        message.reply(`\`${logger.getFatal(args[0] ?? 5)}\``)
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat