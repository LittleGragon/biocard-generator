import React from 'React';
import PropTypes from 'prop-types';
import { AppBar, Toolbar } from 'material-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class HeaderBar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              LitteGragon personal website
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
HeaderBar.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(HeaderBar);
