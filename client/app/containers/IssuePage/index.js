import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import {
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';

// import history from 'utils/history';
import { Issue } from 'utils/sharedProps';
import { ROUTE_ISSUES } from 'containers/App/constants';
import { makeSelectCurrentIssue } from 'containers/App/selectors';

import messages from './messages';

export function IssuePage({ issue }) {
  const { formatMessage } = useIntl();

  if (!issue) {
    return <Redirect to={ROUTE_ISSUES} />;
  }

  return (
    <EuiPageContent>
      <EuiPageContentHeader>
        <EuiPageContentHeaderSection>
          <EuiTitle>
            <h2>{issue.shortDescription}</h2>
          </EuiTitle>
        </EuiPageContentHeaderSection>
      </EuiPageContentHeader>
      <EuiPageContentBody>
        <EuiTitle size="s">
          <h3>{formatMessage(messages.actionsTitle)}</h3>
        </EuiTitle>
        <p>TODO</p>
        <EuiSpacer />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}

IssuePage.propTypes = {
  issue: Issue,
};

const mapStateToProps = createStructuredSelector({
  issue: makeSelectCurrentIssue(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(IssuePage);
