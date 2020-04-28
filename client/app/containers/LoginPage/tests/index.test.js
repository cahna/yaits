import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { browserHistory } from 'react-router-dom';

// import '@testing-library/jest-dom/extend-expect'; // add some helpful assertions

import { LoginPage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';
import configureStore from '../../../configureStore';

describe('<LoginPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    const alertSuccess = jest.fn();
    const alertError = jest.fn();
    const onSubmitForm = jest.fn();
    const setActiveUser = jest.fn();
    const makeOnSubmitForm = () => onSubmitForm;

    render(
      <Provider store={store}>
        <IntlProvider locale={DEFAULT_LOCALE}>
          <HelmetProvider>
            <LoginPage
              alertSuccess={alertSuccess}
              alertError={alertError}
              makeOnSubmitForm={makeOnSubmitForm}
              setActiveUser={setActiveUser}
            />
          </HelmetProvider>
        </IntlProvider>
      </Provider>,
    );
    expect(spy).not.toHaveBeenCalled();
    expect(alertSuccess).not.toHaveBeenCalled();
    expect(alertError).not.toHaveBeenCalled();
    expect(onSubmitForm).not.toHaveBeenCalled();
    expect(setActiveUser).not.toHaveBeenCalled();
  });
});
