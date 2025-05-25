const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "membre_uptime",
    description: "🤖 Afficher depuis combien de temps le bot est en ligne.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.UseApplicationCommands],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    async execute(client, message, args) {
        const uptime = client.uptime;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor((uptime / 3600000) % 24);
        const minutes = Math.floor((uptime / 60000) % 60);
        const seconds = Math.floor((uptime / 1000) % 60);
        const embedUptime = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle("Uptime")
            .setDescription(`<a:loading:1134743039345168477> Le bot est en ligne depuis :\n🤖 ${days} jour(s), ${hours} heure(s), ${minutes} minute(s) et ${seconds} seconde(s). 🤖\n<a:loading:1134743039345168477> Son ping est de ${client.ws.ping} ms.`);
        
        message.channel.send({ embeds: [embedUptime] })
    },
    async executeSlash(client, interaction, args) {
        const uptime = client.uptime;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor((uptime / 3600000) % 24);
        const minutes = Math.floor((uptime / 60000) % 60);
        const seconds = Math.floor((uptime / 1000) % 60);
        const embedUptime = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle("Uptime")
            .setDescription(`<a:loading:1134743039345168477> Le bot est en ligne depuis :\n🤖 ${days} jour(s), ${hours} heure(s), ${minutes} minute(s) et ${seconds} seconde(s). 🤖\n<a:loading:1134743039345168477> Son ping est de ${client.ws.ping} ms.`);
        
        interaction.channel.send({ embedUptime })
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}