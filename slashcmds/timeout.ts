const {} = require("discord.js")
import {GuildMember } from "discord.js";
import type {Command} from "../types"
import { format } from "path";
import { send } from "process";
function parseDuration(str: string | null) {
  if (!str) return null;
  const match = str.trim().match(/^(\d+)(m|h|d)$/i);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit === "m") return value * 60 * 1000;
  if (unit === "h") return value * 60 * 60 * 1000;
  if (unit === "d") return value * 24 * 60 * 60 * 1000;
  return null;
}
function formatDuration(ms: number) {
  let seconds = Math.floor(ms / 1000);
  const units = [
    { label: "day", value: 86400 },
    { label: "hour",value: 3600 },
    { label: "minute",value: 60},
    { label: "second", value: 1}
  ];
  const parts = [];
  for (const unit of units) {
    const amount = Math.floor(seconds / unit.value);
    if (amount > 0) {
      parts.push(`${amount} ${unit.label}${amount !== 1 ? "s" : ""}`);
      seconds %= unit.value;
    }
  }
  return parts.join(", ") || "0 seconds";
}
module.exports = {
    cmd: {
        name: "timeout", desc: "Timeout a User using format like 1m, 1h, 1d", build: cmd => cmd.addUserOption(o=>o.setName("target").setDescription("Target of the Timeout").setRequired(true))
        .addStringOption(o => o.setName("duration").setDescription("how long the timeout should last, 1s <-> 14d").setRequired(true))
        .addStringOption(o=> o.setName("reason").setDescription("reason for the Timeout").setRequired(false))
        .addBooleanOption(o =>  o.setName("send-dm").setDescription("if the Target should be Dmed, Off by Default"))
    },
    async run(client, interaction) {
        const member = interaction.member as GuildMember
        const target = interaction.options.getMember("target") as GuildMember | null
        const duaRaw: string | null = interaction.options.getString("duration") 
        const reason= interaction.options.getString("reason") || "No Reason"
        const sendDM = interaction.options.getBoolean("send-dm") || false
        if (!interaction.guild || !interaction.inGuild()) {
            const embed = client.Base().setTitle("This Command can only be Used in Servers / Guilds").setColor("Red")
            return interaction.reply({embeds: [embed], flags: 1 << 6})
        }
        if (!member.permissions.has("ModerateMembers")) {
            const missing = client.Base().setTitle("Missing Permissions").setDescription("You need the `Moderate Members` / `Timeout Members` Permision to run this Command!").setColor("DarkOrange")
            return interaction.reply({embeds: [missing], flags: 1 << 6})
        }
        if (!interaction.guild.members.me?.permissions.has("ModerateMembers")) {
            const missingM = client.Base().setTitle("Missing Bot Permissions").setDescription("I am Missing the `Moderate Members` / `Timeout Members` Permissions so i cant exectue this Action!").setColor("DarkOrange")
            return interaction.reply({embeds: [missingM], flags: 1 << 6})
        }
        if (!target) {
            const embed = client.Base().setTitle("Target not Found").setDescription("The Target wasnt found. Make sure they are a Member of the Server").setColor("Orange")
            return interaction.reply({embeds: [embed], flags: 1 << 6})
        }
        const duaMs = parseDuration(duaRaw)
        if (duaMs === null) {
            const embed = client.Base().setTitle("Invalid Duration Format").setDescription(`\`${duaRaw}\` is not a valid format.\n\nUse: \`1m\`, \`1h\`, or \`1d\`\nExample: \`/timeout user:@user duration:30m\`\nMaximum: **28 days**`);
            return interaction.reply({ embeds: [embed], flags: 1 << 6 });
        }
        if (duaMs <= 0) {
            const embed = client.Base().setTitle("Invalid Duration").setDescription("Duration must be greater than 0.");
            return interaction.reply({ embeds: [embed], flags: 1 << 6 });
        }
        if (duaMs > 28 * 24 * 60 * 60 * 1000) {
            const embed = client.Base().setTitle("Duration Too Long").setDescription(`You entered \`${duaRaw}\`, but the maximum timeout duration is **28 days**.\nPlease use a value of **28d** or less!`);
            return interaction.reply({ embeds: [embed], flags: 1 << 6 });
        }
        await interaction.deferReply()
        await target.timeout(duaMs, reason);
        let dmSucces = true;
        if (sendDM) {
            const dmEmd = client.Base().setTitle(`Timed out in ${interaction.guild.name}!`).setColor("DarkRed")
            .setDescription(`You have been Timed out by a Moderator for **${formatDuration(duaMs)}**\nReason: **${reason}**`)
            await target.send({embeds: [dmEmd]}).catch(err => { dmSucces = false})
        }
        const embed = client.Base().setTitle(`Succesfully Timed out ${target.user.tag}`).setDescription(`${target} has been Timed out for **${formatDuration(duaMs)}**\n\nReason: **${reason}**
        DM Target: ${sendDM ? "**On**" : "**Off**"}\n${sendDM ? `Succes: ${dmSucces ? "**Yes**" : "**No**"}`: ""}`)
        return interaction.editReply({embeds: [embed]})
    }
} satisfies Command;