import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CropperImage from '$components/cropper-img';
import ColorPicker from '$components/color-picker';
import './style';
import globalStore from '$stores/globalStore';

class CommonEditGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      imageUrl: '',
      editModuleName: '',
      uploadedImageMessage: {
        width: 0,
        height: 0,
      },
    };
    this.biocardRef = React.createRef();
    this.downloadRef = React.createRef();
    this.objectRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  setFields(fields) {
    const { onChange } = this.props;
    this.setState((state) => {
      return {
        ...state,
        fields,
      };
    });
    onChange(fields);
    this.setImageUrl(fields);
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

  setImageUrl = (fields = []) => {
    const previewSvg = this.biocardRef.current;
    if (!previewSvg) {
      return '';
    }
    const xml = new XMLSerializer().serializeToString(previewSvg);
    const svg = unescape(encodeURIComponent(xml));
    const data = `data:image/svg+xml;base64,${btoa(svg)}`;
    window.imageBase64 = data;
    this.setState((state) => {
      return {
        ...state,
        imageUrl: data,
      };
    });
  }

  handleDrawCanvas = () => {
    const { fields } = this.state;
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    const width = _.get(canvas, 'width', 0);
    const height = _.get(canvas, 'height', 0);
    context.clearRect(0, 0, width, height);
    fields.forEach((item) => {
      const type = _.get(item, 'type');
      const x = _.get(item, 'x', 0);
      const y = _.get(item, 'y', 0);
      const fillColor = _.get(item, 'style.fill', '');
      const longTextColor = _.get(item, 'style.color', '');
      const color = type === 'multiText' ? longTextColor : fillColor;
      const show = _.get(item, 'show', true);
      switch (type) {
        case 'dottedLines': {
          const strokeDasharray = _.get(item, 'strokeDasharray', '');
          const d = _.get(item, 'd', '');
          const locationPoint = d.split(' ');
          const [startX, startY, endX] = locationPoint;
          const locationY = parseInt(startY, 10);
          const locationStartX = parseInt(startX.replace('M', ''), 10);
          const lineLength = parseInt(endX.replace('l', ''), 10);
          const locationEndX = locationStartX + lineLength;
          const startPoint = [locationStartX, locationY];
          const endPoint = [locationEndX, locationY];
          const dash = strokeDasharray.split(',');
          const stroke = _.get(item, 'stroke', '');
          context.setLineDash(dash);
          context.lineDashOffset = 2;
          context.strokeStyle = stroke;
          context.beginPath();
          context.moveTo(...startPoint);
          context.lineTo(...endPoint);
          context.stroke();
          break;
        }
        case 'basePanel': {
          if (show) {
            context.fillStyle = color;
            context.fillRect(0, 0, width, height);
          }
          break;
        }
        case 'text': {
          if (show) {
            const fontFamily = _.get(item, 'style.fontFamily', '');
            const fontSize = _.get(item, 'style.fontSize', '');
            const text = _.get(item, 'text', '');
            context.font = `${fontSize}px ${fontFamily}`;
            context.fillStyle = `${color}`;
            context.fillText(text, x, y);
          }
          break;
        }
        case 'multiText': {
          if (show) {
            const fontFamily = _.get(item, 'style.fontFamily', '');
            const fontSize = _.get(item, 'style.fontSize', '');
            const lineHeight = _.get(item, 'style.lineHeight');
            const text = _.get(item, 'text', '');
            context.font = `${fontSize}px ${fontFamily}`;
            context.fillStyle = `${color}`;
            const lh = parseInt(lineHeight.replace('px', ''), 10);
            context.wrapText(text, x, y, item.width, lh);
          }
          break;
        }
        case 'image':
        {
          if (show) {
            const dWidth = _.get(item, 'width', 0);
            const dHeight = _.get(item, 'height', 0);
            const xlinkHref = _.get(item, 'xlinkHref', '');
            const image = new Image();
            image.src = xlinkHref;
            context.drawImage(image, x, y, dWidth, dHeight);
          }
          break;
        }
        default:
          break;
      }
    });
    globalStore.setCanvas(canvas);
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
          if (Number(value) === 0) {
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
          if (Number(value) === 0) {
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
    });
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  componentDidMount() {
    this.handleDrawCanvas();
  }

  componentDidUpdate() {
    this.handleDrawCanvas();
  }

  static getDerivedStateFromProps(props, state) {
    const { fields } = props;
    return { fields };
  }

  render() {
    const { fields, editModuleName, imageUrl } = this.state;
    const { fontsStore } = this.props;
    const currentItem = fields.find((item) => {
      return item.name === editModuleName;
    });
    const { fontList } = fontsStore;
    const baseHeight = 1050;
    const baseWidth = 750;
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
            {color && (
              <ColorPicker
                color={color}
                onChange={({ hex }) => {
                  this.handleChangeColor({
                    value: hex,
                    name,
                    key: colorKey,
                  });
                }}
              />
            )}
          </FormControl>
          {color && (
            <TextField
              name={name}
              value={color}
              label="color"
              onChange={(e) => {
                const { value } = e.target;
                this.handleChangeColor({ value, name, key: colorKey });
              }}
            />
          )}
          <br />
          {editType === 'checkbox' && (
            <FormControlLabel
              key={name}
              label={name}
              control={(
                <Checkbox
                  name={name}
                  checked={show}
                  onChange={this.handleCheck}
                />
              )}
            />
          )
          }
          {item.editType === 'input' && (
            <div>
              <TextField
                key={name}
                name={name}
                placeholder={name}
                value={text}
                label={name}
                onChange={this.handleChange}
              />
              <br />
            </div>
          )}
          {item.editType === 'textarea' && (
            <FormControl>
              <textarea
                name={name}
                key={name}
                value={_.get(item, 'text')}
                onChange={this.handleChange}
              />
            </FormControl>
          )}
          {item.editType === 'input' && (
            <FormControl>
              <InputLabel>Font Family</InputLabel>
              <Select
                style={{ width: 167 }}
                placeholder="字体"
                value={_.get(item, 'style.fontFamily', '')}
                onChange={(e) => {
                  const { value } = e.target;
                  this.handleChangeFields({
                    key: 'style',
                    name,
                    value: { ...item.style, fontFamily: value },
                  });
                }}
              >
                {fontList.map((font) => {
                  return (
                    <MenuItem
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
          {type !== 'basePanel' && (
            <div>
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
            </div>
          )}
          {type !== 'basePanel' && (
            <div>
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
            </div>
          )}
          {type !== 'basePanel' && (
            <TextField
              name={name}
              margin="normal"
              type="number"
              label="width"
              value={width}
              onChange={(e) => {
                this.handleChangeSize(e, 'width');
              }}
            />
          )}
          <br />
          {type !== 'basePanel' && (
            <div>
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
            </div>
          )}
        </div>
      );
    };
    return (
      <div>
        <Grid container>
          <Grid item lg={5}>
            <div style={{ width: 375 }}>
              <CropperImage
                onConfirm={this.handleConfirmCropper}
                buttonText="上传图片"
                onCropFile={(uploadedImageMessage) => {
                  this.setState({
                    uploadedImageMessage,
                  });
                }}
              />
            </div>
            <Paper className="biocard-paper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height={baseHeight}
                width={baseWidth}
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
                      return show ? (
                        <image
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
                        />
                      ) : null;
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
                              whiteSpace: 'pre-wrap',
                            })}
                          >
                            {text}
                          </p>
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
                      return (
                        <rect
                          style={style}
                          key={name}
                          onClick={() => {
                            this.setState({
                              editModuleName: name,
                            });
                          }}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </svg>
            </Paper>
          </Grid>
          <Grid item lg={4}>
            <div className="current-edit-container">
              {EditItem(currentItem)}
            </div>
          </Grid>
        </Grid>
        <img src={imageUrl} alt="预览图片" style={{ display: 'none' }} />
        <canvas style={{ display: 'none' }} ref={this.canvasRef} width={baseWidth} height={baseHeight} />
      </div>
    );
  }
}
CommonEditGroup.propTypes = {
  fields: PropTypes.array, // eslint-disable-line
  // fields change callback
  onChange: PropTypes.func,
  fontsStore: PropTypes.object.isRequired,
};
CommonEditGroup.defaultProps = {
  fields: [],
  onChange: (fields) => {
    return fields;
  },
};
export default CommonEditGroup;
