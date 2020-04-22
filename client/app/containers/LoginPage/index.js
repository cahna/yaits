import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useIntl, FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
  EuiFieldPassword,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiButton,
  EuiLink,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui';

import { useInjectSaga } from 'utils/injectSaga';
import { ROUTE_REGISTER } from 'containers/App/constants';

import reducer, { initialState } from './reducer';
import saga from './saga';
import messages from './messages';
import {
  submitLogin,
  changeUsername,
  changePassword,
  loginFormLoading,
  loginFailure,
} from './actions';

const key = 'loginPage';

export function LoginPage({ makeOnSubmitForm, navigateTo }) {
  useInjectSaga({ key, saga });

  const { formatMessage } = useIntl();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { username, password, loading } = state;

  const goToRegisterPage = useCallback(() => navigateTo(ROUTE_REGISTER), [
    navigateTo,
  ]);
  const onChangeUsername = useCallback(
    (evt) => dispatch(changeUsername(evt.target.value)),
    [],
  );
  const onChangePassword = useCallback(
    (evt) => dispatch(changePassword(evt.target.value)),
    [],
  );
  const onSubmitForm = useCallback(
    makeOnSubmitForm({
      username,
      password,
      onStart: () => dispatch(loginFormLoading()),
      onFailure: (error) => dispatch(loginFailure(error)),
    }),
    [username, password, makeOnSubmitForm],
  );

  return (
    <EuiPage>
      <Helmet>
        <title>{formatMessage(messages.loginPageTitle)}</title>
        <meta
          name="description"
          content={formatMessage(messages.loginPageDescription)}
        />
      </Helmet>
      <EuiPageBody>
        <EuiPageContent verticalPosition="center" horizontalPosition="center">
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle>
                <h2>
                  <FormattedMessage {...messages.header} />
                </h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <EuiForm component="form" onSubmit={onSubmitForm}>
              <EuiFormRow label={formatMessage(messages.usernameLabel)}>
                <EuiFieldText
                  placeholder=""
                  value={username}
                  onChange={onChangeUsername}
                  disabled={loading}
                />
              </EuiFormRow>
              <EuiFormRow label={formatMessage(messages.passwordLabel)}>
                <EuiFieldPassword
                  placeholder=""
                  value={password}
                  onChange={onChangePassword}
                  disabled={loading}
                />
              </EuiFormRow>
              <EuiFormRow>
                <EuiFlexGroup justifyContent="spaceAround">
                  <EuiFlexItem grow={false}>
                    <EuiButton
                      fill
                      type="submit"
                      onClick={onSubmitForm}
                      isLoading={loading}
                    >
                      <FormattedMessage {...messages.loginButtonLabel} />
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFormRow>
            </EuiForm>
            <EuiSpacer />
            <EuiFlexGroup justifyContent="spaceAround">
              <EuiFlexItem grow={false}>
                <EuiLink color="secondary" onClick={goToRegisterPage}>
                  <FormattedMessage {...messages.registerButtonLabel} />
                </EuiLink>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}

LoginPage.propTypes = {
  makeOnSubmitForm: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    navigateTo: (route) => dispatch(push(route)),
    makeOnSubmitForm: (payload) => (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(submitLogin(payload));
    },
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(LoginPage);
