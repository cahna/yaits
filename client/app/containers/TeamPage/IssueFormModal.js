import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { parseInt } from 'lodash/string';
import {
  EuiForm,
  EuiFormRow,
  EuiRange,
  EuiFieldText,
  EuiSpacer,
  EuiTextArea,
  EuiSelect,
  EuiOverlayMask,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiButtonEmpty,
  EuiModalFooter,
  EuiButton,
} from '@elastic/eui';

import { submitCreateIssue } from 'containers/App/actions';

import { IssueStatus } from 'utils/sharedProps';
import messages from './messages';

const IssueFormModal = ({
  teamSlug,
  issueStatuses,
  handleSubmitForm,
  closeModal,
}) => {
  const { formatMessage } = useIntl();

  const statusOptions = issueStatuses.map(({ uniqueId, name }) => ({
    value: uniqueId,
    text: name,
  }));

  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(0);
  const [statusUniqueId, setStatusId] = useState(statusOptions[0].value);
  const [formLoading, setFormLoading] = useState(false);

  return (
    <EuiOverlayMask>
      <EuiModal
        onClose={closeModal}
        initialFocus="[name=issueShortDescription]"
      >
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            {formatMessage(messages.newIssue)}
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiForm>
            <EuiFormRow label={formatMessage(messages.issueShortDescription)}>
              <EuiFieldText
                name="issueShortDescription"
                value={shortDescription}
                onChange={({ target: { value } }) => setShortDescription(value)}
              />
            </EuiFormRow>

            <EuiFormRow
              label={`${formatMessage(messages.issuePriority)}: ${priority}`}
            >
              <EuiRange
                min={0}
                max={9}
                name="issuePriority"
                value={priority}
                onChange={({ target: { value } }) => setPriority(value)}
              />
            </EuiFormRow>

            <EuiFormRow label={formatMessage(messages.issueStatus)}>
              <EuiSelect
                id="issueStatus"
                options={statusOptions}
                value={statusUniqueId}
                onChange={({ target: { value } }) => setStatusId(value)}
              />
            </EuiFormRow>

            <EuiSpacer />

            <EuiTextArea
              value={description}
              width="100%"
              onChange={({ target: { value } }) => setDescription(value)}
            />
          </EuiForm>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={closeModal}>
            {formatMessage(messages.cancelNewIssue)}
          </EuiButtonEmpty>

          <EuiButton
            fill
            isLoading={formLoading}
            onClick={() =>
              handleSubmitForm({
                teamSlug,
                shortDescription,
                description,
                priority: parseInt(priority),
                statusUniqueId,
                onStart: () => setFormLoading(true),
                onSuccess: closeModal,
                onFailure: () => setFormLoading(false),
              })
            }
          >
            {formatMessage(messages.saveNewIssue)}
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

IssueFormModal.propTypes = {
  teamSlug: PropTypes.string.isRequired,
  issueStatuses: PropTypes.arrayOf(IssueStatus).isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSubmitForm: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  handleSubmitForm: (payload) => dispatch(submitCreateIssue(payload)),
});

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect, memo)(IssueFormModal);
