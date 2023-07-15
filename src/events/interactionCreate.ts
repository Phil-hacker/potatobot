import type { PotatoClient } from '../@types/index.d.ts';

const interactionCreate = (client:PotatoClient) => (args:any) => {
    return client.commands[args.commandName]?.(args);
}

export default interactionCreate;