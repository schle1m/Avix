module.exports = async (client, interaction) => {
    const guild = interaction.guild;
    console.log(guild)
    const embed= client.Base().setTitle(`Server Info: ${guild.name}`).setDescription(guild.description || "No Description").addFields(
        {name: "Id", value: guild.id, inline: true}, {name: "Owner", value: `<@${guild.ownerId}>`, inline: true}, {name: "Members", value: `${guild.memberCount}`,inline: true},
        { name: "Channels", value: guild.channels.cache.size.toString(), inline: true }, { name: "Roles", value: guild.roles.cache.size.toString(), inline: true },
        { name: "Emojis", value: guild.emojis.cache.size.toString(), inline: true }, { name: "Stickers", value: guild.stickers.cache.size.toString(), inline: true },
        { name: "Soundboard Sounds", value: guild.soundboardSounds.cache.size.toString(), inline: true }, { name: "Boost Level", value: guild.premiumTier.toString(), inline: true },
        { name: "Boosts", value: guild.premiumSubscriptionCount.toString(), inline: true }, {name: "Created", value: ``, inline: true}
    ).setThumbnail(guild.iconURL({ dynamic: true }))
    if (guild.banner) {embed.setImage(guild.banner)}

    return interaction.reply({embeds: [embed]})
}