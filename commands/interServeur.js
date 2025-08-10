const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require("discord.js");
const db = require('../database.js');

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

module.exports = {
    name: "setup-interserveur",
    description: "Configurer le salon de l'interServeur.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.Administrator],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    async execute(client, message, args) {
        if (!channel.permissionsFor(message.guild.members.me).has([
            PermissionsBitField.Flags.CreateInstantInvite,
            PermissionsBitField.Flags.ManageWebhooks,
            PermissionsBitField.Flags.SendMessages
        ])) {
            return message.reply("❌ Je n'ai pas les permissions nécessaires dans ce salon.");
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel) return message.reply("❌ Veuillez mentionner un salon valide ou fournir son ID.");
        if (channel.type !== ChannelType.GuildText) return message.reply("❌ Veuillez sélectionner un salon textuel valide.");

        try {
            const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
            const webhook = await channel.createWebhook({
                name: "interserver",
                avatar: "https://cdn.discordapp.com/attachments/1375593104576479383/1376273727225856021/avatar.png"
            });

            db.run(`INSERT INTO channel (guildId, channelId, invite, webhook) VALUES (?, ?, ?, ?)`, [message.guild.id, channel.id, invite.url, webhook.url]);

            await sendWelcomeMessage(client, db, message.guild, invite.url);

            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setTitle("✅ Configuration de l'interServeur")
                .setDescription(`Le salon interServeur a été configuré avec succès dans ${channel}.`);

            await message.reply({ embeds: [embed] });

        } catch (err) {
            console.error("Erreur pendant la configuration :", err);
            return message.reply("❌ Une erreur est survenue lors de la configuration. Veuillez réessayer.");
        }
    },

    async executeSlash(client, interaction) {
        const channel = interaction.options.getChannel('channel');

        if (channel.type !== ChannelType.GuildText) return interaction.reply({ content: "❌ Veuillez sélectionner un salon textuel valide.", ephemeral: true });

        if (!channel.permissionsFor(interaction.guild.members.me).has([
            PermissionsBitField.Flags.CreateInstantInvite,
            PermissionsBitField.Flags.ManageWebhooks,
            PermissionsBitField.Flags.SendMessages
        ])) {
            return interaction.reply("❌ Je n'ai pas les permissions nécessaires dans ce salon.");
        }
        
        try {
            const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
            const webhook = await channel.createWebhook({
                name: "interserver",
                avatar: "https://cdn.discordapp.com/attachments/1375593104576479383/1376273727225856021/avatar.png"
            });

            db.run(`INSERT INTO channel (guildId, channelId, invite, webhook) VALUES (?, ?, ?, ?)`, [interaction.guild.id, channel.id, invite.url, webhook.url]);

            await sendWelcomeMessage(client, db, interaction.guild, invite.url);

            const embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setTitle("✅ Configuration de l'interServeur")
                .setDescription(`Le salon interServeur a été configuré avec succès dans ${channel}.`);

            await interaction.reply({ embeds: [embed] });

        } catch (err) {
            console.error("Erreur pendant la configuration slash :", err);
            return interaction.reply({ content: "❌ Une erreur est survenue lors de la configuration. Veuillez réessayer.", ephemeral: true });
        }
    },

    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Dans quel salon voulez-vous que les messages interserveur soient envoyés ?')
                    .setRequired(true)
            );
    }
};

// Fonction pour envoyer le message de bienvenue à tous les serveurs connectés
async function sendWelcomeMessage(client, db, guild, inviteUrl) {
    db.all('SELECT * FROM channel', async (err, rows) => {
        if (err) return console.error(err);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`🎉 Bienvenue au serveur ${guild.name} !`)
            .setURL(inviteUrl);

        for (const row of rows) {
            try {
                const g = client.guilds.cache.get(row.guildId);
                if (!g) continue;

                const ch = g.channels.cache.get(row.channelId);
                if (ch) {
                    await ch.send({ embeds: [embed] });
                } else {
                    console.log(`⚠️ Le salon ${row.channelId} n'existe pas dans le serveur ${row.guildId}.`);
                    db.run('DELETE FROM channel WHERE guildId = ? AND channelId = ?', [row.guildId, row.channelId], err => {
                        if (!err) {
                            console.log(`🗑️ Channel supprimé de la DB : ${row.channelId} (serveur ${row.guildId})`);
                        }
                    });
                }
            } catch (e) {
                console.error(`Erreur d'envoi dans le serveur ${row.guildId} :`, e);
            }
        }
    });
}
