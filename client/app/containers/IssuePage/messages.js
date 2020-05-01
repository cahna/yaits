import { defineMessages } from 'react-intl';

export const scope = 'app.containers.IssuePage';

export default defineMessages({
  issuePageTitle: {
    id: `${scope}.issuePageTitle`,
    defaultMessage: 'Issue details',
  },
  shortDescriptionTitle: {
    id: `${scope}.shortDescriptionTitle`,
    defaultMessage: 'Short description',
  },
  descriptionTitle: {
    id: `${scope}.descriptionTitle`,
    defaultMessage: 'Details',
  },
  priorityTitle: {
    id: `${scope}.priorityTitle`,
    defaultMessage: 'Priority',
  },
  statusTitle: {
    id: `${scope}.statusTitle`,
    defaultMessage: 'Status',
  },
  assignedToTitle: {
    id: `${scope}.assignedToTitle`,
    defaultMessage: 'Assigned to',
  },
  createdByTitle: {
    id: `${scope}.createdByTitle`,
    defaultMessage: 'Created by',
  },
  dateUpdatedTitle: {
    id: `${scope}.dateUpdatedTitle`,
    defaultMessage: 'Last updated',
  },
  dateCreatedTitle: {
    id: `${scope}.dateCreatedTitle`,
    defaultMessage: 'Created',
  },
  submitCommentLabel: {
    id: `${scope}.submitCommentLabel`,
    defaultMessage: 'Submit',
  },
});
