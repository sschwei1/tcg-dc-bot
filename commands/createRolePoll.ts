import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import { CommandWrapper } from '@customTypes';

import { memDb } from '@db/memDb';
import { buildRoleAssignmentEmbed } from '@utils/embedBuilder';

enum CreatePollParametersEnum {
    Channel = 'channel'
}

type CreatePollParameters = `${CreatePollParametersEnum}`;

const createRolePollCommand = new SlashCommandBuilder();
createRolePollCommand
    .setName('create-role-poll')
    .setDescription('Create embed where you can add roles to yourself via reactions.')
    .addChannelOption((option) =>
        option.setName(CreatePollParametersEnum.Channel)
            .setDescription('Channel to create the embed in.')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
    );

const execute = async (interaction: ChatInputCommandInteraction) => {
    const channel = interaction.options.getChannel(CreatePollParametersEnum.Channel);

    if(!(channel instanceof TextChannel)) {
        await interaction.reply('Channel is not a text channel.');
        return;
    }

    if(memDb.get(channel.id)) {
        await interaction.reply('Channel already has a role poll.');
        return;
    }

    const msg = await channel.send({
        embeds: [buildRoleAssignmentEmbed([])],
    });

    memDb.set(channel.id, {
        message: msg,
        reactionRoleAssignments: []
    });

    const reply = await interaction.deferReply();
    await reply.delete();
};

const command: CommandWrapper = {
    name: createRolePollCommand.name,
    data: createRolePollCommand,
    execute
};

export default command;