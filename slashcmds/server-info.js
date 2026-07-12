const {ChannelType} = require("discord.js")
module.exports = async (client, interaction) => {
    if (!interaction.inGuild()) {
        const noG = client.Base().setTitle("You can only use this Commnand in Servers.").setDescription("Dms aint no Server guh").setColor("DarkOrange")
        return interaction.reply({embeds: [noG], flags: 1 << 6})
    }
    const guild = interaction.guild;
    const roles = guild.roles.cache.size - 1; //dont count @everyone
    const categories = guild.channels.cache.filter( c => c.type === ChannelType.GuildCategory).size
    const channels = guild.channels.cache.filter(c => c.type !== ChannelType.GuildCategory).size
    //embed
    const embed= client.Base().setTitle(`Server Info: ${guild.name}`).setDescription(guild.description || "No Description").addFields(
        {name: "Id", value: guild.id, inline: true}, {name: "Owner", value: `<@${guild.ownerId}>`, inline: true}, {name: "Members", value: `${guild.memberCount}`,inline: true},
        { name: "Channels", value: `${channels}`, inline: true }, { name: "Roles", value: `${roles}`, inline: true }, {name: "Categorys", value: `${categories}` , inline: true},
        { name: "Emojis", value: guild.emojis.cache.size.toString(), inline: true }, { name: "Stickers", value: guild.stickers.cache.size.toString(), inline: true },
        { name: "Soundboard Sounds", value: guild.soundboardSounds.cache.size.toString(), inline: true }, { name: "Boost Level", value: guild.premiumTier.toString(), inline: true },
        { name: "Boosts", value: guild.premiumSubscriptionCount.toString(), inline: true }, {name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true}
    ).setThumbnail(guild.iconURL({ dynamic: true }))
    if (guild.banner) {embed.setImage(guild.banner)} //set the image if a banner exists
    //reply
    return interaction.reply({embeds: [embed]})
}