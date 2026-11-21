import type {Command} from "../types";

module.exports = {
    cmd: {
        name: "credits", desc: "View Credits for the Bot"
    },
    async run(client, interaction) {
        const embed = client.Base().setTitle(`Credits for ${client.user.tag}`)
        .setDescription(`This is an Open Source Discord Bot written in Typescript using the 
        Discord.js Package.\nThis Bot uses Code from [Assisty](https://assisty.dev/)!\n
        The Source Code and Contributers can be viewed [Here](https://github.com/schle1m/Avix)
        \n\nSpecial Thanks to ${interaction.user} for Using the Bot!!!`)
        return interaction.reply({embeds: [embed]})
    }
} satisfies Command