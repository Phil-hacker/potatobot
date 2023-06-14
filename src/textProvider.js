const textProvider = {
    text: {
    },
    render: function (key, ...args) {
        return this.text[key]?.replace(/\${\d+}/g,function(matched) {
            const index = parseInt(matched.slice(2,-1));
            return args[index];
        })
    }
}

export { textProvider };