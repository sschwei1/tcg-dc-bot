import { CommandWrapper } from '@customTypes';
import { ChatInputCommandInteraction, parseEmoji, SlashCommandBuilder, TextChannel } from 'discord.js';

import { memDb } from '@db/memDb';

enum ConnectToExistingMessageParametersEnum {
    Channel = 'channel',
    MessageId = 'message-id'
}

type ConnectToExistingMessageParameters = `${ConnectToExistingMessageParametersEnum}`;

const connectToExistingMessageCommand = new SlashCommandBuilder();
connectToExistingMessageCommand
    .setName('connect-to-existing-message')
    .setDescription('Connects to an existing message with reaction roles.')
    .addChannelOption((option) =>
        option.setName(ConnectToExistingMessageParametersEnum.Channel)
            .setDescription('ID of the channel where the message is located.')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option.setName(ConnectToExistingMessageParametersEnum.MessageId)
            .setDescription('ID of the message to connect to.')
            .setRequired(true)
    );

const execute = async (interaction: ChatInputCommandInteraction) => {
    const channel = interaction.options.getChannel(ConnectToExistingMessageParametersEnum.Channel);
    const messageId = interaction.options.getString(ConnectToExistingMessageParametersEnum.MessageId);

    if(!(channel instanceof TextChannel)) {
        await interaction.reply('Channel is not a text channel.');
        return;
    }

    if(!messageId) {
        await interaction.reply('Message ID is missing.');
        return;
    }

    const message = await channel.messages.fetch(messageId);

    if(message.embeds.length === 0) {
        await interaction.reply('Given message has no embeds.');
        return;
    }

    const embed = message.embeds[0];
    const embedData = embed.fields[0]?.value;

    if(!embedData) {
        await interaction.reply('Given message contains invalid values');
        return;
    }

    memDb.set(channel.id, {
        message: message,
        reactionRoleAssignments: []
    });

    const entry = memDb.get(channel.id)!;

    const reactionLines = embedData.split('\n');
    const reactionPromises = reactionLines.map(async (line) => {
        const [emoji, roleMention] = line.split('>>').map((part) => part.trim());
        const partEmoji = parseEmoji(emoji);

        const roleMentionRegex = /<@&(\d+)>/;
        const roleId = roleMention.match(roleMentionRegex)![1];
        const role = await channel.guild.roles.fetch(roleId);

        if(!role) {
            await interaction.channel?.send(`Role with ID ${roleId} not found.`);
            return;
        }

        console.log(partEmoji);
        console.log(role?.name);

        entry.reactionRoleAssignments.push({
            emojiId: partEmoji?.id,
            emojiName: partEmoji?.name,
            role
        });
    });

    await Promise.all(reactionPromises);

    const reply = await interaction.deferReply();
    await reply.delete();
}
                                                                                                                                                                                    
const command: CommandWrapper = {
    name: connectToExistingMessageCommand.name,
    data: connectToExistingMessageCommand,
    execute
}

export default command;