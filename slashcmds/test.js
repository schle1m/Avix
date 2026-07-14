const {PermissionsBitField}= require("discord.js")
module.exports = async (client, interaction) => {
    const member = interaction.member;
    const type = interaction.options.getSubcommand()
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({embeds: [client.Base().setTitle("Admin Only Command").setColor("Red")], flags: 1 << 6})
    }
    switch(type) {
        case "join":
            await client.emit("guildMemberAdd", member)
            const embed = client.Base().setTitle("A Join event has been Emitted")
            return interaction.reply({embeds: [embed]})
            break;
        case "leave": 
            await client.emit("guildMemberRemove", member)
            const embedL= client.Base().setTitle("Emitted a Leave Event!")
            return interaction.reply({embeds: [embedL]})
            break;
    }
}