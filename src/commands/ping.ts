import { CommandInteraction } from "discord.js";
import type { PotatoClient } from '../@types/index.d.ts';

//https://discord.com/developers/docs/interactions/application-commands
const config = async (client: PotatoClient) => new Object({
    name: "ping",
    description: "Ping",
    type: 1,
    options: [
      {
        type: 1,
        name: "pingtochannel",
        description: "Ping to a channel",
        options: [
          {
            type: 7,
            name: "channel",
            required: true,
            description: "Channel to ping in",
            channelTypes: 0
          }
        ]
      }
    ]
});

//https://discord.com/developers/docs/interactions/receiving-and-responding
const run = (client: PotatoClient) => async ( interaction: CommandInteraction ) => {
    interaction.reply('PONG');   
}
  

export { config, run }