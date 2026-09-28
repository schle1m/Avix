import type { ChatInputCommandInteraction,Client, ClientEvents,  EmbedBuilder, SlashCommandBuilder, WebhookClient} from "discord.js"

export type BotClient = Client & {
    Base: () => EmbedBuilder,
    commands: Map<string, Command>,
    Loghook: WebhookClient | null
}
export type Event<K extends keyof ClientEvents = keyof ClientEvents> = {
    name: K,
    once?: boolean,
    execute: (...args: [...ClientEvents[K], BotClient]) => Promise<unknown> | unknown
}
export type Command = {
    cmd: {
        name: string,
        desc: string,
        build?: (cmd: SlashCommandBuilder) => unknown
    },
    run: (client: BotClient, interaction: ChatInputCommandInteraction) => Promise<unknown>
}
