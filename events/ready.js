const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActivityType, time } = require("discord.js");
const colors = require("colors");
const db = require('../database.js')

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`\n\n[READY]  ${client.user.tag} est prêt ||| ${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs\n\n`.green);
        setInterval(() => {
            let random = Math.floor(Math.random() * status.length);
            client.user.setActivity(status[random]);
        }, 15000);

        db.all('SELECT * FROM channel', (err, rows) => { 
            if (err) {
                console.error(err);
                return;
            }
            rows.forEach(row => {
                const guild = client.guilds.cache.get(row.guildId);
                if (guild) {
                    const channel = guild.channels.cache.get(row.channelId);
                    if (channel) {
                        channel.send({ embeds: [new EmbedBuilder().setColor('Blue').setDescription(`\`\`\`ansi\n\x1b[32m[READY] ${client.user.tag} est prêt : ${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs\x1b[39m\`\`\``)] });
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
        })

    }
}

let status = [
    {
        name: `Discute sur l'interserveur !`,
        type: ActivityType.Custom,
    },
    {
        name: 'Ajoute moi pour plus d\'activité',
        type: ActivityType.Custom,
    },
    {
        name: 'Code disponible sur GitHub',
        type: ActivityType.Streaming,
        url: 'https://github.com/console-x1/power-chat'
    }
]