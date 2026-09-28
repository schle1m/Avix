import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { BotClient, Event } from "../types";

export async function loadEvents(client: BotClient) {
    const eventsPath = path.join(__dirname, "..", "events");
    const extension = path.extname(__filename);
    const files = await readdir(eventsPath, { withFileTypes: true });

    for (const file of files) {
        if (!file.isFile() || !file.name.endsWith(extension) || file.name.endsWith(".d.ts")) continue;

        const filePath = path.join(eventsPath, file.name)
        const imported = await import(pathToFileURL(filePath).href)
        const event = (imported.default?.default ?? imported.default) as Event;

        if (!event?.name || typeof event.execute !== "function") {
            throw new TypeError(`Invalid event module: ${filePath}`);
        }
        const listener = (...args: unknown[]) => {
            Promise.resolve(
                (event.execute as (...values: unknown[]) => unknown)(...args, client)
            ).catch(error => console.error(`Event ${String(event.name)} failed:`, error));
        };
        if (event.once) {
            client.once(event.name, listener);
        } else {
            client.on(event.name, listener);
        }
        console.log(`Loaded event: ${filePath}`);
    }
}
