import type {Command} from "../types.ts"
import type {GuildMember} from "discord.js"

module.exports = {
    cmd: {
        name: "kick", desc: "Kick someone from the server", build: cmd =>cmd
        .addUserOption(o => o.setName("target").setDescription("Who to kick").setRequired(true))
        .addStringOption(o=> o.setName("reason").setDescription("reason for the Kick"))
        .addBooleanOption(o => o.setName("send-dm").setDescription("if the target should be dmed, Off by default"))
    },
    async run(client, interaction){
        if (!interaction.guild || !interaction.inGuild()) {
            const noG = client.Base().setTitle("This Command can only be used in Servers / Guilds").setColor("Red")
            return interaction.reply({embeds: [noG], flags: 1 << 6})
        }
        const member = interaction.member as GuildMember;
        const sendDm = interaction.options.getBoolean("send-dm") || false
        const target = interaction.options.getMember("target") as GuildMember | null
        const reason: string = interaction.options.getString("reason") || "No Reason Provided";
        if (!member.permissions.has("KickMembers")) {
            const noPerms = client.Base().setTitle("Missing Permissions").setColor("Orange")
            .setDescription("You need the `Kick Members` Permission to run this Command")
            return interaction.reply({embeds: [noPerms], flags: 1 << 6});
        }
        if (!interaction.guild.members || !interaction.guild.members.me) return;
        if (!interaction.guild.members.me.permissions.has("KickMembers")) {
            const noBPerms = client.Base().setTitle("Missing bot Permissions")
                .setDescription("I Need the `Kick Members` Permissions to execute this")
                .setColor("Orange")
            return interaction.reply({embeds: [noBPerms], flags: 1 << 6})
        }
        if (!target) {
            const noT = client.Base().setTitle("Target not Found!").setColor("Orange")
            .setDescription("The Target you provided was not found, Make sure they are a Member of the Server")
            return interaction.reply({embeds: [noT], flags: 1 << 6})
        }
        if (!target.kickable) {
            const noKick= client.Base().setTitle("Cant Kick Target")
            .setDescription("This could be due to role hirarchy!")
            .setColor("Orange")
            return interaction.reply({embeds: [noKick], flags: 1 << 6});
        }
        await interaction.deferReply()
        let dmSuces = true
        if (sendDm) {
            const dmEmd = client.Base().setTitle(`Kicked in ${interaction.guild.name}`)
            .setDescription(`You have been kicked by a Moderator!\n
            Reason: **${reason}**`)
            await target.send({embeds: [dmEmd]}).catch(err=> {dmSuces = true})
        }
        let succes = true
        await target.kick(reason).catch(err => {succes = false})

        const embed = client.Base().setTitle("Kicked!!")
        .setDescription(`${target.user.tag} was Kicked from the Server\n\n
        Reason: **${reason}**\nKick Succes: ${succes ? "**Yes**" : "**No**"}\n
        DM Target: ${sendDm ? `**Enabled**\nDm Succes: ${dmSuces ? "**Yes**" : "**No**"}` : "**Disabled**"} `)
        
        return interaction.editReply({embeds: [embed]})
    }
} satisfies Command