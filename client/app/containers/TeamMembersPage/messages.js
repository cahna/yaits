import { defineMessages } from 'react-intl';

export const scope = 'app.containers.TeamPage';

export default defineMessages({
  owner: {
    id: `${scope}.owner`,
    defaultMessage: 'Owner',
  },
  usernameHeader: {
    id: `${scope}.usernameHeader`,
    defaultMessage: 'Username',
  },
  uniqueIdHeader: {
    id: `${scope}.uniqueIdHeader`,
    defaultMessage: 'User ID',
  },
  teamMembersTitle: {
    id: `${scope}.teamMembersTitle`,
    defaultMessage: 'Team Members',
  },
});
