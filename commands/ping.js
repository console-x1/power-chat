const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ping",
    description: "🤖 Afficher le ping du bot.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.UseApplicationCommands],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    async execute(client, message, args) {
        message.reply(`<a:loading:1134743039345168477> **Mon ping est de : ${client.ws.ping} ms.** <a:loading:1134743039345168477>`)
    },
    async executeSlash(client, interaction) {
        interaction.reply(`<a:loading:1134743039345168477> **Mon ping est de : ${client.ws.ping} ms.** <a:loading:1134743039345168477>`)
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}