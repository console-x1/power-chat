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
