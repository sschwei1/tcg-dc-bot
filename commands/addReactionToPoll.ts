import { ChannelType, ChatInputCommandInteraction, Role, SlashCommandBuilder, TextChannel, parseEmoji } from 'discord.js';
import { CommandWrapper } from '@customTypes';

import { memDb } from '@db/memDb';
import { buildRoleAssignmentEmbed } from '@utils/embedBuilder';

enum AddRoleToPollParametersEnum {
    Channel = 'channel',
    Emoji = 'emoji',
    Role = 'role',
    Descriptoin = 'description'
}

type AddRoleToPollParameters = `${AddRoleToPollParametersEnum}`;

const addReactionToPollCommand = new SlashCommandBuilder();
addReactionToPollCommand
    .setName('add-reaction-to-poll')
    .setDescription('Adds a reaction to an existing poll')
    .addChannelOption((option) =>
        option.setName(AddRoleToPollParametersEnum.Channel)
            .setDescription('Channel in which an embed exists.')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
        option.setName(AddRoleToPollParametersEnum.Emoji)
            .setDescription('Emoji to add to the embed.')
            .setRequired(true)
    )
    .addRoleOption((option) =>
        option.setName(AddRoleToPollParametersEnum.Role)
            .setDescription('Role to add to the embed.')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option.setName(AddRoleToPollParametersEnum.Descriptoin)
            .setDescription('Description of the role.')
            .setRequired(true)
    );

const execute = async (interaction: ChatInputCommandInteraction) => {
    const channel = interaction.options.getChannel(AddRoleToPollParametersEnum.Channel);
    const emojiText = interaction.options.getString(AddRoleToPollParametersEnum.Emoji) || '';
    const role = interaction.options.getRole(AddRoleToPollParametersEnum.Role);
    const description = interaction.options.getString(AddRoleToPollParametersEnum.Descriptoin) || '';

    if(!(channel instanceof TextChannel)) {
        await interaction.reply('Channel is not a text channel.');
        return;
    }

    const entry = memDb.get(channel.id);

    if(!entry) {
        await interaction.reply('Channel has no role poll.');
        return;
    }

    if(!(role instanceof Role)) {
        await interaction.reply('Role is not a role.');
        return;
    }

    if(entry.reactionRoleAssignments.some((rra) => rra.role.id === role.id)) {
        await interaction.reply('Role already in use.');
        return;
    }

    const partEmoji = parseEmoji(emojiText);

    const emoji = partEmoji && !partEmoji?.id ?
        partEmoji.name :
        interaction.client.emojis.cache.find(em => em.name === partEmoji?.name)?.id;

    console.log(emojiText, partEmoji, emoji);

    if(!emoji) {
        await interaction.reply('Emoji was not found.');
        return;
    }

    if(entry.reactionRoleAssignments.some((rra) => rra.emojiName === emoji || rra.emojiId === emoji)) {
        await interaction.reply('Emoji already in use.');
        return;
    }

    entry.reactionRoleAssignments.push({
        emojiId: partEmoji?.id,
        emojiName: partEmoji?.name,
        role,
        description
    });

    await entry.message.react(emoji);
    entry.message.edit({
        embeds: [buildRoleAssignmentEmbed(entry.reactionRoleAssignments)],
    });

    const reply = await interaction.deferReply();
    await reply.delete();
};

const command: CommandWrapper = {
    name: addReactionToPollCommand.name,
    data: addReactionToPollCommand,
    execute
};

export default command;