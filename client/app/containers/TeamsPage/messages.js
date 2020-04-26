import { defineMessages } from 'react-intl';

export const scope = 'app.containers.TeamsPage';

export default defineMessages({
  teamNameHeader: {
    id: `${scope}.teamNameHeader`,
    defaultMessage: 'Team Name',
  },
  memberCountHeader: {
    id: `${scope}.memberCountHeader`,
    defaultMessage: '# Members',
  },
  ownerHeader: {
    id: `${scope}.ownerHeader`,
    defaultMessage: 'Owner',
  },
  createNewTeamLabel: {
    id: `${scope}.createNewTeamLabel`,
    defaultMessage: 'Create a new team',
  },
});
