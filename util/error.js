const { EmbedBuilder, codeBlock } = require("discord.js");
const util = require("util");
/*
    THIS IS ONLY USED FOR TESTING, DISABLING THIS WILL CAUSE LOGGING TO BE Off
*/
const debug = false //keep as false

//Whole webhook handling for errs
module.exports = function ErrorHandler(webhook) {
    async function sendError(type, error) {
        console.error(`New ${type}\n ${error}`)
        if (debug) return;
        try {
            const embed = new EmbedBuilder().setColor("DarkRed").setTitle(`New ${type}`).setTimestamp()
            if (error instanceof Error) {
                embed.addFields(
                    { name: "Message", value: codeBlock((error.message ?? "No message").slice(0, 1000)) },
                    { name: "Stack", value: codeBlock((error.stack ?? "No stack").slice(0, 1016)) }
                )
            } else {
                embed.setDescription(codeBlock(util.inspect(error, { depth: 5 }).slice(0, 4000)))
            }
            if (webhook) {
                await webhook.send({ embeds: [embed] })
            }
        } catch (err) {
            console.error("Failed to send error webhook:", err);
        }
    }
    process.on("uncaughtException", async err => {
        await sendError("Uncaught Exception", err);
        process.exit(1)
    })
    process.on("unhandledRejection", async reason => {
        await sendError("Unhandled Rejection", reason);
    })
    process.on("warning", async warning => {
        await sendError("Node Warning", warning);
    })
    return { sendError };
};