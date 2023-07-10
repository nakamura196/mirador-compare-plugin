// import React from 'react';
// import { shallow } from 'enzyme';
// import ListItemText from '@material-ui/core/ListItemText';
import MiradorComparePlugin from '../src/MiradorCompare';

// const Component = MiradorComparePlugin.component;

/*
function createWrapper(props) {
  return shallow(
    <Component
      {...props}
    />,
  );
}
*/

describe('MiradorComparePlugin', () => {
  it('has the correct target', () => {
    expect(MiradorComparePlugin.target).toBe('WorkspaceControlPanelButtons');
  });
  /*
  describe('renders a component', () => {
    it('renders a thing', () => {
      const wrapper = createWrapper();
      expect(wrapper.find(ListItemText).props().children).toEqual('Copy Window');
    });
  });
  */
});
