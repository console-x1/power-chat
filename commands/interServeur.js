const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const db = require('../database.js');

module.exports = {
    name: "setup-interserveur",
    description: "Configurer le salon de l'interServeur.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.Administrator],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    async execute(client, message, args) {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel) return message.reply("Veuillez mentionner un salon valide ou fournir son ID.");
        if (channel.type !== 0) return message.reply("Veuillez sélectionner un salon textuel valide.");

        channel.createInvite({
            maxAge: 0,
            maxUses: 0
        }).then(invite => {
            channel.createWebhook({
                name: "interserver",
                avatar: "https://cdn.discordapp.com/attachments/1375593104576479383/1376273727225856021/avatar.png?ex=6834ba4a&is=683368ca&hm=13257aaf35d7ba11947a41c74308bbbb014d2c35d320b449b1dfeb9005e68909&"
            }).then(webhook => {
                db.run(`INSERT INTO channel (guildId, channelId, invite, webhook) VALUES (?, ?, ?, ?)`, [message.guild.id, channel.id, invite.url, webhook.url])
                Succes(client, db, message.guild, invite.url)
            })
        })

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle("Configuration de l'interServeur")
            .setDescription(`Le salon d'interServeur a été configuré avec succès dans ${channel}.`);
        await message.reply({ embeds: [embed] });

    },
    async executeSlash(client, interaction) {
        const channel = interaction.options.getChannel('channel');
        if (channel.type !== 0) return interaction.reply("Veuillez sélectionner un salon textuel valide.");

        channel.createInvite({
            maxAge: 0,
            maxUses: 0
        })
            .then(invite => {
                channel.createWebhook({
                    name: "interserver",
                    avatar: "https://cdn.discordapp.com/attachments/1375593104576479383/1376273727225856021/avatar.png?ex=6834ba4a&is=683368ca&hm=13257aaf35d7ba11947a41c74308bbbb014d2c35d320b449b1dfeb9005e68909&"
                }).then(webhook => {
                    db.run(`INSERT INTO channel (guildId, channelId, invite, webhook) VALUES (?, ?, ?, ?)`, [message.guild.id, channel.id, invite.url, webhook.url])
                    Succes(client, db, interaction.guild, invite.url)
                })
            })

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle("Configuration de l'interServeur")
            .setDescription(`Le salon d'interServeur a été configuré avec succès dans ${channel}.`);
        await interaction.reply({ embeds: [embed] });

    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Dans quel salon voulez-vous que les messages interserveur soient envoyés ?')
                    .setRequired(true)
            )
    }
}

async function Succes(client, db, guild, invite) {
    db.all('SELECT * FROM channel', async (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`Bienvenue au serveur ${guild.name} !`)
            .setURL(invite)

        rows.forEach(row => {
            const guild = client.guilds.cache.get(row.guildId);
            if (guild) {
                const channel = guild.channels.cache.get(row.channelId);
                if (channel) {
                    channel.send({ embeds: [embed] });
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
}