// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

module.exports = {
    name: "stop",
    description: "Arrete le bot (commande OWNER BOT only)",
    aliases: ["kill", "exit", "die", "restart", "reboot"],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    async execute(client, message, args) {
        console.log(`[KILL] By ${message.author.username}#${message.author.discriminator}...`.red);
        message.reply("Killing bot...")
            .then(() => {
                process.exit();
            })
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat