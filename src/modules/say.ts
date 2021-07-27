import PatchedModule from "../PatchedModule";
import { command, CommandClient, Context } from "@pikostudio/command.ts";
import { Message, MessageActionRow, MessageButton, TextChannel, ThreadChannel } from "discord.js";

class Say extends PatchedModule {
    constructor(private client: CommandClient) {
        super(__filename);
    }

    @command({
        aliases: ['speak', 'ㅁ', '말', '말하기']
    })
    async say(ctx: Context) {
        if (ctx.msg.author.bot) {
            return;
        }
        const content = ctx.msg.content.slice(ctx.prefix.length).split(' ');
        content.shift();
        await ctx.msg.channel.send({
            content: content.join(' '),
            allowedMentions: {
                parse: [],
                roles: [],
                users: [],
                repliedUser: true,
            }
        })
    }

    @command()
    async thread(ctx: Context) {
        let thread: ThreadChannel | undefined;
        if (ctx.msg.channel instanceof TextChannel) {
            const content = ctx.msg.content.slice(ctx.prefix.length).split(' ');
            content.shift();
            thread = await ctx.msg.channel.threads.create({
                name: content.join(' '),
                autoArchiveDuration: 10080,
            });
        } else if (ctx.msg.channel instanceof ThreadChannel) {
            const content = ctx.msg.content.slice(ctx.prefix.length).split(' ');
            content.shift();
            thread = await ctx.msg.channel.parent?.threads.create({
                name: content.join(' '),
                autoArchiveDuration: 10080,
            });
        }

        return thread?.send(`<@!${ctx.msg.author.id}>`);
    }

    @command({
        aliases: ['buttons', '버튼']
    })
    async button(msg: Message) {
        const message = await msg.channel.send({
            content: "버튼들이에여!",
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton({
                        customId: 'primary',
                        style: 'PRIMARY',
                        label: 'Primary',
                    }),
                    new MessageButton({
                        customId: 'secondary',
                        style: 'SECONDARY',
                        label: 'Secondary',
                    }),
                    new MessageButton({
                        customId: 'success',
                        style: 'SUCCESS',
                        label: 'Success',
                    }),
                    new MessageButton({
                        customId: 'danger',
                        style: 'DANGER',
                        label: 'Danger',
                    }),
                    new MessageButton({
                        style: 'LINK',
                        label: 'Link',
                        url: 'https://github.com/patrick-choe',
                    }),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton({
                        customId: 'primary',
                        style: 'PRIMARY',
                        label: 'Primary',
                    }),
                    new MessageButton({
                        customId: 'secondary',
                        style: 'SECONDARY',
                        label: 'Secondary',
                    }),
                    new MessageButton({
                        customId: 'success',
                        style: 'SUCCESS',
                        label: 'Success',
                    }),
                    new MessageButton({
                        customId: 'danger',
                        style: 'DANGER',
                        label: 'Danger',
                    }),
                    new MessageButton({
                        style: 'LINK',
                        label: 'Link',
                        url: 'https://github.com/patrick-choe',
                    }),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton({
                        customId: 'primary',
                        style: 'PRIMARY',
                        label: 'Primary',
                    }),
                    new MessageButton({
                        customId: 'secondary',
                        style: 'SECONDARY',
                        label: 'Secondary',
                    }),
                    new MessageButton({
                        customId: 'success',
                        style: 'SUCCESS',
                        label: 'Success',
                    }),
                    new MessageButton({
                        customId: 'danger',
                        style: 'DANGER',
                        label: 'Danger',
                    }),
                    new MessageButton({
                        style: 'LINK',
                        label: 'Link',
                        url: 'https://github.com/patrick-choe',
                    }),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton({
                        customId: 'primary',
                        style: 'PRIMARY',
                        label: 'Primary',
                    }),
                    new MessageButton({
                        customId: 'secondary',
                        style: 'SECONDARY',
                        label: 'Secondary',
                    }),
                    new MessageButton({
                        customId: 'success',
                        style: 'SUCCESS',
                        label: 'Success',
                    }),
                    new MessageButton({
                        customId: 'danger',
                        style: 'DANGER',
                        label: 'Danger',
                    }),
                    new MessageButton({
                        style: 'LINK',
                        label: 'Link',
                        url: 'https://github.com/patrick-choe',
                    }),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton({
                        customId: 'primary',
                        style: 'PRIMARY',
                        label: 'Primary',
                    }),
                    new MessageButton({
                        customId: 'secondary',
                        style: 'SECONDARY',
                        label: 'Secondary',
                    }),
                    new MessageButton({
                        customId: 'success',
                        style: 'SUCCESS',
                        label: 'Success',
                    }),
                    new MessageButton({
                        customId: 'danger',
                        style: 'DANGER',
                        label: 'Danger',
                    }),
                    new MessageButton({
                        style: 'LINK',
                        label: 'Link',
                        url: 'https://github.com/patrick-choe',
                    }),
                ),
            ],
        });
        try {
            message.awaitMessageComponent({
                componentType: 'BUTTON',
                filter: (i) => i.customId === 'primary' && i.user.id === msg.author.id,
            }).then(async interaction => {
                await interaction.update('Wa Sans!');
            });
            message.awaitMessageComponent({
                componentType: 'BUTTON',
                filter: (i) => i.customId === 'secondary' && i.user.id === msg.author.id,
            }).then(async interaction => {
                await interaction.update('Wa Papyrus!');
            });
            message.awaitMessageComponent({
                componentType: 'BUTTON',
                filter: (i) => i.customId === 'success' && i.user.id === msg.author.id,
            }).then(async interaction => {
                await interaction.reply({
                    content: `<@!${msg.author.id}> 성공!`,
                    ephemeral: true,
                });
            });
            message.awaitMessageComponent({
                componentType: 'BUTTON',
                filter: (i) => i.customId === 'danger' && i.user.id === msg.author.id,
            }).then(async interaction => {
                await interaction.update({
                    content: 'Terminated.',
                    components: [],
                });
                await message.delete();
            });
        } catch {
            await message.edit({
                components: [],
            });
        }
    }
}

export function install(client: CommandClient) {
    return new Say(client);
}