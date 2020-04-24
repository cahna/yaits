import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  EuiInMemoryTable,
  EuiEmptyPrompt,
  EuiButton,
  EuiLoadingContent,
} from '@elastic/eui';

import { Issue, Team } from 'utils/sharedProps';
import messages from './messages';
import IssueFormModal from './IssueFormModal';

export function IssuesView({ team, issues, issuesLoaded }) {
  const { formatMessage } = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);
  let modal;

  if (isModalVisible) {
    modal = (
      <IssueFormModal
        teamSlug={team.slug}
        closeModal={closeModal}
        onSubmitForm={() => {}}
        issueStatuses={team.issueStatuses}
      />
    );
  }

  if (!issuesLoaded) {
    return <EuiLoadingContent lines={10} />;
  }

  if (issuesLoaded && issues.length < 1) {
    return (
      <>
        <EuiEmptyPrompt
          iconType="indexManagementApp"
          title={<h2>{formatMessage(messages.noIssuesTitle)}</h2>}
          body={
            <p>
              <FormattedMessage {...messages.noIssuesInfo} />
            </p>
          }
          actions={
            <EuiButton color="primary" fill onClick={showModal}>
              <FormattedMessage {...messages.newIssue} />
            </EuiButton>
          }
        />
        {modal}
      </>
    );
  }

  const columns = [
    {
      field: 'shortDescription',
      name: formatMessage(messages.issueShortDescription),
      sortable: true,
      truncateText: true,
    },
    {
      field: 'assignedTo',
      name: formatMessage(messages.issueAssignedTo),
      render: ({ username }) => username,
      sortable: true,
    },
    {
      field: 'createdBy',
      name: formatMessage(messages.issueCreatedBy),
      render: ({ username }) => username,
      sortable: true,
    },
    {
      field: 'dateCreated',
      name: formatMessage(messages.issueDateCreated),
      dataType: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
      sortable: true,
    },
    {
      field: 'dateUpdated',
      name: formatMessage(messages.issueDateUpdated),
      dataType: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
      sortable: true,
    },
    {
      field: 'status',
      name: formatMessage(messages.issueStatus),
      render: ({ name }) => name,
      sortable: true,
    },
    {
      field: 'priority',
      name: formatMessage(messages.issuePriority),
      sortable: true,
    },
  ];

  const sorting = {
    sort: {
      field: 'priority',
      direction: 'asc',
    },
  };

  return (
    <>
      <EuiInMemoryTable
        items={issues}
        columns={columns}
        pagination
        sorting={sorting}
      />
      {modal}
    </>
  );
}

IssuesView.propTypes = {
  team: Team.isRequired,
  issues: PropTypes.arrayOf(Issue).isRequired,
  issuesLoaded: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
    .isRequired,
  loading: PropTypes.bool,
};

export default memo(IssuesView);
