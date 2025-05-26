const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

module.exports = {
    name: "bot-info",
    description: "🤖 Affiche le ping du bot interserveur, le lien de son serveur et le lien pour l'inviter.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.UseApplicationCommands],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    async execute(client, message, args) {
        message.reply(`## info general :\n🏓 **Mon ping est de :** ${client.ws.ping} **ms.**\n**Ce projet date de 2023 mais cette version date de 2025 !**\n\n> Je vous invite a faire un tour sur le github de mon créateur, un petit follow fait toujours plaisir !\n\n## stats :\n${client.guilds.cache.size} serveurs\n ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateur`).catch(() => {});
    },
    async executeSlash(client, interaction) {
        interaction.reply(`## info general :\n🏓 **Mon ping est de :** ${client.ws.ping} **ms.**\n**Ce projet date de 2023 mais cette version date de 2025 !**\n\n> Je vous invite a faire un tour sur le github de mon créateur, un petit follow fait toujours plaisir !\n\n## stats :\n${client.guilds.cache.size} serveurs\n ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateur`).catch(() => {});
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat