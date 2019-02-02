import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import imageUtil from '$utils/image';

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
  gitHubIcon: {
    color: '#fff',
  },
  downloadIcon: {
    color: '#fff',
    width: 24,
    height: 24,
  },
};

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
      fileTypes: [{
        title: 'png',
        mime: 'image/png',
      }, {
        title: 'jpg',
        mime: 'image/jpeg',
      }],
    };
  }
  handleSetAnchorEl = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
      open: true,
    });
  }
  handleClose = () => {
    this.setState({
      open: false,
      anchorEl: null,
    });
  }
  handleDownLoadFile = (mime) => {
    window.downloadMime = mime;
    window.dispatchEvent(window.addEvents.downloadImage);
    this.handleClose();
  }
  render() {
    const { classes } = this.props;
    const { fileTypes, open, anchorEl } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" className={`${styles.positionFixed}`}>
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Biocard Generators
            </Typography>
            <IconButton onClick={this.handleSetAnchorEl}>
              <SvgIcon viewBox="0 0 24 24" className={classes.downloadIcon}>
                {/* eslint-disable */}
                <path fill="#ffffff" d="M11,6V14L7.5,10.5L6.08,11.92L12,17.84L17.92,11.92L16.5,10.5L13,14V6H11M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22Z" />
                {/* eslint-disable */}
              </SvgIcon>
            </IconButton>
            <IconButton onClick={() => {
              window.location = 'https://github.com/LittleGragon/biocard-generator';
            }}
            >
              <SvgIcon className={classes.gitHubIcon}>
                {/* eslint-disable */}
                <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
                {/* eslint-disable */}
              </SvgIcon>
            </IconButton>
            <Menu
              open={open}
              anchorEl={anchorEl}
            >
              {fileTypes.map(item => {
                const { title, mime } = item;
                const imageBase64 = _.get(window, 'imageBase64', '');
                return (
                  <MenuItem key={title} onClick={e => {
                    this.handleClose();
                    imageUtil.downloadImage(imageBase64, mime);
                  }}>
                    {title}
                  </MenuItem>
                )
              })}
            </Menu>
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
