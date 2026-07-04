const {EmbedBuilder} = require("discord.js")
function base() {
    const embed= new EmbedBuilder().setColor("").setFooter({text: "", iconURL: ""})
    return embed;
}
module.exports = {base}
//Once you have your Embed set rename this file to base.js