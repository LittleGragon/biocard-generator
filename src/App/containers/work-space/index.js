import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  workspace: {
    marginTop: 64,
  },
};
class WorkSpace extends React.Component {
  render() {
    const { classes, children } = this.props;
    return (
      <div id="workspace" className={classes.workspace}>
        {children}
      </div>
    );
  }
}
WorkSpace.propTypes = {
  children: PropTypes.any.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(WorkSpace);
