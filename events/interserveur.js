const { EmbedBuilder } = require('discord.js');
const db = require('../database.js');
const WebhookRegistry = require('../webhookRegistry');

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.channel.isDMBased() || message.author.bot) return;
    if (message.content.includes('http') || message.content.includes('https') || message.content.includes('discord.') || message.content.includes('www.') || message.content.includes('://discord')) return;
    if (message.content.length > 2000) return;

    if (!client.relayRegistry) {
      client.relayRegistry = new WebhookRegistry(client, {
        name: 'Interserver Relay',
        deleteOthers: true,
      });
    }

    db.get('SELECT * FROM user WHERE userId = ?', [message.author.id], (err, userRow) => {
      if (err) return console.error(err);
      if (userRow) return;

      db.get('SELECT * FROM channel WHERE guildId = ? AND channelId = ?', [message.guild.id, message.channel.id], (err, channelRow) => {
        if (err) return console.error(err);
        if (!channelRow) return;

        db.all('SELECT * FROM channel', async (err, rows) => {
          if (err) return console.error(err);
          if (!rows?.length) return;

          const isStaff = client.config.staff.includes(message.author.id);
          const isOwner = client.config.owners.includes(message.author.id);
          const color = isStaff ? 0x0000FF : isOwner ? 0xFF0000 : client.config.color ?? 0x00FF00;

          const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`Message de ${message.author.tag} depuis ${message.guild.name}`)
            .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields({ name: 'Utilisateur :', value: `<@${message.author.id}>` })
            .setFooter({ text: `Made by .power.x with ❤️`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

          if (message.content) {
            embed.setDescription(message.content);
          }

          if (message.attachments.size > 0) {
            for (const att of message.attachments.values()) {
              if (att.contentType?.startsWith('image/')) embed.setImage(att.url);
              else embed.addFields({ name: 'Pièce jointe', value: att.url });
            }
          }

          if (message.reference?.messageId) {
            try {
              const ref = await message.channel.messages.fetch(message.reference.messageId);
              const refAuthor = ref?.author ? `<@${ref.author.id}>` : 'Utilisateur inconnu';
              const refContent = ref?.embeds?.[0]?.description || ref?.content || '';
              const preview = refContent.length > 300 ? refContent.slice(0, 297) + '…' : refContent;
              const refLink = `https://discord.com/channels/${ref.guildId}/${ref.channelId}/${ref.id}`;
              embed.addFields({
                name: 'En réponse à :',
                value: `${preview || '*Sans contenu*'}\n**De :** ${refAuthor}\n[Ouvrir](${refLink})`
              });
            } catch (e) {
              console.warn('Référence introuvable:', e.message);
            }
          }

          let sentSomewhere = false;
          for (const row of rows) {
            try {
              if (row.guildId === message.guild.id && row.channelId === message.channel.id) continue;

              const guild = client.guilds.cache.get(row.guildId);
              if (!guild) continue;

              const target = guild.channels.cache.get(row.channelId);
              if (!target) {
                db.run('DELETE FROM channel WHERE guildId = ? AND channelId = ?', [row.guildId, row.channelId]);
                continue;
              }

              const wh = await client.relayRegistry.ensure(target);
              await wh.send({
                username: message.member?.displayName ?? message.author.tag,
                avatarURL: message.author.displayAvatarURL({ size: 1024 }),
                embeds: [embed],
                allowedMentions: { parse: [] }
              });

              sentSomewhere = true;
            } catch (err) {
              console.error('Erreur envoi webhook:', err);
              continue;
            }
          }

          const hasAttachment = message.attachments.size > 0;
          if (sentSomewhere && !hasAttachment && message.deletable) {
            message.delete().catch(() => {});
          }
        });
      });
    });
  }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat