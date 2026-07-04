const {SlashCommandBuilder, REST, Routes } = require("discord.js")
const cmds = [
    new SlashCommandBuilder().setName("ping").setDescription("ping the Bot to check if its online as well as some stats")
]
async function register(client, guildOnly = false, guildId) {
    const rest = new REST({ version: "10" }).setToken(process.env.Token);
    const body = cmds.map(cmd => cmd.toJSON());
    if (guildOnly) {
        await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {body})
        console.log("Registered guild commands.");
    } else {
        await rest.put(Routes.applicationCommands(client.user.id), {body })
        console.log("Registered global commands.");
}}
module.exports = {register}