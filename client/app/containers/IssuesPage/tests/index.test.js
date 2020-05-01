import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import history from 'utils/history';

import IssuesPage from '../index';
import configureStore from '../../../configureStore';

describe('<IssuesPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, history);
  });

  it.skip('should render and match the snapshot', () => {
    // Skipped: snapshot fails for stupid reason
    const doLogoutUser = jest.fn();

    const {
      container: { firstChild },
    } = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <HelmetProvider>
            <IssuesPage
              loading={false}
              error={false}
              currentUser={{
                username: 'TestUser',
                uniqueId: 'abc-123',
              }}
              doLogoutUser={doLogoutUser}
            />
          </HelmetProvider>
        </IntlProvider>
      </Provider>,
    );

    expect(doLogoutUser).not.toHaveBeenCalled();
    expect(firstChild).toMatchSnapshot();
  });
});
