import { ChatInputCommandInteraction, Collection, SlashCommandBuilder } from 'discord.js';

export interface CommandWrapper {
    name: string;
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export type SlashCommandHandler = () => Promise<unknown>;