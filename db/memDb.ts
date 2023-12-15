// this isj just used as temp replacement for an actual db

import { Emoji, Message, Role } from 'discord.js';

export type ReactionRoleAssignment = {
    emojiId?: string;
    emojiName?: string;
    role: Role;
    description: string;
}

export type ChannelData = {
    message: Message;
    reactionRoleAssignments: Array<ReactionRoleAssignment>;
}

// should be replaced with actual db in later stages
export const memDb = new Map<string, ChannelData>();