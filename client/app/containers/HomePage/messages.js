import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.HomePage';

export default defineMessages({
  pageTitle: {
    id: `${scope}.pageTitle`,
    defaultMessage: 'YAITS',
  },
  pageDescription: {
    id: `${scope}.pageDescription`,
    defaultMessage: 'Yet Another Issue Tracking Service',
  },
  header: {
    id: `${scope}.header`,
    defaultMessage: 'What have you made?',
  },
  logoutButtonLabel: {
    id: `${scope}.logoutButtonLabel.message`,
    defaultMessage: 'Logout',
  },
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
  teamsNavHeader: {
    id: `${scope}.sideNav.teamsNavHeader`,
    defaultMessage: 'Teams',
  },
  createTeamButton: {
    id: `${scope}.createTeamButton`,
    defaultMessage: 'Create Team',
  },
});
