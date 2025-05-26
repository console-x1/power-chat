// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (message.channel.isDMBased() || message.author.bot) return;
        if (!message.content.startsWith(client.config.prefix)) return;

        // ANALYSEUR DE COMMANDES
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // check commande
        const command = client.commands.get(commandName) || client.commands.find(command => command.aliases && command.aliases.includes(commandName));
        if (!command) return;

        // check permissions
        if (command.permissions) {
            if (command.botOwnerOnly) {
                if (!client.config.owners.includes(message.author.id)) return;
                return
            };

            if (command.staffOnly) {
                if (!client.config.staff.includes(interaction.user.id)) return interaction.reply({
                    content: `❌ **Vous devez être __staff du bot__ pour exécuter cette commande.**`,
                    ephemeral: true
                });
            };

            if (command.guildOwnerOnly) {
                if (message.guild.ownerId != message.author.id && !client.config.owners.includes(message.author.id)) return message.reply("Vous devez être le propriétaire du serveur pour exécuter cette commande.").catch(() => { });
                return
            };

            const authorPerms = message.channel.permissionsFor(message.author);
            if ((!authorPerms || !authorPerms.has(command.permissions)) && !client.config.owners.includes(message.author.id) && message.guild.ownerId != message.author.id) return message.reply("Vous n'avez pas les permissions nécessaires pour exécuter cette commande.").catch(() => { });
        }

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

        command.execute(client, message, args);
        console.log(`[CMD-MSG] || ${jours}/${mois}/${année} at ${heures}:${minutes}:${secondes} | ${message.guild.name} | ${message.author.tag} | ${command.name}`.grey);
    }
}

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat