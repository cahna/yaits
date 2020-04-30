import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { compose } from 'redux';
import {
  EuiButton,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
} from '@elastic/eui';

import { submitCreateTeam } from 'containers/App/actions';

import { setTeamName, setFormLoading } from './actions';
import reducer, { initialState } from './reducer';
import messages from './messages';

export function CreateTeamPage({ makeOnSubmitForm }) {
  const { formatMessage } = useIntl();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, teamName, teamNameError } = state;

  const onChangeTeamName = useCallback(
    (evt) => dispatch(setTeamName(evt.target.value)),
    [],
  );
  const onSubmitForm = makeOnSubmitForm({
    teamName,
    onStart: () => dispatch(setFormLoading()),
    failToast: {
      title: formatMessage(messages.createTeamFailedTitle),
      text: formatMessage(messages.createTeamFailedText),
      color: 'danger',
      iconType: 'alert',
    },
  });

  return (
    <>
      <Helmet>
        <title>{formatMessage(messages.createTeamPageTitle)}</title>
        <meta
          name="description"
          content={formatMessage(messages.createTeamPageDescription)}
        />
      </Helmet>
      <EuiPageContent>
        <EuiPageContentHeader>
          <EuiPageContentHeaderSection>
            <EuiTitle>
              <h2>{formatMessage(messages.header)}</h2>
            </EuiTitle>
          </EuiPageContentHeaderSection>
        </EuiPageContentHeader>
        <EuiPageContentBody>
          <EuiForm
            component="form"
            onSubmit={onSubmitForm}
            isInvalid={teamNameError}
          >
            <EuiFormRow
              label={formatMessage(messages.teamNameLabel)}
              isInvalid={teamNameError}
            >
              <EuiFieldText
                placeholder=""
                value={teamName}
                onChange={onChangeTeamName}
                disabled={loading}
                isInvalid={teamNameError}
              />
            </EuiFormRow>
            <EuiFormRow>
              <EuiButton
                fill
                type="submit"
                onClick={onSubmitForm}
                isLoading={loading}
                disabled={teamNameError || !teamName}
              >
                <FormattedMessage {...messages.createTeamLabel} />
              </EuiButton>
            </EuiFormRow>
          </EuiForm>
        </EuiPageContentBody>
      </EuiPageContent>
    </>
  );
}

CreateTeamPage.propTypes = {
  makeOnSubmitForm: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  makeOnSubmitForm: (payload) => (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    dispatch(submitCreateTeam(payload));
  },
});

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(CreateTeamPage);
