import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import 'cropperjs/dist/cropper.css';

const styles = {
  uploadButton: {
    width: '100%',
  },
};
class CropperImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      originFileUrl: '',
      cropperUrl: '',
    };
    this.fileInputRef = React.createRef();
    this.cropperRef = React.createRef();
  }
  handleCrop = () => {
    const { onCropFile } = this.props;
    const dataUrl = this.cropperRef.current.getCroppedCanvas().toDataURL();
    const image = new Image();
    image.src = dataUrl;
    image.onload = function () {
      const width = _.get(this, 'width', 0);
      const height = _.get(this, 'height', 0);
      onCropFile({
        width,
        height,
      });
    };
    this.setState({
      cropperUrl: dataUrl,
    });
  }
  handleClose = () => {
    this.setState({
      open: false,
    });
  }
  handleSelectFile = () => {
    this.fileInputRef.current.click();
  }
  handleFileChange = async (e) => {
    const { onFileChange } = this.props;
    const file = e.target.files[0];
    const dataUrl = await this.handleGetDataUrl(file);
    this.setState({
      originFileUrl: dataUrl,
      open: true,
    });
    const image = new Image();
    image.src = dataUrl;
    image.onload = function () {
      const width = _.get(this, 'width', 0);
      const height = _.get(this, 'height', 0);
      onFileChange(file, {
        width,
        height,
      });
    };
    return dataUrl;
  }
  handleGetDataUrl = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.addEventListener('load', function () {
        resolve(this.result);
      });
      reader.readAsDataURL(file);
    });
  }
  handleOk = () => {
    const { onConfirm } = this.props;
    const { cropperUrl } = this.state;
    onConfirm(cropperUrl);
    this.setState({
      open: false,
    });
  }
  render() {
    const { open } = this.state;
    const { buttonText, classes } = this.props;
    return (
      <div className="cropper-img">
        <input
          style={{ display: 'none' }}
          type="file"
          ref={this.fileInputRef}
          accept="image/*"
          onChange={this.handleFileChange}
        />
        <Button
          color="primary"
          onClick={this.handleSelectFile}
          className={classes.uploadButton}
        >
          {buttonText}
        </Button>
        <Dialog
          open={open}
          onClose={this.handleClose}
        >
          <DialogContentText>
            cropper
          </DialogContentText>
          <DialogContent>
            <Cropper
              ref={this.cropperRef}
              crop={this.handleCrop}
              src={this.state.originFileUrl}
              guides={false}
              style={{ height: '100%', width: 'auto' }}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>Close</Button>
            <Button color="primary" onClick={this.handleOk}>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
CropperImage.propTypes = {
  // 裁剪确认回调
  onConfirm: PropTypes.func,
  // 上传按钮文案
  buttonText: PropTypes.string,
  // withStyles 注入的样式object
  classes: PropTypes.object.isRequired,
  // input file change callback
  onFileChange: PropTypes.func,
  // crop file callback
  onCropFile: PropTypes.func,
};
CropperImage.defaultProps = {
  onConfirm: () => { },
  buttonText: '上传',
  onFileChange: () => { },
  onCropFile: () => {},
};
export default withStyles(styles)(CropperImage);
