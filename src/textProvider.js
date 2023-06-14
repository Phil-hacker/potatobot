const textProvider = {
    text: {
        "welcome_dm_message" : "Welcome to the server. You can write in #introductions and #new-people-general until you get granted access on the server by an admin."
    },
    render: function (key, ...args) {
        return this.text[key]?.replace(/\${\d+}/g,function(matched) {
            const index = parseInt(matched.slice(2,-1));
            return args[index];
        })
    }
}

export { textProvider };