/**
 * HoC utils tests
 */
import { PureComponent } from 'react';

import { getDisplayName } from '../hoc';

describe('getDisplayName', () => {
  it('should return Component.displayName', () => {
    expect(getDisplayName(PureComponent)).toEqual('PureComponent');
  });

  it('should return Component.name if no displayName', () => {
    const MyComponent = { name: 'CustomName' };
    expect(getDisplayName(MyComponent)).toEqual('CustomName');
  });

  it('should return default name if no displayName or name', () => {
    expect(getDisplayName(() => {})).toEqual('Component');
  });
});
