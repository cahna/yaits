import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { EuiEmptyPrompt, EuiButton } from '@elastic/eui';

import history from 'utils/history';
import { ROUTE_CREATE_TEAM } from 'containers/App/constants';

import messages from './messages';

const NoTeamsPrompt = () => {
  const { formatMessage } = useIntl();

  return (
    <EuiEmptyPrompt
      iconType="indexManagementApp"
      title={<h2>{formatMessage(messages.noTeamsTitle)}</h2>}
      body={
        <>
          <p>
            <FormattedMessage {...messages.noTeamsInfo} />
          </p>
          <p>
            <FormattedMessage {...messages.pleaseSetupATeam} />
          </p>
        </>
      }
      actions={
        <EuiButton
          color="primary"
          fill
          onClick={() => history.push(ROUTE_CREATE_TEAM)}
        >
          <FormattedMessage {...messages.createTeamButton} />
        </EuiButton>
      }
    />
  );
};

export default NoTeamsPrompt;
