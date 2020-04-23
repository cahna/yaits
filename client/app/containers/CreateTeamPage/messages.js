/*
 * CreateTeamPage Messages
 *
 * This contains all the text for the CreateTeamPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CreateTeamPage';

export default defineMessages({
  createTeamPageTitle: {
    id: `${scope}.createTeamPageTitle`,
    defaultMessage: 'Create a Team',
  },
  createTeamPageDescription: {
    id: `${scope}.createTeamPageDescription`,
    defaultMessage: 'Create a new team to begin issue tracking',
  },
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Create a new team',
  },
  teamNameLabel: {
    id: `${scope}.teamNameLabel`,
    defaultMessage: 'Team name',
  },
  createTeamLabel: {
    id: `${scope}.createTeamLabel`,
    defaultMessage: 'Create Team',
  },
  createTeamFailedTitle: {
    id: `${scope}.toast.createTeamLabel`,
    defaultMessage: 'Create team failed',
  },
  createTeamFailedText: {
    id: `${scope}.toast.createTeamFailedText`,
    defaultMessage: 'There was a problem creating your team.',
  },
});
