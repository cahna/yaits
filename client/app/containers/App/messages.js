import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.App';

export default defineMessages({
  logoAriaLabel: {
    id: `${scope}.topNav.logoAriaLabel`,
    defaultMessage: 'Go to home page',
  },
  breadcrumbHome: {
    id: `${scope}.topNav.breadcrumbHome`,
    defaultMessage: 'Home',
  },
});
