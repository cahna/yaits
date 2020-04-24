import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { EuiGlobalToastList } from '@elastic/eui';

import { Toast } from 'utils/sharedProps';

import { makeSelectToasts } from 'containers/App/selectors';
import { closeToast } from 'containers/App/actions';

export const GlobalToasts = ({ toasts, dispatch }) => (
  <EuiGlobalToastList
    toasts={toasts}
    toastLifeTimeMs={10000}
    dismissToast={(t) => dispatch(closeToast(t))}
  />
);

GlobalToasts.propTypes = {
  toasts: PropTypes.arrayOf(Toast).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  toasts: makeSelectToasts(),
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(GlobalToasts);
