const {Client, IntentsBitField, GatewayIntentBits} = require("discord.js")
require("dotenv").config();
const client = new Client({
    intents: [ GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers ]
})
client.once("ready", async() => {
    console.log(`\nDiscord Bot is ready and logged in as ${client.user.tag}\n`)
})
client.login(process.env.Token)