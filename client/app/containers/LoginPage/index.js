import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useIntl, FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import {
  EuiButton,
  EuiFieldPassword,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiLink,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';

import history from 'utils/history';
import { ROUTE_HOME, ROUTE_REGISTER } from 'containers/App/constants';
import {
  notifyActiveUserLoaded,
  submitLogin,
  addErrorToast,
  addSuccessToast,
} from 'containers/App/actions';

import reducer, { initialState } from './reducer';
import messages from './messages';
import {
  changeUsername,
  changePassword,
  loginFormLoading,
  loginFailure,
} from './actions';

export function LoginPage({
  makeOnSubmitForm,
  alertSuccess,
  alertError,
  setActiveUser,
}) {
  const { formatMessage } = useIntl();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { username, password, loading } = state;

  const onChangeUsername = (evt) => dispatch(changeUsername(evt.target.value));
  const onChangePassword = (evt) => dispatch(changePassword(evt.target.value));
  const onSubmitForm = makeOnSubmitForm({
    username,
    password,
    onStart: () => dispatch(loginFormLoading()),
    onSuccess: (user) => {
      setActiveUser(user);
      history.push(ROUTE_HOME);
      alertSuccess({
        title: formatMessage(messages.loginSuccessAlertTitle),
        text: formatMessage(messages.loginSuccessAlertText, user),
      });
    },
    onFailure: (error) => {
      dispatch(loginFailure(error));
      alertError({
        title: formatMessage(messages.loginErrorAlertTitle),
        text: error.toString() || formatMessage(messages.unknownLoginError),
      });
    },
  });

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
                <EuiLink
                  color="secondary"
                  onClick={() => history.push(ROUTE_REGISTER)}
                >
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
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  setActiveUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  makeOnSubmitForm: (payload) => (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    dispatch(submitLogin(payload));
  },
  alertSuccess: (payload) => dispatch(addSuccessToast(payload)),
  alertError: (payload) => dispatch(addErrorToast(payload)),
  setActiveUser: (user) => dispatch(notifyActiveUserLoaded(user)),
});

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(LoginPage);
