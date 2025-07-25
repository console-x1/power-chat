// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, ChannelType, Component } = require("discord.js")

module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
        const ownerGuilds = client.guilds.cache.filter(g => g.ownerId === guild.ownerId);

        if (!guild.name.includes('${') || !guild.name.includes('eval')) {
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle('J\'ai été ajouté a un serveur !')
                .setDescription('> <:verif:1262343660700434464> Il s\'appelle \`' + guild.name + '\`\n> <:member:1262160675686584414> Il possède ' + guild.memberCount + 'membres !!\n> <:boost:1262161795423015045> Le nombre de boost est ' + guild.premiumSubscriptionCount + '\n> <a:GoldenCrown:1279009086981148765> L\'owner de ce serveur est <@' + guild.ownerId + '> | `' + client.users.cache.get(guild.ownerId).username + '`\n_ _\nJ\'ai maintenant **' + client.guilds.cache.size + ' serveurs** et **' + client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0) + ' utilisateurs !**\n\n> :crown: L\'owner est également propriétaire de **' + ownerGuilds.size + '** serveur(s)')
                // Les emojis sont des emojis customisez, pensez à les changer ! 

            let channelInvite = null
            if (guild.systemChannel) channelInvite = guild.systemChannel
            else channelInvite = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText)

            const invite = await channelInvite.createInvite({
                maxAge: 0,
                maxUses: 0
            })

            const button = new ButtonBuilder()
                .setLabel('Rejoindre le serveur !')
                .setStyle(ButtonStyle.Link)
                .setURL(`${invite ?? 'https://discord.com/echec-de-la-creation-d-invitation'}`)
            const row = new ActionRowBuilder().addComponents(button);

            client.channels.cache.get('1398286992197947424').send({ content: '<@&1398286963022499941>', embeds: [embed], components: [row] })
            // Pensez à changer les ids !
        }

        if (ownerGuilds.size >= 5) {
            client.guilds.cache.get('1398253564358430730').members.fetch().then(members => {
                const member = members.get(guild.ownerId);
                if (member) {
                    member.roles.add('1398286960652582962');
                }
            });
        }
        // Pensez à changer les ids !
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat