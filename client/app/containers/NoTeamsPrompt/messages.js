import { defineMessages } from 'react-intl';

export const scope = 'app.containers.NoTeamsPrompt';

export default defineMessages({
  noTeamsTitle: {
    id: `${scope}.noTeamsTitle`,
    defaultMessage: 'You are not a member of any teams.',
  },
  noTeamsInfo: {
    id: `${scope}.noTeamsInfo`,
    defaultMessage: 'Issues are tracked on a per-team basis in YAITS.',
  },
  pleaseSetupATeam: {
    id: `${scope}.pleaseSetupATeam`,
    defaultMessage:
      'Please create a team or accept an invitation to join an existing team.',
  },
  createTeamButton: {
    id: `${scope}.createTeamButton`,
    defaultMessage: 'Create Team',
  },
});
