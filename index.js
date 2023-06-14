import 'dotenv/config';
import { Client, REST, Collection, Events, GatewayIntentBits } from 'discord.js';
import { attachEvents, loadCommands } from './src/loader.js';


const token = process.env.mode==='DEV' ? process.env.dev_potatotoken : process.env.potatotoken;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async c => {
	c.rest = new REST().setToken(token);
	console.info(`Ready! Logged in as ${c.user.tag}`);
	await attachEvents(c);
	await loadCommands(c);
});

client.login(token);