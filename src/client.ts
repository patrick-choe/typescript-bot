import { CommandClient } from "@pikostudio/command.ts";
import { Constants, Intents, IntentsString, PartialTypes } from "discord.js";
import Dokdo from "dokdo";
import path from "path";
import * as fs from "fs";

import config from '../config.json';

export default class TypescriptClient extends CommandClient {
    constructor() {
        super(
            {
                allowedMentions: {
                    parse: ['users'],
                    roles: [],
                    users: [],
                    repliedUser: true,
                },
                partials: Object.keys(Constants.PartialTypes) as PartialTypes[],
                intents: Object.keys(Intents.FLAGS) as IntentsString[],
            }, {
                owners: ['544112328249966592', '628595345798201355', '729641977976586263', '310247242546151434'],
                prefix: config.prefix,
                rootPath: __dirname,
                slashCommands: {
                    guild: '841691775987089418',
                    autoRegister: true,
                },
            }
        );

        fs.readdirSync(path.join(__dirname, 'modules')).forEach((x: string) => {
            this.registry.loadModule(path.join('modules', x));
        });

        this.login(config.token).then(() => {
            console.log(`Logged in as ${this.user?.tag}`);

            const dokdo = new Dokdo(this, {
                noPerm(message) {
                    message.react('🚫');
                },
                owners: this.owners,
                prefix: config.prefix,
            });

            this.on('messageCreate', async message => {
                await dokdo.run(message);
            });
        });
    }
}