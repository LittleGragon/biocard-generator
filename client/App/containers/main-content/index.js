import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import './style.less';

class MainContent extends React.Component {
  render() {
    return (
      <div className="container">
        <Grid container spacing={8}>
          <Grid item lg={2}>
            {/* {this.props.leftMenu} */}
          </Grid>
          <Grid item lg={10}>
            {this.props.children}
          </Grid>
        </Grid>
      </div>
    );
  }
}
MainContent.propTypes = {
  // leftMenu: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
};
export default MainContent;
