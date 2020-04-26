import PropTypes from 'prop-types';

export const Toast = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  iconType: PropTypes.string,
});

export const IssueStatus = PropTypes.shape({
  uniqueId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ordering: PropTypes.number.isRequired,
});

export const Team = PropTypes.shape({
  name: PropTypes.string,
  slug: PropTypes.string,
  issueStatuses: PropTypes.arrayOf(IssueStatus).isRequired,
});

export const User = PropTypes.shape({
  username: PropTypes.string,
  uniqueId: PropTypes.string,
  teams: PropTypes.arrayOf(Team),
});

export const Issue = PropTypes.shape({
  uniqueId: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: IssueStatus.isRequired,
  createdBy: User.isRequired,
  assignedTo: User.isRequired,
  priority: PropTypes.number.isRequired,
  dateCreated: PropTypes.string.isRequired,
  dateUpdated: PropTypes.string.isRequired,
  teamSlug: PropTypes.string.isRequired,
});

export const IssueComment = PropTypes.shape({
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  user: User.isRequired,
});
