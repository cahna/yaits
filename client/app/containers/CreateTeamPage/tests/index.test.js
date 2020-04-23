import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { HelmetProvider } from 'react-helmet-async';
// import '@testing-library/jest-dom/extend-expect'; // add some helpful assertions

import { CreateTeamPage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';
import configureStore from '../../../configureStore';

describe('<CreateTeamPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore();
  });

  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    const onSubmitForm = jest.fn();
    const makeOnSubmitForm = () => onSubmitForm;
    render(
      <Provider store={store}>
        <IntlProvider locale={DEFAULT_LOCALE}>
          <HelmetProvider>
            <CreateTeamPage makeOnSubmitForm={makeOnSubmitForm} />
          </HelmetProvider>
        </IntlProvider>
      </Provider>,
    );
    expect(spy).not.toHaveBeenCalled();
    expect(onSubmitForm).not.toHaveBeenCalled();
  });

  it.skip('Should render and match the snapshot', () => {
    // EUI adds a uuid to each node... breaking snapshot testing...
    const onSubmitForm = jest.fn();
    const makeOnSubmitForm = () => onSubmitForm;
    const {
      container: { firstChild },
    } = render(
      <Provider store={store}>
        <IntlProvider locale={DEFAULT_LOCALE}>
          <HelmetProvider>
            <CreateTeamPage makeOnSubmitForm={makeOnSubmitForm} />
          </HelmetProvider>
        </IntlProvider>
      </Provider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
