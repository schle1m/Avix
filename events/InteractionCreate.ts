import type {Event} from "../types"

export default {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) {
                await interaction.reply("Command not Found in the `slashcmds` Folder.")
                return;
            }
            await command.run(client, interaction)
        }
    }
} satisfies Event<"interactionCreate">
