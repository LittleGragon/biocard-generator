import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import CropperImage from '$components/cropper-img';
import ColorPicker from '$components/color-picker';
import './style';

class CommonEditGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      imageUrl: '',
      originX: 0,
      originY: 0,
      isDragging: false,
      editModuleName: '',
      uploadedImageMessage: {
        width: 0,
        height: 0,
      },
      editBase: false,
    };
    this.biocardRef = React.createRef();
    this.downloadRef = React.createRef();
  }
  setFields(fields) {
    const { onChange } = this.props;
    this.setState({
      fields,
    });
    onChange(fields);
    this.setImageUrl();
  }
  handleChangeFields = ({ key, value, name }) => {
    const { fields } = this.state;
    const newFields = fields.map((item) => {
      if (item.name === name) {
        return Object.assign({}, item, {
          [key]: value,
        });
      }
      return item;
    });
    this.setFields(newFields);
  }
  handleCheck = (e) => {
    const { checked, name } = e.target;
    this.handleChangeFields({
      key: 'show',
      value: checked,
      name,
    });
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.handleChangeFields({
      key: 'text',
      name,
      value,
    });
  }
  setImageUrl = () => {
    setTimeout(() => {
      const previewSvg = this.biocardRef.current;
      if (!previewSvg) {
        return '';
      }
      const xml = new XMLSerializer().serializeToString(previewSvg);
      const svg = unescape(encodeURIComponent(xml));
      const data = `data:image/svg+xml;base64,${btoa(svg)}`;
      window.imageBase64 = data;
      this.setState({
        imageUrl: data,
      });
    });
  }
  handleConfirmCropper = (url) => {
    const { fields, uploadedImageMessage } = this.state;
    const width = _.get(uploadedImageMessage, 'width', '');
    const height = _.get(uploadedImageMessage, 'height', '');
    const time = (new Date()).getTime();
    const imageName = `图片${time}`;
    const newImage = {
      xlinkHref: url,
      x: 0,
      y: 0,
      name: imageName,
      show: true,
      type: 'image',
      editType: 'checkbox',
      width,
      height,
    };
    fields.splice(1, 0, newImage);
    this.setFields(fields);
    this.setState({
      editModuleName: imageName,
    });
  }
  handleInitData = () => {
    const { fields } = this.props;
    this.setFields(fields);
  }
  /**
   * 用于修改模块位置的函数
  */
  handleChangeLocation(e, coordinateType) {
    const { name, value } = e.target;
    this.handleChangeFields({
      name,
      value,
      key: coordinateType,
    });
  }
  /**
   * 修改图片尺寸的函数
  */
  handleChangeSize = (e, sizeType) => {
    const { name, value } = e.target;
    const { fields } = this.state;
    const newFields = fields.map((item) => {
      if (item.name === name) {
        const { width, height } = item;
        if (sizeType === 'width') {
          let changeWidth = value;
          if (value === '' || value === '0' || value === 0) {
            changeWidth = 1;
          }
          const changeHeight = changeWidth * (height / width);
          return Object.assign({}, item, {
            width: changeWidth,
            height: changeHeight,
          });
        }
        if (sizeType === 'height') {
          let changeHeight = value;
          if (value === '' || value === '0' || value === 0) {
            changeHeight = 1;
          }
          const changeWidth = changeHeight * (width / height);
          return Object.assign({}, item, {
            height: changeHeight,
            width: changeWidth,
          });
        }
      }
      return item;
    });
    this.setFields(newFields);
  }
  handleMouseDown = (e, name) => {
    this.setState({
      editModuleName: name,
      editBase: false,
    });
    this.coords = {
      x: e.pageX,
      y: e.pageY,
    };
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }
  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    this.coords = {};
  }
  handleMouseMove = (e) => {
    const scalePoint = 0.5;
    const diffX = (this.coords.x - e.pageX) / scalePoint;
    const diffY = (this.coords.y - e.pageY) / scalePoint;
    this.coords.x = e.pageX;
    this.coords.y = e.pageY;
    const { fields, editModuleName } = this.state;
    const newFields = fields.map((item) => {
      if (item.name === editModuleName) {
        return Object.assign({}, item, {
          x: item.x - diffX,
          y: item.y - diffY,
        });
      }
      return item;
    });
    this.setFields(newFields);
  }
  /**
   * 修改颜色
  */
  handleChangeColor = ({ key, value, name }) => {
    const { fields } = this.state;
    const newFields = fields.map((item) => {
      if (item.name === name) {
        let style = _.get(item, 'style', {});
        style = Object.assign({}, style, {
          [key]: value,
        });
        return Object.assign({}, item, {
          style,
        });
      }
      return item;
    });
    this.setFields(newFields);
  }
  handleEditBasePanel = () => {
    this.setState({
      editModuleName: '',
      editBase: true,
    });
  }
  componentDidMount() {
    this.handleInitData();
  }
  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
  render() {
    const { fields, editModuleName } = this.state;
    const currentItem = fields.find((item) => {
      return item.name === editModuleName;
    });
    const EditItem = (item) => {
      if (!item) {
        return null;
      }
      const {
        editType,
        name,
        show,
        y,
        x,
        width,
        height,
        text,
        type,
        style = {},
      } = item;
      let colorKey = '';
      if (style.fill) {
        colorKey = 'fill';
      }
      if (style.color) {
        colorKey = 'color';
      }
      const color = style[colorKey];
      return (
        <div key={name}>
          <FormControl component="legend">
            {color && <ColorPicker
              color={color}
              onChange={({ hex }) => {
                this.handleChangeColor({
                  value: hex,
                  name,
                  key: colorKey,
                });
              }}
            />}
          </FormControl>
          {color && <TextField
            name={name}
            value={color}
            label={'color'}
            onChange={(e) => {
              const { value } = e.target;
              this.handleChangeColor({ value, name, key: colorKey });
            }}
          />}
          <br />
          {editType === 'checkbox' && <FormControlLabel
            key={name}
            label={name}
            control={
              <Checkbox
                name={name}
                checked={show}
                onChange={this.handleCheck}
              />
            }
          />
          }
          {item.editType === 'input' && <div>
            <TextField
              key={name}
              name={name}
              placeholder={name}
              value={text}
              label={name}
              onChange={this.handleChange}
            />
            <br />
          </div>}
          {type !== 'basePanel' && <div>
            <TextField
              name={name}
              margin="normal"
              type="number"
              label="y"
              value={y}
              onChange={(e) => {
                this.handleChangeLocation(e, 'y');
              }}
            />
            <br />
          </div>}
          {type !== 'basePanel' && <div>
            <TextField
              name={name}
              margin="normal"
              type="number"
              label="x"
              value={x}
              onChange={(e) => {
                this.handleChangeLocation(e, 'x');
              }}
            />
            <br />
          </div>}
          {type !== 'basePanel' && <TextField
            name={name}
            margin="normal"
            type="number"
            label="width"
            value={width}
            onChange={(e) => {
              this.handleChangeSize(e, 'width');
            }}
          />}
          <br />
          {type !== 'basePanel' && <div>
            <TextField
              name={name}
              margin="normal"
              type="number"
              label="height"
              value={height}
              onChange={(e) => {
                this.handleChangeSize(e, 'height');
              }}
            />
          </div>}
        </div>
      );
    };
    return (
      <div>
        <Grid container>
          <Grid item lg={8}>
            <Paper className="biocard-paper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={1050}
                width={750}
                className="biocard-svg before-svg"
                ref={this.biocardRef}
                id="cardSvg"
              >
                {fields.map((item) => {
                  const {
                    type,
                    name,
                    show,
                    style,
                    xlinkHref,
                    x,
                    y,
                    text,
                    stroke,
                    strokeDasharray,
                    strokeWidth,
                    d,
                    width,
                    height,
                  } = item;
                  switch (type) {
                    case 'image':
                      return show ? <image
                        id={name}
                        x={x}
                        y={y}
                        key={name}
                        style={style}
                        xlinkHref={xlinkHref}
                        width={width}
                        height={height}
                        onMouseDown={(e) => {
                          this.handleMouseDown(e, name);
                        }}
                        onMouseUp={this.handleMouseUp}
                      /> : null;
                    case 'text':
                      return (
                        <text
                          key={name}
                          x={x}
                          y={y}
                          style={style}
                          onMouseDown={(e) => {
                            this.handleMouseDown(e, name);
                          }}
                          onMouseUp={this.handleMouseUp}
                        >
                          {text}
                        </text>
                      );
                    case 'multiText':
                      return (
                        <foreignObject
                          width={width}
                          height={height}
                          x={x}
                          y={y}
                          key={name}
                          onMouseDown={(e) => {
                            this.handleMouseDown(e, name);
                          }}
                          onMouseUp={this.handleMouseUp}
                        >
                          <p
                            fill="#ffffff"
                            style={Object.assign({}, style, {
                              wordBreak: 'break-all',
                            })}
                          >{text}</p>
                        </foreignObject>
                      );
                    case 'dottedLines':
                      return (
                        <g
                          key={name}
                          stroke={stroke}
                          strokeWidth={strokeWidth}
                        >
                          <path
                            strokeDasharray={strokeDasharray}
                            d={d}
                          />
                        </g>
                      );
                    case 'basePanel':
                      return (<rect
                        style={style}
                        key={name}
                        onClick={() => {
                          this.setState({
                            editModuleName: name,
                          });
                        }}
                      />);
                    default:
                      return null;
                  }
                })}
              </svg>
            </Paper>
            {<div className="current-edit-container">
              {EditItem(currentItem)}
            </div>}
          </Grid>
          <Grid item lg={4}>
            <form>
              <FormControl component="legend">
                <CropperImage
                  onConfirm={this.handleConfirmCropper}
                  buttonText="上传图片"
                  onCropFile={(uploadedImageMessage) => {
                    this.setState({
                      uploadedImageMessage,
                    });
                  }}
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormGroup>
                  {fields.map((item) => {
                    return EditItem(item);
                  })}
                </FormGroup>
              </FormControl>
              <FormControl component="legend">
                {fields.map((item) => {
                  return EditItem(item);
                })}
              </FormControl>

              {/* <FormControl component="legend">
                <Button
                  color="primary"
                  download={'biocard'}
                  href={imageUrl}
                  ref={this.downloadRef}
                >
                  下载
                </Button>
              </FormControl> */}
            </form>
          </Grid>
        </Grid>
      </div >
    );
  }
}
CommonEditGroup.propTypes = {
  fields: PropTypes.array,
  // fields change callback
  onChange: PropTypes.func,
};
CommonEditGroup.defaultProps = {
  fields: [],
  onChange: (fields) => {
    return fields;
  },
};
export default CommonEditGroup;
