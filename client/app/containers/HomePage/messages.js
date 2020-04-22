import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.HomePage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'What have you made?',
  },
  logoutButtonLabel: {
    id: `${scope}.logoutButtonLabel.message`,
    defaultMessage: 'Logout',
  },
});
