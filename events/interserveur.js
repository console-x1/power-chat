const { EmbedBuilder, WebhookClient } = require('discord.js');
const db = require('../database.js');

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

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
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
                        .addFields({ name: 'Utilisateur :', value: '<@' + message.author.id + '>' })
                        .setFooter({ text: `Made by .power.x with ❤️`, iconURL: client.user.displayAvatarURL() })
                        .setTimestamp();

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

                    for (const row of rows) {
                        try {
                            const guild = client.guilds.cache.get(row.guildId);
                            if (!guild) continue;

                            const channel = guild.channels.cache.get(row.channelId);
                            if (!channel) {
                                console.log(`Le salon ${row.channelId} n'existe pas dans le serveur ${row.guildId}.`);
                                db.run('DELETE FROM channel WHERE guildId = ? AND channelId = ?', [row.guildId, row.channelId]);
                                continue;
                            }

                            let hook;
                            try {
                                if (row.webhook) {
                                    hook = new WebhookClient({ url: row.webhook });
                                    await hook.fetch();
                                }
                            } catch {
                                const newWebhook = await channel.createWebhook({
                                    name: "Webhook Interserveur",
                                    reason: "Création de webhook pour l'interserveur",
                                    avatar: "https://cdn.discordapp.com/avatars/1066067393123733595/61a6bf871cb8ad6478a8402ceacc96f0.webp"
                                });
                                db.run(`UPDATE channel SET webhook = ? WHERE guildId = ? AND channelId = ?`, [newWebhook.url, row.guildId, row.channelId]);
                                hook = new WebhookClient({ url: newWebhook.url });
                            }
                            await hook.edit({
                                name: message.author.tag,
                                avatar: message.author.displayAvatarURL({ dynamic: true, size: 4096 })
                            })

                            if (refMessage && refMessage.embeds?.[0]?.url && guild.id == refMessage.embeds[0].url.match(/\d+/g)[0]) {
                                await hook.send({ content: refMessage.embeds[0].fields[0].value, embeds: [embed] });
                            } else {
                                await hook.send({ embeds: [embed] });
                            }

                        } catch (err) { return }
                    }
                });
            });
        });
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat