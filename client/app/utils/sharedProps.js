import PropTypes from 'prop-types';

export const Team = PropTypes.shape({
  name: PropTypes.string,
  slug: PropTypes.string,
});

export const User = PropTypes.shape({
  username: PropTypes.string,
  uniqueId: PropTypes.string,
  teams: PropTypes.arrayOf(Team),
});
