import * as fs from 'fs';
import * as path from 'path';

import { Collection , Routes } from 'discord.js';
import type { PotatoClient } from './@types/index.d.ts';


const attachEvents = async (client:PotatoClient) => {
  const eventsPath = path.resolve('./src', 'events');
  const events = fs.readdirSync(eventsPath).map((name = '') => name.split('.')[0]);
  for (const event of events) {
    const fn = (await import(`file://${path.resolve(eventsPath, `${event}.ts`)}`)).default;
    client.on(event, (...args) => fn(client)(...args));
  }
}


const addCommand = async (client:PotatoClient, path:string) => {
    const command = await import(`file://${path}`);
    const config = await command.config(client);
    client.commands[config.name]=command.run(client);
    if(process.argv.find(a=>a==='reload')) await client.rest.put(Routes.applicationCommands(client.application.id), {body: [config]});
}

const loadCommands = async (client:PotatoClient) => {
  // Commands setup
  client.commands = new Collection();
  const commandsPath = path.resolve('./src', 'commands');
  const commands = fs.readdirSync(commandsPath);
  for (const command of commands) {
    if (command.includes('.ts')) {
      addCommand(client, `${commandsPath}\\${command}`)
    } else {
      const commandFiles = fs.readdirSync(path.resolve(commandsPath, command))
      for (const cName of commandFiles) {
        if (cName.includes('.ts')) {
          addCommand(client, `${commandsPath}\\${cName}`)
        }
      }
    }
  }
}

export { attachEvents, loadCommands };
