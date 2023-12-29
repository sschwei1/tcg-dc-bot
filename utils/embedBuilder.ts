import { ReactionRoleAssignment } from '@db/memDb';
import { EmbedBuilder } from 'discord.js';

const getEmojiString = (emojiName?: string, emojiId?: string) => {
    if(emojiId) return `<:${emojiName}:${emojiId}>`;
    else return emojiName;
}

export const buildRoleAssignmentEmbed = (roles: Array<ReactionRoleAssignment>) => {
    return new EmbedBuilder()
       .setTitle('Role Assignment')
       .setDescription('Use reactions to assing/remove roles.')
       .setColor('#f2cd66')
       .addFields([{
            name: 'Available Roles: ',
            value: roles.map((role) => `${getEmojiString(role.emojiName, role.emojiId)}  >> ${role.role}`).join('\n') || 'No roles available',
        }])
       .setTimestamp()
       .setFooter({ text: 'Role Assignment Bot by lasgce' });
}