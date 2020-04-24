import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
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

import { IssueStatus } from 'utils/sharedProps';
import messages from './messages';

const IssueFormModal = ({
  teamSlug,
  issueStatuses,
  onSubmitForm,
  closeModal,
}) => {
  const { formatMessage } = useIntl();
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(0);
  const [statusUniqueId, setStatusId] = useState();

  const statusOptions = issueStatuses.map(({ uniqueId, name }) => ({
    value: uniqueId,
    text: name,
  }));

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
                max={10}
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
            onClick={() =>
              onSubmitForm({
                teamSlug,
                shortDescription,
                description,
                priority,
                statusUniqueId,
                onSuccess: closeModal,
              })
            }
            fill
          >
            {formatMessage(messages.saveNewIssue)}
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

IssueFormModal.propTypes = {
  issueStatuses: PropTypes.arrayOf(IssueStatus).isRequired,
  closeModal: PropTypes.func.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
};

export default memo(IssueFormModal);
