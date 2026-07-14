const {Client, IntentsBitField, GatewayIntentBits, EmbedBuilder, WebhookClient, Embed} = require("discord.js")
require("dotenv").config();
const fs = require("fs")
const path= require("path")
const client = new Client({
    intents: [ GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds ]
})
let Loghook = null
if (process.env.LogHook) {
    Loghook = new WebhookClient({url: `${process.env.LogHook}`})
}
require("./util/error")(Loghook)
function defaultbase() {
    const embed= new EmbedBuilder().setColor("Random").setFooter({text: "Bot", iconURL: "https://i.pinimg.com/474x/8a/c3/f9/8ac3f9735abb4b0197ee838735715833.jpg?nii=t"})
    return embed;
}
let Custombase = null
try {
    const {base}= require("./base") || null
    Custombase = base
} catch(err) {}
client.Base = Custombase || defaultbase
const {register} = require("./register")
client.once("ready", async() => {
    console.log(`\nDiscord Bot is ready and logged in as ${client.user.tag}\n`)
    const ready = client.Base().setTitle(`Bot Logged in and Ready as ${client.user.tag}!!`).setColor("DarkGreen").setTimestamp()
    if (Loghook) await Loghook.send({embeds: [ready]})
    //await registerCommands(client, true, "server_id") //Guild only Mode
    await register(client) // Register Cmds globally
})
client.commands = new Map();
function loadCommands(dir, map) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file)
        if (fs.statSync(fullPath).isDirectory()) {
            loadCommands(fullPath, map);
            return;
        }
        if (!file.endsWith(".js") && !file.endsWith(".ts")) return;
        const commandName = path.parse(file).name;
        const command = require(path.resolve(fullPath));
        map.set(commandName, command);
        console.log(`Loaded: ${fullPath}`);
    });
}
loadCommands("./slashcmds", client.commands);
async function SlashCmds(client, interaction) {
    const name= interaction.commandName;
    const command = client.commands.get(name)
    if (!command) return interaction.reply("Command not Found in the `slashcmds` Folder.")
    await command(client, interaction)
}
client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand) {
        await SlashCmds(client, interaction)
    } 
})
client.on("guildMemberAdd", async (member) => {
    try {
        await require("./handlers/GuildMemberAd")(member, client) 
    } catch(err) {if (!err.message.startsWith("ENOENT")) console.error(`GuildMemberAdd Err: ${err}`)}
})
client.on("guildMemberRemove", async (member) => {
    try {
        await require("./handlers/GuildMemberRm")(member, client) 
    } catch(err) { if (!err.message.startsWith("ENOENT")) console.error(`GuildMemberRemove Err: ${err}`)}
})
client.login(process.env.Token)