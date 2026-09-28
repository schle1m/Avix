const { time } = require("discord.js");
import type {GuildMember} from "discord.js"
import type { Command} from "../types"

module.exports = {
  cmd: {
    name: "user-info", desc: "get some information on a Member",
    build: cmd => cmd.addUserOption(op=> op.setName("user").setDescription("who to get info on (you by default)").setRequired(true))
  },
  async run(client, interaction) {
    if (!interaction.inGuild()) { 
        const noG = client.Base().setTitle("You can only use this Commnand in Servers.").setColor("DarkOrange")
    return interaction.reply({embeds: [noG], flags: 1 << 6})
    }
  const guild = interaction.guild!;
  //fallback for proper handling if user provided etc
  const optionUser = interaction.options.getUser("user");
  let member: GuildMember | null = null;
  if (optionUser) {
    member = interaction.options.getMember("user") as GuildMember | null || await guild.members.fetch(optionUser.id).catch(() => null);
  }
  if (!member){
    const embd = client.Base().setTitle("No Member found").setDescription("The User you provided is not a Member of this Server").setColor("Orange")
    return interaction.reply({embeds: [embd], flags: 1 << 6})
  }
  const user = member.user;
  //-1 role cus @everyone
  const roles = member.roles.cache.filter(r =>r.id !== guild.id).sort((a, b) => b.position - a.position).map(r => r.toString()).join(", ") || "None";
  const highestRole = member.roles.highest.id === guild.id ? "None" : member.roles.highest.toString();
  const created = time(user.createdAt, "f");
  const joined = member.joinedAt? time(member.joinedAt, "f") : "Unknown";
  const embed = client.Base()
    .setTitle(`User Info — ${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ size: 1024 })).addFields(
      { name: "ID", value: user.id, inline: true },
      { name: "Bot", value: user.bot ? "Yes" : "No", inline: true },
      { name: "Account Created", value: created, inline: true },
      { name: "Joined Server", value: joined, inline: true },
      { name: "Highest Role", value: highestRole, inline: true },
      { name: "Roles", value: roles })
      
  return interaction.reply({ embeds: [embed] })
  }
} satisfies Command
