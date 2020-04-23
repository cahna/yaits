import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { EuiSideNav, EuiIcon } from '@elastic/eui';

import { User, Team } from 'utils/sharedProps';
import history from 'utils/history';
import { ROUTE_TEAMS, ROUTE_CREATE_TEAM } from 'containers/App/constants';
import { logoutUser } from 'containers/App/actions';
import {
  makeSelectCurrentUser,
  makeSelectActiveTeam,
} from 'containers/App/selectors';
import { DEFAULT_WIDTH } from './constants';
import messages from './messages';

export function SideNav({
  width = DEFAULT_WIDTH,
  currentUser,
  activeTeam,
  handleLogoutUser,
}) {
  const { formatMessage } = useIntl();
  const items = useMemo(() => {
    if (!currentUser || !currentUser.uniqueId) {
      return [];
    }

    return [
      {
        name: formatMessage(messages.teamsNavHeader),
        id: messages.teamsNavHeader.id,
        icon: <EuiIcon type="users" />,
        items: [
          ...(currentUser.teams || []).map(({ name, slug }) => ({
            name,
            id: slug,
            onClick: () => history.push(`${ROUTE_TEAMS}/${slug}`),
          })),
          {
            name: formatMessage(messages.createTeamButton),
            id: messages.createTeamButton.id,
            icon: <EuiIcon type="plusInCircle" />,
            onClick: () => history.push(ROUTE_CREATE_TEAM),
          },
        ],
      },
      {
        name: currentUser.username,
        id: currentUser.uniqueId,
        icon: <EuiIcon type="user" />,
        items: [
          {
            name: formatMessage(messages.logoutButtonLabel),
            id: messages.logoutButtonLabel.id,
            onClick: handleLogoutUser,
          },
        ],
      },
    ];
  }, [currentUser, activeTeam, handleLogoutUser]);

  return <EuiSideNav style={{ width }} items={items} />;
}

SideNav.propTypes = {
  width: PropTypes.number,
  currentUser: User.isRequired,
  activeTeam: Team.isRequired,
  handleLogoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  activeTeam: makeSelectActiveTeam(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleLogoutUser: (evt) => {
      if (evt !== undefined && evt.preventDefault) {
        evt.preventDefault();
      }
      dispatch(logoutUser());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SideNav);
