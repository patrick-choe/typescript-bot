import { command } from "@pikostudio/command.ts";
import { Message } from "discord.js";
import PatchedModule from "../PatchedModule";

class Factor extends PatchedModule {
    constructor() {
        super(__filename);
    }

    @command()
    async factor(msg: Message) {
        const message = msg.content.split(' ')[1];

        let factors: number[] = [];

        let integer = parseInt(message) || 0;

        if (integer < 2 || integer > 2 ** 31 - 1) {
            await msg.channel.send(`\`Invalid number: ${message}\``);
        } else {
            let trial: number = 2;

            while (integer > 1) {
                if (integer % trial === 0) {
                    integer /= trial;
                    factors.push(trial);
                } else {
                    trial++;
                }
            }

            await msg.channel.send(`\`factors of ${message}: ${factors.join(", ")}\``);
        }
    }
}

export function install() {
    return new Factor();
}