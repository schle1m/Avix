const {PermissionsBitField}= require("discord.js")
import type { Guild, GuildMember} from "discord.js"
import type {Command} from "../types"

module.exports = {
    cmd: {
        name: "test", desc: "test events",
        build: cmd => cmd.addSubcommand(s=> s.setName("join").setDescription("emit the Join event for testing your configs etc"))
        .addSubcommand(sub => sub.setName("leave").setDescription("emit a leave event to test leave message etc"))
    },
async run(client, interaction) {
    if (!interaction.inGuild() || !interaction.guild) { //handle no server
        const NoGuild = client.Base().setTitle("This Command can only be used in Servers").setColor("Red")
        return interaction.reply({embeds: [NoGuild], flags: 1 << 6})
    }
    const member: GuildMember = await interaction.guild.members.fetch(interaction.user.id)
    const type = interaction.options.getSubcommand()
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({embeds: [client.Base().setTitle("Admin Only Command").setColor("Red")], flags: 1 << 6})
    }
    switch(type) {
        case "join":
            await client.emit("guildMemberAdd", member)
            const embed = client.Base().setTitle("A Join event has been Emitted")
            return interaction.reply({embeds: [embed]})
        case "leave": 
            await client.emit("guildMemberRemove", member)
            const embedL= client.Base().setTitle("Emitted a Leave Event!")
            return interaction.reply({embeds: [embedL]})
    }
}
} satisfies Command
