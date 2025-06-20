// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat

const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const fs = require("fs");
const colors = require("colors");
const Logger = require('power-logs');
const logger = new Logger();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
    restTimeOffset: 0,
    failIfNotExists: false,
    presence: {
        activities: [{
            name: `⚠ starting... ⚠`,
            type: ActivityType.Custom,
        }],
        status: "Online"
    },
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    }
});
client.config = require("./config.json");
client.shadow = require("./shadow.json");

client.login(client.shadow.token);

// chargement des events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

// chargement des commandes
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////                           //////////////////////////////////////////////////////////////////////////////
/////////////// gestion des erreurs ///////////////////////////////////////////////////////////////////////////////////
///////////                           /////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
process.on("unhandledRejection", (error) => {
    logger.error("Unhandled Rejection: " + error);
    console.log(colors.red("Unhandled Rejection: ", error));
});

process.on("exit", (code) => {
    logger.fatal("Process exited with code: " + code);
    console.log(colors.red("Process exited with code: ", code));
});

process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception: " + error);
    console.log(colors.red("Uncaught Exception: ", error));
});

// Made by .power.x with ❤️
// Code on my github : https://github.com/console-x1/power-chat