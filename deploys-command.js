const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const fs = require('fs');

const shadow = require("./shadow.json");
const clientId = "1153750056898404452";

const commands = [];

const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith(".js"));
commandFiles.forEach(commandFile => {
    const command = require(`${__dirname}/commands/${commandFile}`);
    if (command.data) commands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(shadow.token);

rest.put(
    Routes.applicationCommands(clientId), { body: commands }
    )
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.log(Error))