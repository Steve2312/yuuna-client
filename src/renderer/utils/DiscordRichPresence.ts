import DiscordRPC from 'discord-rpc'

class DiscordRichPresence {
    private CLIENT_ID = '790595129739706389'
    private client: DiscordRPC.Client

    constructor() {
        this.client = new DiscordRPC.Client({ transport: 'ipc' })

        this.client.login({
            clientId: this.CLIENT_ID
        }).catch(err => {
            console.error(err)
        })
    }

    public async setActivity(options: DiscordRPC.Presence): Promise<void> {
        console.log(`${this.constructor.name} set an activity`)
        await this.client.setActivity(options)
    }

    public async clearActivity(): Promise<void> {
        console.log(`${this.constructor.name} cleared an activity`)
        await this.client.clearActivity()
    }
}

export default DiscordRichPresence
