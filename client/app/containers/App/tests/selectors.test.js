import {
  makeSelectLocation,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectAccessToken,
} from 'containers/App/selectors';

describe('App container selectors', () => {
  describe('makeSelectLocation', () => {
    it('should select the location', () => {
      const router = {
        location: { pathname: '/foo' },
      };
      const mockedState = {
        router,
      };
      expect(makeSelectLocation()(mockedState)).toEqual(router.location);
    });
  });

  describe('makeSelectCurrentUser', () => {
    it('should select currentUser', () => {
      const global = {
        currentUser: {
          username: 'TestUser',
          uniqueId: 'abc-123',
        },
      };
      const mockedState = {
        global,
      };
      expect(makeSelectCurrentUser()(mockedState)).toEqual(global.currentUser);
    });
  });

  describe('makeSelectLoading', () => {
    it('should select loading', () => {
      expect(
        makeSelectLoading()({
          global: {
            loading: true,
          },
        }),
      ).toEqual(true);
      expect(
        makeSelectLoading()({
          global: {
            loading: false,
          },
        }),
      ).toEqual(false);
    });
  });

  describe('makeSelectError', () => {
    it('should select error', () => {
      expect(
        makeSelectError()({
          global: {
            error: true,
          },
        }),
      ).toEqual(true);
      expect(
        makeSelectError()({
          global: {
            error: false,
          },
        }),
      ).toEqual(false);
    });
  });

  describe('makeSelectAccessToken', () => {
    it('should select accessToken', () => {
      expect(
        makeSelectAccessToken()({
          global: { accessToken: null },
        }),
      ).toEqual(null);
      expect(
        makeSelectAccessToken()({
          global: { accessToken: '_JWT_' },
        }),
      ).toEqual('_JWT_');
    });
  });
});
