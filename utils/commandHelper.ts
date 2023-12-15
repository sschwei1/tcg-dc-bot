import { CommandWrapper } from '@customTypes';
import { Collection, Routes, REST } from 'discord.js';

const updateSlashCommands = (commands: Collection<string, CommandWrapper>) => {
    const token = process.env.DISCORD_TOKEN || '';
    const clientId = process.env.DISCORD_CLIENT_ID || '';
    const guildId = process.env.DISCORD_GUILD_ID || '';

    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands.map((c) => c.data.toJSON()) },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
};

export const registerSlashCommands = (commands: Collection<string, CommandWrapper>) => {
    updateSlashCommands(commands);
}

export const removeSlashCommands = () => {
    updateSlashCommands(new Collection());
}