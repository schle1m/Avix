import type {Guild, GuildMember} from "discord.js"
import type {Command} from "../types"

module.exports = {
    cmd: {
        name: "untimeout", desc: "Remove someones timeout", build: cmd => cmd.addUserOption(o =>o.setName("target").setDescription("who to bless with an untimeout").setRequired(true))
        .addStringOption(o => o.setName("reason").setDescription("reason for the untimeout (optional)"))
    },
    async run(client, interaction) {
        if (!interaction.inGuild() || !interaction.guild) {
            const noG = client.Base().setTitle("This Command can only be used in Servers / Guilds").setColor("Red")
            return interaction.reply({embeds: [noG], flags: 1 << 6})
        }
        const member = interaction.member as GuildMember
        const target = interaction.options.getMember("target") as GuildMember | null
        const reason: string = interaction.options.getString("reason") || "No Reason"

        if (!member.permissions.has("ModerateMembers")) {
            const noPerms = client.Base().setTitle("Missing Permissions!!").setDescription("You are missing the `Moderate Members` Permissions to run this Command!").setColor("DarkOrange")
            return interaction.reply({embeds: [noPerms], flags: 1 << 6})
        }
        if (!interaction.guild.members.me?.permissions.has("ModerateMembers")) {
            const noPerms = client.Base().setTitle("Missing Bot Permissions!!").setDescription("I am missing the `Moderate members` Permission to execute this Command").setColor("DarkOrange")
            return interaction.reply({embeds: [noPerms] , flags: 1 << 6})
        }
        if (!target) {
            const noT = client.Base().setTitle("Target not found").setDescription("the set Target wasnt found as a Member of the Server! Please make sure they are in this Server").setColor("Orange")
            return interaction.editReply({embeds: [noT], flags: 1 << 6})
        }
        await target.timeout(null).catch(err => {})
        const embed = client.Base().setTitle(`Succesfully removed the Timeout from ${target.user.tag}`).setDescription(`${target} has been Untimeouted!\n\nReason: **${reason}**`)
        return interaction.reply({embeds: [embed]})
    }
} satisfies Command