const fs = require("fs")
const path = require("path")
module.exports = async (member, client) => {
    const guild = member.guild
    const ConfigData = JSON.parse(fs.readFileSync("./configs/welcome-message.json", "utf8"))
    if (!ConfigData || !ConfigData.channelId || !ConfigData.message) return
    //console.log(ConfigData)
    //console.log(member)
    const embed = client.Base().setDescription(ConfigData.message).setThumbnail(member.displayAvatarURL({ size: 1024, forceStatic: true}));
    const channel = await client.channels.fetch(ConfigData.channelId)
    if (!channel) return;
    await channel.send({content: `${member}`, embeds: [embed]})
    if (ConfigData.roleId) {
        await member.roles.add(ConfigData.roleId)
    }
}