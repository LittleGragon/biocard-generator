import React from 'react';
import PropTypes from 'prop-types';

class WorkSpace extends React.Component {
  render() {
    return (
      <div id="workspace">
        {this.props.children}
      </div>
    );
  }
}
WorkSpace.propTypes = {
  children: PropTypes.any.isRequired,
};
export default WorkSpace;
