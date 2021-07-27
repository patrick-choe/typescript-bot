import PatchedModule from "../PatchedModule";
import { slashCommand } from "@pikostudio/command.ts";
import { CommandInteraction, CommandInteractionOptionResolver } from "discord.js";

class Slash extends PatchedModule {
    constructor() {
        super(__filename);
    }

    @slashCommand({
        name: 'slash',
        description: 'slash command test',
        options: [
            {
                type: "STRING",
                name: 'slash',
                description: '오옹! <slash>',
                required: true,
            },
        ],
    })
    async slash(interaction: CommandInteraction, option: CommandInteractionOptionResolver) {
        await interaction.reply({
            content: `오옹 ${option.getString('slash')}`,
        });
    }
}

export function install() {
    return new Slash();
}