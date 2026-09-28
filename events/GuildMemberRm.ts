const fs = require("fs")
import type {TextChannel} from "discord.js"
import type {Event} from "../types"

export default {
    name: "guildMemberRemove",
    async execute(member, client) {
        const ConfigData = JSON.parse(fs.readFileSync("./configs/leave-message.json", "utf8"))
        if (!ConfigData || !ConfigData.channelId || !ConfigData.message) return
        const embed = client.Base().setDescription(ConfigData.message).setThumbnail(member.displayAvatarURL({ size: 1024, forceStatic: true}));
        const channel = await client.channels.fetch(ConfigData.channelId)
        if (!channel) return;
        await (channel as TextChannel).send({content: `${member.user.tag}`, embeds: [embed]})
    }
} satisfies Event<"guildMemberRemove">
