

//https://discord.com/developers/docs/interactions/application-commands
const config = async client => new Object({
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
const run = client => async ( interaction ) => {
    console.log(interaction);
    interaction.reply('PONG');   
}
  

export { config, run }