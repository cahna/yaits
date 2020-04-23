import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { compose } from 'redux';
import {
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiButton,
  EuiGlobalToastList,
} from '@elastic/eui';

import { useInjectSaga } from 'utils/injectSaga';

import {
  submitCreateTeam,
  changeTeamName,
  createTeamFailure,
  createTeamFormLoading,
} from './actions';
import reducer, { initialState } from './reducer';
import saga from './saga';
import messages from './messages';

const key = 'CreateTeamPage';

export function CreateTeamPage({ makeOnSubmitForm }) {
  useInjectSaga({ key, saga });

  const { formatMessage } = useIntl();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, teamName, teamNameError, createTeamError } = state;

  const onChangeTeamName = useCallback(
    (evt) => dispatch(changeTeamName(evt.target.value)),
    [],
  );
  const onSubmitForm = makeOnSubmitForm({
    teamName,
    onStart: () => dispatch(createTeamFormLoading()),
    onFailure: (error) => dispatch(createTeamFailure(error)),
  });

  let toasts = [];

  if (createTeamError) {
    toasts = [
      {
        key: 'create-team-failed',
        title: formatMessage(messages.createTeamFailedTitle),
        text: formatMessage(messages.createTeamFailedText),
        color: 'danger',
        iconType: 'alert',
      },
    ];
  }

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
      <EuiGlobalToastList
        toasts={toasts}
        toastLifeTimeMs={6000}
        dismissToast={() => {}}
      />
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
