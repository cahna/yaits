/**
 * Asynchronously loads the component for GlobalToasts
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
