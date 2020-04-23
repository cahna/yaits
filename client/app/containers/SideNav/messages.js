/*
 * SideNav Messages
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.SideNav';

export default defineMessages({
  logoutButtonLabel: {
    id: `${scope}.logoutButtonLabel.message`,
    defaultMessage: 'Logout',
  },
  teamsNavHeader: {
    id: `${scope}.teamsNavHeader`,
    defaultMessage: 'Teams',
  },
  createTeamButton: {
    id: `${scope}.createTeamButton`,
    defaultMessage: 'Create Team',
  },
});
