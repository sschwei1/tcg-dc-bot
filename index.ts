import { Client, Events, GatewayIntentBits } from 'discord.js';
import commands from '@commands';

import { memDb } from '@db/memDb';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, (interaction) => {
    console.log('interaction received');

    if(!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if(!command) {
        console.log(`Command ${interaction.commandName} not found`);
        return;
    };

    command.execute(interaction)
        .catch(async (error) => {
            console.error(error);
            interaction.reply('There was an error while executing this command!');
        });
});

client.on(Events.MessageReactionAdd, (reaction, user) => {
    const entry = memDb.get(reaction.message.channel.id);

    if(user.bot === true) return;
    if(!entry || entry.message.id !== reaction.message.id) return;

    const reactionRoleAssignments = entry.reactionRoleAssignments
        .find((rra) =>
            rra.emojiName === reaction.emoji.name ||
            rra.emojiId === reaction.emoji.id
        );

    if(reactionRoleAssignments) {
        reaction.message.guild?.members.fetch(reaction.users.cache.last()?.id || '')
            .then((member) => {
                member.roles.add(reactionRoleAssignments.role);
            });
    }
});

client.on(Events.MessageReactionRemove, (reaction, user) => {
    const entry = memDb.get(reaction.message.channel.id);

    if(user.bot === true) return;
    if(!entry || entry.message.id !== reaction.message.id) return;

    const reactionRoleAssignments = entry.reactionRoleAssignments
        .find((rra) =>
            rra.emojiName === reaction.emoji.name ||
            rra.emojiId === reaction.emoji.id
        );

    if(reactionRoleAssignments) {
        reaction.message.guild?.members.fetch(user.id || '')
            .then((member) => {
                console.log(member.displayName);
                member.roles.remove(reactionRoleAssignments.role);
            });
    }
});

client.login(process.env.DISCORD_TOKEN);