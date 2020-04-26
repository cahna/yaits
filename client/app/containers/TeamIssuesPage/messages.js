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
  issueShortDescription: {
    id: `${scope}.shortDescription`,
    defaultMessage: 'Short Description',
  },
  issueAssignedTo: {
    id: `${scope}.issueAssignedTo`,
    defaultMessage: 'Assigned to',
  },
  issueCreatedBy: {
    id: `${scope}.issueCreatedBy`,
    defaultMessage: 'Created by',
  },
  issueDateCreated: {
    id: `${scope}.issueDateCreated`,
    defaultMessage: 'Created',
  },
  issueDateUpdated: {
    id: `${scope}.issueDateUpdated`,
    defaultMessage: 'Updated',
  },
  issueStatus: {
    id: `${scope}.issueStatus`,
    defaultMessage: 'Status',
  },
  issuePriority: {
    id: `${scope}.issuePriority`,
    defaultMessage: 'Priority',
  },
  issuePriorityHelpText: {
    id: `${scope}.issuePriorityHelpText`,
    defaultMessage: 'Set priority level for issue',
  },
  noIssuesTitle: {
    id: `${scope}.noIssuesTitle`,
    defaultMessage: 'No issues, yet...',
  },
  noIssuesInfo: {
    id: `${scope}.noIssuesInfo`,
    defaultMessage: "Create the team's first issue to get started!",
  },
  newIssue: {
    id: `${scope}.newIssue`,
    defaultMessage: 'New Issue',
  },
  cancelNewIssue: {
    id: `${scope}.cancelNewIssue`,
    defaultMessage: 'Cancel',
  },
  saveNewIssue: {
    id: `${scope}.saveNewIssue`,
    defaultMessage: 'Save',
  },
  reloadData: {
    id: `${scope}.reloadData`,
    defaultMessage: 'Reload data',
  },
  actionsHeader: {
    id: `${scope}.actionsHeader`,
    defaultMessage: 'Actions',
  },
  deleteIssueAction: {
    id: `${scope}.deleteIssueAction`,
    defaultMessage: 'Delete',
  },
  deleteIssueActionDesc: {
    id: `${scope}.deleteIssueActionDesc`,
    defaultMessage: 'Delete this issue',
  },
  editIssueAction: {
    id: `${scope}.editIssueAction`,
    defaultMessage: 'Edit',
  },
  editIssueActionDesc: {
    id: `${scope}.editIssueActionDesc`,
    defaultMessage: 'Edit this issue',
  },
});
