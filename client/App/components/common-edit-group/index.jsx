import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
      moveModelName: '',
    };
    this.biocardRef = React.createRef();
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
      this.setState({
        imageUrl: data,
      });
    });
  }
  handleConfirmCropper = (url) => {
    const { fields } = this.state;
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
  componentDidMount() {
    this.handleInitData();
  }
  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
  dragEnd = (event) => {
    this.setState({ targetbox: null });
  }

  dragStart = (event) => {
    event.dataTransfer.setData('text', event.target.id);
    this.setState({ targetbox: true });
  }

  drop = (event) => {
    if (event.target.id) {
      // this.props.swap(event.dataTransfer.getData("text"), event.target.id)
      event.dataTransfer.clearData();
    }
  }
  render() {
    const { fields, imageUrl } = this.state;
    return (
      <div>
        <Grid container>
          <Grid item>
            <svg
              height={1050}
              width={750}
              className="biocard-svg before-svg"
              ref={this.biocardRef}
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
                      draggable="true"
                      onDrop={this.drop}
                      onDragStart={this.dragStart}
                      onDragOver={event => event.preventDefault()}
                      onDragEnd={this.dragEnd}
                    /> : null;
                  case 'text':
                    return <text key={name} x={x} y={y} style={style}>{text}</text>;
                  case 'dottedLines':
                    return (
                      <g key={name} stroke={stroke} strokeWidth={strokeWidth}>
                        <path strokeDasharray={strokeDasharray} d={d} />
                      </g>
                    );
                  default:
                    return null;
                }
              })}
            </svg>
          </Grid>
          <Grid item>
            <form>
              <FormControl component="fieldset">
                <FormLabel component="legend">checked to show component </FormLabel>
                <FormGroup>
                  {fields.map((item) => {
                    const { editType, name, show, y, x } = item;
                    switch (editType) {
                      case 'checkbox':
                        return (
                          <div key={name}>
                            <FormControlLabel
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
                            <br />
                            <TextField
                              name={name}
                              margin="normal"
                              type="number"
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
                              value={x}
                              onChange={(e) => {
                                this.handleChangeLocation(e, 'x');
                              }}
                            />
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </FormGroup>
              </FormControl>
              <FormControl component="legend">
                {fields.map((item) => {
                  const { name, text, editType, y, x } = item;
                  switch (editType) {
                    case 'input':
                      return (
                        <div key={name}>
                          <TextField
                            key={name}
                            name={name}
                            placeholder={name}
                            value={text}
                            label={name}
                            onChange={this.handleChange}
                          />
                          <br />
                          <TextField
                            variant="outlined"
                            name={name}
                            margin="normal"
                            type="number"
                            value={y}
                            onChange={(e) => {
                              this.handleChangeLocation(e, 'y');
                            }}
                          />
                          <br />
                          <TextField
                            variant="outlined"
                            name={name}
                            margin="normal"
                            type="number"
                            value={x}
                            onChange={(e) => {
                              this.handleChangeLocation(e, 'x');
                            }}
                          />
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </FormControl>
              <FormControl component="legend">
                <CropperImage
                  onConfirm={this.handleConfirmCropper}
                  buttonText="上传图片"
                />
              </FormControl>
              <FormControl component="legend">
                <Button
                  color="primary"
                  download={'biocard'}
                  href={imageUrl}
                >
                  下载
                </Button>
              </FormControl>
            </form>
          </Grid>
        </Grid>
      </div>
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
