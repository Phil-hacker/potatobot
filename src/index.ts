import 'dotenv/config';
import { Client, REST, Collection, Events, GatewayIntentBits } from 'discord.js';
import { attachEvents, loadCommands } from './loader.js';
import type { PotatoClient } from './@types/index.d.ts';

const token = process.env.mode==='DEV' ? process.env.dev_potatotoken : process.env.potatotoken;

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as PotatoClient;

client.once(Events.ClientReady, async c => {
	c.rest = new REST().setToken(token as string);
	console.info(`Ready! Logged in as ${c.user.tag}`);
	await attachEvents(c);
	await loadCommands(c);
});

client.login(token);

export default client;