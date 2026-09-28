import type {Command } from "../types"

module.exports = {
    cmd: {
        name: "ping", desc: "ping the Bot to check if its online as well as some stats"
    },
    async run(client, interaction) {
    const start = Date.now()
    const sent = await interaction.reply({content: "Pinging the Bot"})
    const ping = Date.now() - start
    const wsPing =Math.max(interaction.client.ws.ping, 0)
    const reply= client.Base().setTitle("Pong!!!!").setDescription(
        `Latency: **${ping}ms**\n` +
        `Websocket Ping: **${wsPing}ms**`)
    return interaction.editReply({embeds: [reply], content: null})
    }
} satisfies Command
