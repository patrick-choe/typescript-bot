import PatchedModule from "../PatchedModule";
import { command, CommandClient } from "@pikostudio/command.ts";
import { Message, MessageEmbed } from "discord.js";

class Tools extends PatchedModule {
    constructor(private client: CommandClient) {
        super(__filename);
    }

    @command({
        aliases: ['ㅍ', '핑']
    })
    async ping(msg: Message) {
        const reply = await msg.reply({
            embeds: [
                new MessageEmbed({
                    title: '🏓 Pong!',
                }),
            ],
        });
        return await reply.edit({
            embeds: [
                new MessageEmbed({
                    title: '🏓 Pong!',
                    description: `Current ping: ${this.client.ws.ping}, Current message latency: ${reply.createdTimestamp - msg.createdTimestamp}`,
                }),
            ],
        });
    }
}

export function install(client: CommandClient) {
    return new Tools(client);
}