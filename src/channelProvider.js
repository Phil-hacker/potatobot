const channelProvider = {
    devChannels: {},
    prodChannels: {},
    getChannel: function (channel) {
        return process.env.mode==='DEV' ? this.devChannels[channel] : this.prodChannels[channel]
    }
}


export { channelProvider };