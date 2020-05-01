import React, { memo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import {
  EuiButton,
  EuiCommentList,
  EuiDescriptionList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiHorizontalRule,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiSpacer,
  EuiText,
  EuiTextArea,
  EuiTitle,
} from '@elastic/eui';

// import history from 'utils/history';
import { Issue } from 'utils/sharedProps';
import { ROUTE_ISSUES } from 'containers/App/constants';
import { makeSelectCurrentIssue } from 'containers/App/selectors';

import messages from './messages';

export function IssuePage({ issue }) {
  const { formatMessage, formatDate } = useIntl();

  if (!issue) {
    return <Redirect to={ROUTE_ISSUES} />;
  }

  const dateUpdated = formatDate(new Date(issue.dateUpdated));
  const dateCreated = formatDate(new Date(issue.dateCreated));

  return (
    <EuiPageContent>
      <EuiPageContentHeader>
        <EuiPageContentHeaderSection>
          <EuiTitle>
            <h2>{formatMessage(messages.issuePageTitle)}</h2>
          </EuiTitle>
        </EuiPageContentHeaderSection>
      </EuiPageContentHeader>
      <EuiPageContentBody>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiDescriptionList
              listItems={[
                {
                  title: formatMessage(messages.shortDescriptionTitle),
                  description: issue.shortDescription,
                },
                {
                  title: formatMessage(messages.descriptionTitle),
                  description: issue.shortDescription,
                },
              ]}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiDescriptionList
                  listItems={[
                    {
                      title: formatMessage(messages.statusTitle),
                      description: issue.status.name,
                    },
                    {
                      title: formatMessage(messages.assignedToTitle),
                      description: issue.assignedTo.username,
                    },
                    {
                      title: formatMessage(messages.createdByTitle),
                      description: issue.createdBy.username,
                    },
                  ]}
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiDescriptionList
                  listItems={[
                    {
                      title: formatMessage(messages.priorityTitle),
                      description: issue.priority,
                    },
                    {
                      title: formatMessage(messages.dateUpdatedTitle),
                      description: dateUpdated,
                    },
                    {
                      title: formatMessage(messages.dateCreatedTitle),
                      description: dateCreated,
                    },
                  ]}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer />
        <EuiHorizontalRule />
        <EuiCommentList
          comments={[
            {
              username: issue.createdBy.username,
              event: 'added a comment',
              timestamp: dateUpdated,
              children: (
                <EuiText size="s">
                  <p>Testing comments :)</p>
                </EuiText>
              ),
            },
            {
              username: issue.createdBy.username,
              type: 'update',
              event: 'Created issue',
              timestamp: dateCreated,
            },
          ]}
        />
        <EuiForm component="form" onSubmit={() => {}}>
          <EuiFormRow label="Add a comment" fullWidth>
            <EuiTextArea fullWidth placeholder="Add a comment." />
          </EuiFormRow>
          <EuiFormRow>
            <EuiButton type="submit" fill onClick={() => {}}>
              <FormattedMessage {...messages.submitCommentLabel} />
            </EuiButton>
          </EuiFormRow>
        </EuiForm>
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
