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
import './style';

const styles = {
  biocardContainer: {
  },
  base: {
    background: '#000000',
    width: '100%',
    height: '100%',
  },
  agentName: {
    fontFamily: 'GeomGraphic-SemiBold',
    fontSize: 68,
    fill: '#ffffff',
  },
  backAgentName: {
    fontSize: 71,
    fill: '#ffffff',
  },
  backDesc: {
    fontSize: 25,
    lineHeight: '41px',
    fill: '#c3751a',
  },
  unaligned: {
    fontSize: 29,
    fill: '#c3751a',
  },
  backLogo: {
    width: 62,
  },
};
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
    fields.unshift(newImage);
    this.setFields(fields);
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
  componentDidMount() {
    this.handleInitData();
  }
  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
  render() {
    const { fields, editModuleName } = this.state;
    const currentItem = fields.find(item => {
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
      } = item;
      return (
        <div key={name}>
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
          {item.editType === 'input' && <TextField
            key={name}
            name={name}
            placeholder={name}
            value={text}
            label={name}
            onChange={this.handleChange}
          />}
          <br />
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
          <br />
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
      );
    };
    return (
      <div>
        <Grid container>
          <Grid item>
            <Paper className="biocard-paper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={1050}
                width={750}
                className="biocard-svg before-svg"
                ref={this.biocardRef}
                id="cardSvg"
              >
                <rect
                  style={styles.base}
                />
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
                    default:
                      return null;
                  }
                })}
              </svg>
            </Paper>
            {EditItem(currentItem)}
          </Grid>
          <Grid item>
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
