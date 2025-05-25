const { EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (message.channel.isDMBased() || message.author.bot) return;

        db.get('SELECT * FROM user WHERE userId = ?', [message.author.id], (err, userRow) => {
            if (err) {
                console.error(err);
                return;
            }
            if (userRow) return;

            db.get('SELECT * FROM channel WHERE guildId = ? AND channelId = ?', [message.guild.id, message.channel.id], (err, channelRow) => {
                if (err) {
                    console.error(err);
                    return;
                }
                if (!channelRow) return;

                db.all('SELECT * FROM channel', async (err, rows) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    const embed = new EmbedBuilder()
                        .setColor(client.config.staff.includes(message.author.id) || client.config.owners.includes(message.author.id) ? "ff0000" : client.config.color)
                        .setTitle(`Message de ${message.author.tag} depuis ${message.guild.name}`)
                        .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
                        .setThumbnail(message.author.displayAvatarURL())
                        .addFields({ name: 'Utilisateur :', value: '<@' + message.author.id + '>' })

                    message.content ? embed.setDescription(message.content) : null;
                    message.attachments.size ? message.attachments.forEach(attachment => {
                        embed.addFields({ name: 'Pièce jointe', value: attachment.url });
                    }) : message.delete().catch(err => { });

                    let refMessage;
                    if (message.reference && message.reference.messageId) {
                        try {
                            refMessage = await message.channel.messages.fetch(message.reference.messageId);
                            if (refMessage && refMessage.embeds && refMessage.embeds[0] && refMessage.embeds[0].description) {
                                embed.addFields({ name: "En reponse à :", value: refMessage.embeds[0].description + '\n**De :** ' + refMessage.embeds[0].fields[0].value });
                            } else if (refMessage && refMessage.content) {
                                embed.addFields({ name: "En reponse à :", value: refMessage.content + '\n**De :** <@' + refMessage.author.id + '>' });
                            }
                        } catch (err) {
                            console.error("Erreur lors de la récupération du message référencé :", err);
                        }
                    }

                    rows.forEach(row => {
                        const guild = client.guilds.cache.get(row.guildId);
                        if (guild) {
                            const channel = guild.channels.cache.get(row.channelId);
                            if (channel) {
                                if (refMessage && refMessage.embeds && refMessage.embeds[0] && refMessage.embeds[0].url && guild.id == refMessage.embeds[0].url.match(/\d+/g)[0]) channel.send({ content: refMessage.embeds[0].fields[0].value, embeds: [embed] })
                                else channel.send({ embeds: [embed] });
                            } else {
                                console.log(`Le salon ${row.channelId} n'existe pas dans le serveur ${row.guildId}.`);
                                db.run('DELETE FROM channel WHERE guildId = ? AND channelId = ?', [row.guildId, row.channelId], (err) => {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log(`Le salon ${row.channelId} a été supprimé de la base de données car il n'existe plus dans le serveur ${guild.name}.`);
                                    }
                                });
                            }
                        }
                    });
                });
            });
        });
    }
}