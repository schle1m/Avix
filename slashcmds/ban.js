const {PermissionsBitField, DMChannel}= require("discord.js")
module.exports = async (client, interaction) => {
    if (!interaction.inGuild()) {
        const noG = client.Base().setTitle("You can only use this Commnand in Servers.").setDescription("Who are you trying to ban in dms :v::sob:").setColor("DarkOrange")
        return interaction.reply({embeds: [noG], flags: 1 << 6})
    }
    //get values
    const guild = interaction.guild;
    const user = interaction.user
    const member = interaction.member
    const target = interaction.options.getMember("target")
    const reason =interaction.options.getString("reason") || "No Reason given"
    const sendDm = interaction.options.getBoolean("send-dm") || false
    //check perms
    if (!target) {
        const embed = client.Base().setTitle("Target not Found").setDescription("Make sure the Person you are trying to Ban is a Server Member.").setColor("Orange")
        return interaction.reply({embeds: [embed], flags: 1 << 6})
    }
    if (!member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({embeds: [client.Base().setTitle("Cant Ban User").setDescription("You don't have BanMembers permission.")], flags: 1 << 6})
    }
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({embeds: [client.Base().setTitle("Cant Ban User").setDescription("I don't have BanMembers permission.")], flags: 1 << 6})
    }
    if (!target.bannable) {
        return interaction.reply({embeds: [client.Base().setTitle("Not Bannable").setDescription("This Member is not bannable most likelly due to Role hirarchy").setColor("Orange")], flags: 1 << 6})
    }
    await interaction.deferReply()
    try {
        await target.ban({reason})
    } catch(err) {
        console.error(`Failed to ban ${target.tag} in ${guild.id}: ${err}`)
        return interaction.editReply("Something went wrong while Banning the User")
    } 
    let dmSucces = true;
    if (sendDm) {
        const dm = client.Base().setTitle(`You got banned in ${guild.name}`).setDescription(`You have been banned for the following Reason: **${reason}**`).setColor("DarkRed")
        await target.send({embeds: [dm]}).catch(err => { dmSucces = false})
    }
    const final = client.Base().setTitle(`Succesfully banned ${target.user.tag}`).setDescription(`Reason: **${reason}**\nTarget: **${target.user.tag} (${target.id})**\nSend DM: **${sendDm ? "On" : "Off"}**${sendDm ? `\nDm Succes: **${dmSucces ? "Yes" : "No"}**` : ""}`)
    return interaction.editReply({embeds: [final]})
}