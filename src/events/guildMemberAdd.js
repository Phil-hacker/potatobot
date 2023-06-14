import { textProvider } from "../textProvider.js";

const guildMemberAdd = client => async user => {
    (await user.createDm()).send(textProvider.render("welcome_dm_message",user.displayName));
}

export default guildMemberAdd;