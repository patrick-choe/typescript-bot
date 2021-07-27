import { command, CommandClient, Context, DebugModule, ownerOnly } from "@pikostudio/command.ts";
import { DMChannel, Message, NewsChannel, TextChannel, ThreadChannel } from "discord.js";
import TypescriptClient from "../client";
import PatchedModule from "../PatchedModule";
import { performance } from "perf_hooks";
import chalk from "chalk";
import { betterEval } from "../utils/math";

class Dev extends PatchedModule {
    constructor(private client: CommandClient) {
        super(__filename);
    }

    @command({ aliases: ['rl', 'ㄹ', '리로드'] })
    @ownerOnly
    reload(ctx: Context) {
        return DebugModule.run(new Context(new Message(ctx.msg.client, {
            id: ctx.msg.id,
            content: `${ctx.prefix}dev reload ~`,
        }, ctx.msg.channel), ctx.prefix));
    }

    @command({ aliases: ['evl', 'ev', '이발'] })
    @ownerOnly
    eval(ctx: Context) {
        const content = ctx.msg.content.slice(ctx.prefix.length).split(' ');
        content.shift();
        console.log(betterEval(content.join(' ')));
        return DebugModule.run(new Context(new Message(ctx.msg.client, {
            id: ctx.msg.id,
            content: `${ctx.prefix}dev eval ${betterEval(content.join(' '))}`,
            author: ctx.msg.author,
        }, ctx.msg.channel), ctx.prefix));
    }

    @command()
    @ownerOnly
    dev(ctx: Context) {
        return DebugModule.run(ctx);
    }

    @command({ aliases: ['rb', '리붓', '리부트'] })
    @ownerOnly
    reboot(msg: Message) {
        const timestamp = performance.now();
        this.client.destroy();
        Object.keys(require.cache).forEach((cacheKey) => {
            if (cacheKey.endsWith('.ts')) {
                console.log(`${chalk.blue('[INFO]')} Cache '${cacheKey}' removed.`);
                delete require.cache[cacheKey];
            }
        });
        const x = require('../client').default;
        const client: TypescriptClient = new x();
        client.on('ready', client => {
            const time = Math.floor(performance.now() - timestamp);
            client.channels.fetch(msg.channel.id, {
                cache: false,
            }).then(async channel => {
                await (channel as TextChannel | DMChannel | NewsChannel | ThreadChannel).send({
                    content: `Rebooted! (Took ${time} ms)`,
                    reply: {
                        messageReference: msg,
                        failIfNotExists: false,
                    }
                });
            });
        });
    }
}

export function install(client: CommandClient) {
    return new Dev(client);
}