import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import { CommandWrapper } from '@customTypes';

const clearChannelCommand = new SlashCommandBuilder();
clearChannelCommand
    .setName('clear-channel')
    .setDescription('Clears all messages in a channel.');

const execute = async (interaction: ChatInputCommandInteraction) => {
    interaction.channel?.messages.fetch()
        .then((messages) => {
            console.log(messages.size);
            messages.forEach(async (message) => {
                await message.delete();
            });
        });

    const reply = await interaction.deferReply();
    await reply.delete();
};

const command: CommandWrapper = {
    name: clearChannelCommand.name,
    data: clearChannelCommand,
    execute
};

export default command;