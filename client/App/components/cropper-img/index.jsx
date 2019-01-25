import React from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper';
import { Dialog, DialogContent, DialogActions, DialogContentText, Button } from 'material-ui';
import 'cropperjs/dist/cropper.css';

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
        >
          上传主背景图
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
  onConfirm: PropTypes.func,
};
CropperImage.defaultProps = {
  onConfirm: () => {},
};
export default CropperImage;
