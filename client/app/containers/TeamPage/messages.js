import { defineMessages } from 'react-intl';

export const scope = 'app.containers.TeamPage';

export default defineMessages({
  loadingTeam: {
    id: `${scope}.loadingTeam`,
    defaultMessage: 'Loading team data...',
  },
  owner: {
    id: `${scope}.owner`,
    defaultMessage: 'Owner',
  },
});
