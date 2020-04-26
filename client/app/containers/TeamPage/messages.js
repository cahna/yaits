import { defineMessages } from 'react-intl';

export const scope = 'app.containers.TeamPage';

export default defineMessages({
  owner: {
    id: `${scope}.owner`,
    defaultMessage: 'Owner',
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
    defaultMessage: 'View and manage team members.',
  },
  manageTeamTitle: {
    id: `${scope}.manageTeamTitle`,
    defaultMessage: 'Settings',
  },
  manageTeamDescription: {
    id: `${scope}.manageTeamDescription`,
    defaultMessage: 'Configure team settings.',
  },
});
