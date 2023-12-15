import { Collection } from 'discord.js';
import { CommandWrapper } from '@customTypes';

import CreateRolePollCommand from './createRolePoll';
import ClearChannelCommand from './clearChannel';
import AddReactionToPollCOmmand from './addReactionToPoll';

const commands = new Collection<string, CommandWrapper>();

commands.set(CreateRolePollCommand.name, CreateRolePollCommand);
commands.set(ClearChannelCommand.name, ClearChannelCommand);
commands.set(AddReactionToPollCOmmand.name, AddReactionToPollCOmmand);

export default commands;