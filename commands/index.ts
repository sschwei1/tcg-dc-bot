import { Collection } from 'discord.js';
import { CommandWrapper } from '@customTypes';

import CreateRolePollCommand from './createRolePoll';
import ClearChannelCommand from './clearChannel';
import AddReactionToPollCommand from './addReactionToPoll';
import ConnectToExistingMessageCommand from './connectToExistingMessage';

const commands = new Collection<string, CommandWrapper>();

commands.set(CreateRolePollCommand.name, CreateRolePollCommand);
commands.set(ClearChannelCommand.name, ClearChannelCommand);
commands.set(AddReactionToPollCommand.name, AddReactionToPollCommand);
commands.set(ConnectToExistingMessageCommand.name, ConnectToExistingMessageCommand);

export default commands;