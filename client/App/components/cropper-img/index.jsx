import React from 'react';
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
    this.handleCrop = this.handleCrop.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSelectFile = this.handleSelectFile.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }
  handleCrop() {
    const dataUrl = this.cropperRef.current.getCroppedCanvas().toDataURL();
    this.setState({
      cropperUrl: dataUrl,
    });
  }
  handleClose() {
    this.setState({
      open: false,
    });
  }
  handleSelectFile() {
    this.fileInputRef.current.click();
  }
  async handleFileChange(e) {
    const file = e.target.files[0];
    const dataUrl = await this.handleGetDataUrl(file);
    this.setState({
      originFileUrl: dataUrl,
      open: true,
    });
    return dataUrl;
  }
  handleGetDataUrl(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.addEventListener('load', function () {
        resolve(this.result);
      });
      reader.readAsDataURL(file);
    });
  }
  handleOk() {
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
              aspectRatio={522 / 566}
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
};
CropperImage.defaultProps = {
  onConfirm: () => {},
  buttonText: '上传',
};
export default withStyles(styles)(CropperImage);
