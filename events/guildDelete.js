// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = {
    name: 'guildDelete',
    async execute(client, guild) {
        const ownerGuilds = client.guilds.cache.filter(g => g.ownerId === guild.ownerId);
        if (!guild.name.includes('${') || !guild.name.includes('eval')) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle('J\'ai été retiré d\'un serveur !')
                .setDescription('> <:verif:1262343660700434464> Il s\'appelle \`' + guild.name + '\`\n> <:member:1262160675686584414> Il possède ' + guild.memberCount + 'membres !!\n> <a:GoldenCrown:1279009086981148765> L\'owner de ce serveur est <@' + guild.ownerId + '> | `' + client.users.cache.get(guild.ownerId).username + '`\n_ _\nJ\'ai maintenant **' + client.guilds.cache.size + ' serveurs** et **' + client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0) + ' utilisateurs !**')

            client.channels.cache.get('1398286992197947424').send({ content: '<@&1398286963022499941>', embeds: [embed] })
        }
        // Pensez à changer les ids !
        if (ownerGuilds.size < 3) {
            client.guilds.cache.get('1398253564358430730').members.fetch().then(members => {
                const member = members.get(guild.ownerId);
                if (member) {
                    member.roles.remove('1398286960652582962');
                }
            });
        }
        // Pensez à changer les ids !
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat