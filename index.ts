const {Client, GatewayIntentBits, EmbedBuilder, WebhookClient} = require("discord.js")
require("dotenv").config();
const fs = require("fs")
const path= require("path")
import type {BotClient, Command} from "./types"

const client = new Client({
    intents: [ GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds ]
}) as BotClient
const {loadEvents} = require("./util/loadEvnts")
client.Loghook = process.env.LogHook ? new WebhookClient({url: process.env.LogHook}) : null
require("./util/error")(client.Loghook)
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
client.commands = new Map();

function loadCommands(dir: string, map: Map<string, Command>) {
    fs.readdirSync(dir).forEach((file: string) => {
        const fullPath = path.join(dir, file)
        if (fs.statSync(fullPath).isDirectory()) {
            loadCommands(fullPath, map);
            return;
        }
        if (!file.endsWith(".ts") && !file.endsWith(".js")) return;
        const command: Command = require(path.resolve(fullPath));
        map.set(command.cmd.name, command);
        console.log(`Loaded: ${fullPath}`);
    });
}
loadCommands("./slashcmds", client.commands);

async function start() {
    await loadEvents(client)
    await client.login(process.env.Token)
}

void start()
