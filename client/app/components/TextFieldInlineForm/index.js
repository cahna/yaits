import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  EuiButton,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
} from '@elastic/eui';

export function TextFieldInlineForm({ onSubmit, fieldLabel, buttonText }) {
  const [value, setValue] = useState('');

  return (
    <EuiForm component="form" onSubmit={onSubmit}>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiFormRow label={fieldLabel}>
            <EuiFieldText
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFormRow hasEmptyLabelSpace>
            <EuiButton onClick={onSubmit}>{buttonText}</EuiButton>
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiForm>
  );
}

TextFieldInlineForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  fieldLabel: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default memo(TextFieldInlineForm);
