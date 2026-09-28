import {REST, Routes, SlashCommandBuilder} from "discord.js"
import type {Event} from "../types"

export default {
    name: "ready",
    once: true,
    async execute(readyClient, client) {
        console.log(`\nDiscord Bot is ready and logged in as ${readyClient.user.tag}\n`)

        const ready = client.Base().setTitle(`Bot Logged in and Ready as ${readyClient.user.tag}!!`).setColor("DarkGreen").setTimestamp()
        if (client.Loghook) await client.Loghook.send({embeds: [ready]})
        const rest = new REST({version: "10"}).setToken(process.env.Token!)
        const body = [...client.commands.values()].map(command=> {
            const cmd = new SlashCommandBuilder().setName(command.cmd.name).setDescription(command.cmd.desc)
            if (command.cmd.build) command.cmd.build(cmd)
            return cmd.toJSON()
        })
        await rest.put(Routes.applicationCommands(readyClient.user.id), {body})
        console.log("Registered global commands!")
    }
} satisfies Event<"ready">
