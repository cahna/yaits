import { defineMessages } from 'react-intl';

export const scope = 'app.containers.YaitsApp';

export default defineMessages({
  pageTitle: {
    id: `${scope}.pageTitle`,
    defaultMessage: 'YAITS',
  },
  pageDescription: {
    id: `${scope}.pageDescription`,
    defaultMessage: 'Yet Another Issue Tracking Service',
  },
});
