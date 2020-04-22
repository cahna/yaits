/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.withRequireSession';

export default defineMessages({
  unauthorizedRedirect: {
    id: `${scope}.unauthorizedRedirect`,
    defaultMessage: 'You are being redirected...',
  },
});
