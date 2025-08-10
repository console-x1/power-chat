// This file was created by GPT-5 -> I didn't know how to do that.

const { WebhookClient } = require('discord.js');

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

class WebhookRegistry {
  constructor(client, { name = 'Interserver Relay', deleteOthers = true } = {}) {
    this.client = client;
    this.name = name;
    this.deleteOthers = deleteOthers;
    this.cache = new Map();
    this.locks = new Map();
  }

  async ensure(channel) {
    if (this.cache.has(channel.id)) return this.cache.get(channel.id);

    const existingLock = this.locks.get(channel.id);
    if (existingLock) return existingLock;

    const lock = (async () => {
      const hooks = await channel.fetchWebhooks().catch(() => null) || new Map();

      const appId = this.client.application?.id || (await this.client.application?.fetch().then(a => a?.id).catch(() => null));
      let chosen = [...hooks.values()].find(h =>
        h.name === this.name ||
        h.owner?.id === this.client.user.id ||
        (appId && h.applicationId === appId)
      );

      if (!chosen) {
        chosen = await channel.createWebhook({
          name: this.name,
          reason: 'Webhook interserveur (initialisation)',
        });
      }

      if (this.deleteOthers) {
        for (const h of hooks.values()) {
          if (h.id === chosen.id) continue;
          if (h.owner?.id === this.client.user.id || (appId && h.applicationId === appId) || h.name === this.name) {
            await h.delete('Nettoyage des webhooks redondants').catch(() => {});
          }
        }
      }

      const whClient = new WebhookClient({ url: chosen.url });
      this.cache.set(channel.id, whClient);
      this.locks.delete(channel.id);
      return whClient;
    })();

    this.locks.set(channel.id, lock);
    return lock;
  }

  async prewarmFromRows(rows) {
    for (const row of rows) {
      const guild = this.client.guilds.cache.get(row.guildId);
      if (!guild) continue;
      const channel = guild.channels.cache.get(row.channelId);
      if (!channel) continue;
      try {
        await this.ensure(channel);
      } catch (e) {
        console.warn(`Préwarm échoué pour ${guild.id}/${channel.id}:`, e.message);
      }
    }
  }

  invalidate(channelId) {
    const wh = this.cache.get(channelId);
    if (wh) wh.destroy?.();
    this.cache.delete(channelId);
  }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

module.exports = WebhookRegistry;

// This file was created by GPT-5 -> I didn't know how to do that.