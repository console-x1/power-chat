// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-cha

const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "prefix",
    description: "Afficher le prefix du bot.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.UseApplicationCommands],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    async execute(client, message, args) {
        message.reply(`Mon prefix est : **${client.config.prefix}**`).catch(() => {});
    },
    async executeSlash(client, interaction) {
        interaction.reply(`Mon prefix est : **${client.config.prefix}**`).catch(() => {});
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat