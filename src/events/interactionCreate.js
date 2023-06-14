const interactionCreate = client => args => {
    return client.commands[args.commandName]?.(args);
}

export default interactionCreate;