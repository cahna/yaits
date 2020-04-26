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
  actionsTitle: {
    id: `${scope}.actionsTitle`,
    defaultMessage: 'Actions',
  },
  viewTeamIssuesTitle: {
    id: `${scope}.viewTeamIssuesTitle`,
    defaultMessage: 'Issues',
  },
  viewTeamIssuesDescription: {
    id: `${scope}.viewTeamIssuesDescription`,
    defaultMessage: "View and manage your teams' issues.",
  },
  manageMembersTitle: {
    id: `${scope}.manageMembersTitle`,
    defaultMessage: 'Members',
  },
  manageMembersDescription: {
    id: `${scope}.manageMembersDescription`,
    defaultMessage: 'Manage team members.',
  },
});
