/*
 * RegisterPage Messages
 *
 * This contains all the text for the RegisterPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.RegisterPage';

export default defineMessages({
  registerPageTitle: {
    id: `${scope}.registerPageTitle`,
    defaultMessage: 'Register',
  },
  registerPageDescription: {
    id: `${scope}.registerPageDescription`,
    defaultMessage: 'Register a new user account.',
  },
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Register',
  },
  registerButtonLabel: {
    id: `${scope}.registerButtonLabel`,
    defaultMessage: 'Register',
  },
  usernameLabel: {
    id: `${scope}.usernameLabel`,
    defaultMessage: 'Username',
  },
  passwordLabel: {
    id: `${scope}.passwordLabel`,
    defaultMessage: 'Password',
  },
  confirmPasswordLabel: {
    id: `${scope}.confirmPasswordLabel`,
    defaultMessage: 'Confirm password',
  },
  usernameRequirements: {
    id: `${scope}.usernameRequirements`,
    defaultMessage: 'Length must be between {min} and {max} characters',
  },
  passwordRequirements: {
    id: `${scope}.passwordRequirements`,
    defaultMessage: 'Minimum length is {min} characters',
  },
});
