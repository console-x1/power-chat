const { EmbedBuilder, WebhookClient } = require('discord.js');
const db = require('../database.js');

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (message.channel.isDMBased() || message.author.bot) return;
        if (message.content.includes('http') || message.content.includes('https') || message.content.includes('discord.') || message.content.includes('www.') || message.content.includes('://discord')) return;
        if (message.content.length > 2000) return;

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
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
                        .addFields({ name: 'Utilisateur :', value: '<@' + message.author.id + '>' })
                        .setFooter({ text: `Made by .power.x with ❤️`, iconURL: client.user.displayAvatarURL() })
                        .setTimestamp();

                    if (message.content) {
                        embed.setDescription(message.content);
                    }

                    if (message.attachments.size) {
                        message.attachments.forEach(attachment => {
                            embed.addFields({ name: 'Pièce jointe', value: attachment.url });
                        });
                    } else {
                        message.delete().catch(err => { });
                    }

                    let refMessage;
                    if (message.reference && message.reference.messageId) {
                        try {
                            refMessage = await message.channel.messages.fetch(message.reference.messageId);
                            if (refMessage?.embeds?.[0]?.description) {
                                embed.addFields({ name: "En reponse à :", value: refMessage.embeds[0].description + '\n**De :** ' + refMessage.embeds[0].fields[0].value });
                            } else if (refMessage?.content) {
                                embed.addFields({ name: "En reponse à :", value: refMessage.content + '\n**De :** <@' + refMessage.author.id + '>' });
                            }
                        } catch (err) {
                            console.error("Erreur lors de la récupération du message référencé :", err);
                        }
                    }

                    for (const row of rows) {
                        try {
                            const guild = client.guilds.cache.get(row.guildId);
                            if (!guild) return;

                            const channel = guild.channels.cache.get(row.channelId);
                            if (!channel) {
                                db.run('DELETE FROM channel WHERE guildId = ? AND channelId = ?', [row.guildId, row.channelId]);
                                return;
                            }

                            let hook;

                            const newWebhook = await channel.createWebhook({
                                name: message.author.tag,
                                reason: "Création de webhook pour l'interserveur",
                                avatar: message.author.displayAvatarURL({ dynamic: true, size: 4096 })
                            });
                            hook = new WebhookClient({ url: newWebhook.url });

                            if (refMessage?.embeds?.[0]?.url && guild.id == refMessage.embeds[0].url.match(/\d+/g)[0]) {
                                await hook.send({ content: refMessage.embeds[0].fields[0].value, embeds: [embed] });
                            } else {
                                await hook.send({ embeds: [embed] });
                            }

                            // Suppression du webhook après envoi
                            await hook.delete();

                        } catch (err) {
                            return;
                        }
                    }
                });
            });
        });
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat