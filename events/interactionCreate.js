// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.guild) return;

        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            // vérification des permissions
            if (command.permissions) {
                if (command.botOwnerOnly && !client.config.owners.includes(interaction.user.id)) {
                    return interaction.reply({
                        content: `❌ **Vous devez être le __propriétaire du bot__ pour exécuter cette commande.**`,
                        ephemeral: true
                    });
                };

                if (command.guildOwnerOnly) {
                    if (interaction.member.guild.ownerId != interaction.user.id && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                        content: `❌ **Vous devez être le __propriétaire du serveur__ pour exécuter cette commande.**`,
                        ephemeral: true
                    });
                };

                const authorPerms = interaction.guild.channels.cache.get(interaction.channelId).permissionsFor(interaction.user);
                if ((!authorPerms || !authorPerms.has(command.permissions)) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                    content: `❌ **Vous n'avez pas les permissions nécessaires pour exécuter cette commande.**`,
                    ephemeral: true
                });
            };

            var jours = new Date().getDate()
            var mois = new Date().getMonth()
            var année = new Date().getFullYear()

            var heures = new Date().getHours()
            var minutes = new Date().getMinutes()
            var secondes = new Date().getSeconds()
            if (jours < 10) jours = "0" + jours;
            if (mois < 10) mois = "0" + mois;
            if (heures < 10) heures = "0" + heures;
            if (minutes < 10) minutes = "0" + minutes;
            if (secondes < 10) secondes = "0" + secondes;

            command.executeSlash(client, interaction);
            console.log(`[CMD-S] || ${jours}/${mois}/${année} at ${heures}:${minutes}:${secondes} | ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.user.tag} | ${command.name}`.yellow);
        }
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat