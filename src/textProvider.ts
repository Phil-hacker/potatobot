const textProvider = {
    text: {
    },
    render: function (key:string, ...args:Array<any>) {
        return this.text[key]?.replace(/\${\d+}/g,function(matched:string) {
            const index = parseInt(matched.slice(2,-1));
            return args[index];
        })
    }
}

export { textProvider };