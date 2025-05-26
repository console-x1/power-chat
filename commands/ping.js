// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ping",
    description: "🤖 Afficher le ping du bot.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.UseApplicationCommands],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    async execute(client, message, args) {
        message.reply(`<a:carregando2:1221820650746806312> **Mon ping est de : ${client.ws.ping} ms.**`)
    },
    async executeSlash(client, interaction) {
        interaction.reply(`<a:carregando2:1221820650746806312> **Mon ping est de : ${client.ws.ping} ms.**`)
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat