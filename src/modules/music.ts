import PatchedModule from "../PatchedModule";
import { command, CommandClient, Context } from "@pikostudio/command.ts";
import { GuildMember, Message, Snowflake } from "discord.js";
import { MusicSubscription } from "../utils/music/subscription";
import {
    AudioPlayerStatus,
    AudioResource,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus
} from "@discordjs/voice";
import { Track } from "../utils/music/track";

class Music extends PatchedModule {
    private subscriptions: Map<Snowflake, MusicSubscription>;

    constructor(private client: CommandClient) {
        super(__filename);
        this.subscriptions = new Map<Snowflake, MusicSubscription>();
    }

    @command({
        aliases: ['시작'],
    })
    async join(msg: Message) {
        if (msg.guild) {
            let subscription = this.subscriptions.get(msg.guild.id);
            if (!subscription) {
                if (msg.member instanceof GuildMember && msg.member.voice.channel) {
                    const channel = msg.member.voice.channel;
                    subscription = new MusicSubscription(
                        joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator,
                        }),
                    );
                    subscription.voiceConnection.on('error', console.warn);
                    this.subscriptions.set(msg.guild.id, subscription);

                    if (!subscription) {
                        return await msg.reply('Join a voice channel and then try that again!');
                    }

                    try {
                        await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
                        return await msg.reply(`Joined channel <#!${channel.id}>!`);
                    } catch (error) {
                        console.warn(error);
                        return await msg.reply('Failed to join voice channel within 20 seconds, please try again later!');
                    }
                }
            } else {
                return await msg.reply('Already joined to a channel!');
            }
        }
    }

    @command({
        aliases: ['나가', '나가기', '종료'],
    })
    async leave(msg: Message) {
        if (msg.guild) {
            const subscription = this.subscriptions.get(msg.guild.id);
            if (subscription) {
                subscription.voiceConnection.destroy();
                this.subscriptions.delete(msg.guild.id);
                return await msg.reply('Left channel!');
            } else {
                return await msg.reply('Not playing in this server!');
            }
        }
    }

    @command({
        aliases: ['p', 'ㅔ', '재생'],
    })
    async play(ctx: Context) {
        const content = ctx.msg.content.slice(ctx.prefix.length).split(' ');
        content.shift();
        const message = content.join(' ');
        if (ctx.msg.guild && message.length > 0) {
            let subscription = this.subscriptions.get(ctx.msg.guild.id);
            if (!subscription) {
                if (ctx.msg.member instanceof GuildMember && ctx.msg.member.voice.channel) {
                    const channel = ctx.msg.member.voice.channel;
                    subscription = new MusicSubscription(
                        joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator,
                        }),
                    );
                    subscription.voiceConnection.on('error', console.warn);
                    this.subscriptions.set(ctx.msg.guild.id, subscription);

                }
            }

            if (!subscription) {
                return await ctx.msg.reply('Join a voice channel and then try that again!');
            }

            try {
                await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);

                try {
                    const track = await Track.from(message, {
                        onStart() {
                            ctx.msg.channel.send('Now Playing!').catch(console.warn);
                        },
                        onFinish() {
                            ctx.msg.channel.send('Now finished!').catch(console.warn);
                        },
                        onError(error) {
                            console.warn(error);
                            ctx.msg.channel.send(`Error: ${error.message}`).catch(console.warn);
                        },
                    });

                    subscription.enqueue(track);
                    await ctx.msg.reply(`Enqueued **${track.title}**`);
                } catch (error) {
                    console.warn(error);
                    await ctx.msg.reply('Failed to play track, please try again later!');
                }
            } catch (error) {
                console.warn(error);
                return await ctx.msg.reply('Failed to join voice channel within 20 seconds, please try again later!');
            }
        }
    }

    @command({
        aliases: ['q', '큐', '대기', '대기열'],
    })
    async queue(msg: Message) {
        if (msg.guild) {
            const subscription = this.subscriptions.get(msg.guild.id);
            if (subscription) {
                if (subscription.audioPlayer.state.status == AudioPlayerStatus.Idle) {
                    return await msg.reply('Nothing is currently playing!')
                } else {
                    return await msg.reply({
                        embeds: [{
                            title: `Playing **${(subscription.audioPlayer.state.resource as AudioResource<Track>).metadata.title}**`,
                            description: subscription.queue.slice(0, 5).map(
                                (track, index) => `${index + 1}) ${track.title}`
                            ).join('\n')
                        }],
                    })
                }
            } else {
                return await msg.reply('Not playing in this server!');
            }
        }
    }

    @command({
        aliases: ['res', 'resume', '일시정지', '재생'],
    })
    async pause(msg: Message) {
        if (msg.guild) {
            const subscription = this.subscriptions.get(msg.guild.id);
            if (subscription) {
                let content: string;
                if (subscription.audioPlayer.state.status === AudioPlayerStatus.Paused) {
                    subscription.audioPlayer.unpause()
                    content = "Unpaused song!"
                } else {
                    subscription.audioPlayer.pause()
                    content = "Paused song!"
                }
                return await msg.reply(content);
            } else {
                return await msg.reply('Not playing in this server!');
            }
        }
    }

    @command({
        aliases: ['s', 'ㄴ', '스킵'],
    })
    async skip(msg: Message) {
        if (msg.guild) {
            const subscription = this.subscriptions.get(msg.guild.id);
            if (subscription) {
                subscription.audioPlayer.stop();
                return await msg.reply('Skipped song!');
            } else {
                return await msg.reply('Not playing in this server!');
            }
        }
    }
}

export function install(client: CommandClient) {
    return new Music(client);
}