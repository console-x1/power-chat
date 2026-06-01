const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database.js');
const WebhookRegistry = require('../webhookRegistry');

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

const blockRegex = new RegExp(
  [
    /@everyone|@here|<@&?\d{17,20}>/,                          // Mentions
    /(https?:\/\/|www\.)\S+/,                                  // Liens
    /discord(\.gg|\.com\/invite)\/[a-z0-9\-]+/,                // Invites Discord
    /\b\d{1,3}(\.\d{1,3}){3}\b/,                               // IPv4
    /\[?([a-f0-9:]+:+)+[a-f0-9]+\]?/i,                         // IPv6
  ]
    .map(r => r.source)
    .join("|"),
  "iu"
);


module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.channel.isDMBased() || message.author.bot) return;
    if (message.content.length > 2000) return message.reply({ content: '❌ **Votre message est trop long pour être relayé (2000 caractères max).**', flags: 64 });

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
          
          if (blockRegex.test(message.content)) return message.reply({ content: '❌ **Votre message contient du contenu bloqué (mentions, liens, invites, IPs) et ne peut pas être relayé.**', flags: 64 });

          // Créer le bouton avec le customId
          const customId = `interserveurMessage_${message.guild.id}_${message.channel.id}_${message.id}_${message.author.id}`;
          const button = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(message.guild.name)
            .setEmoji('🔗')
            .setStyle(ButtonStyle.Secondary);

          const actionRow = new ActionRowBuilder().addComponents(button);

          // Créer le message simple
          let messageContent = ``;
          if (message.content) {
            messageContent += message.content;
          }

          if (message.attachments.size > 0) {
            messageContent += '\n\n**Pièces jointes:**\n';
            for (const att of message.attachments.values()) {
              messageContent += `-# ${att.url}\n`;
            }
          }

          if (messageContent.length === 0) return;

          if (message.reference?.messageId) {
            try {
              const ref = await message.channel.messages.fetch(message.reference.messageId);
              // Usage du bouton pour determiner le message d'origine
              const btn = ref.components?.[0]?.components?.[0]?.customId?.startsWith('interserveurMessage_')
              if (btn) {
              if (btn.customId?.startsWith('interserveurMessage_')) {
                const parts = btn.customId.split('_');
                const originGuildId = parts[1];
                const originChannelId = parts[2];
                const originMessageId = parts[3];
                const originGuild = client.guilds.cache.get(originGuildId);
                if (originGuild) {
                  const originChannel = originGuild.channels.cache.get(originChannelId);
                  if (originChannel) {
                    const originMessage = await originChannel.messages.fetch(originMessageId);
                    if (originMessage) {
                      messageContent += `\n\n> **En réponse à:** ${originMessage.author.tag} - https://discord.com/channels/${originGuildId}/${originChannelId}/${originMessageId} - ${originMessage.content.trim().slice(0, 100) || '*Pièce jointe*'}`;
                    }
                  }
                }
              }
            } else {
                messageContent += `\n\n> **En réponse à:** ${ref.author.tag} - https://discord.com/channels/${message.guild.id}/${message.channel.id}/${ref.id} - ${ref.content.trim().slice(0, 100) || '*Pièce jointe*'}`;
            }
            } catch (e) {
              console.warn('Référence introuvable:', e.message);
            }
          }

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
                content: messageContent,
                components: [actionRow],
                allowedMentions: { parse: [] }
              });

            } catch (err) {
              console.error('Erreur envoi webhook:', err);
              continue;
            }
          }
        });
      });
    });
  }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat