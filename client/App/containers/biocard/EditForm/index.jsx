import React from 'react';
import { Grid, Checkbox, FormControl, FormLabel, FormGroup, FormControlLabel, Button, TextField } from 'material-ui';
import CropperImage from '$components/cropper-img';
import './style';
import logoBadge from '../images/ingress_logo_badge.png';
import orangeTrim from '../images/orange_trim.png';
import beforeColorsBox from '../images/before_colors_box.png';
import eighteenYearBadge from '../images/18_year_badge.png';
// import urlUtils from '$utils/url';
const styles = {
  biocardContainer: {
  },
  base: {
    fill: '#000000',
    width: '100%',
    height: '100%',
  },
  agentName: {
    fontFamily: 'GeomGraphic-SemiBold',
    fontSize: 68,
    fill: '#ffffff',
  },
};
class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      images: [{
        xlinkHref: logoBadge,
        x: 59,
        y: 57,
        name: 'logoBadge',
        show: true,
      }, {
        xlinkHref: orangeTrim,
        x: 0,
        y: 838,
        name: 'orangeTrim',
        show: true,
      }, {
        xlinkHref: beforeColorsBox,
        x: 598,
        y: 988,
        name: 'beforeCorlorBox',
        show: true,
      }, {
        xlinkHref: eighteenYearBadge,
        x: 599,
        y: 892,
        name: 'eightenYearBadge',
        show: true,
      }],
      texts: [{
        text: 'Agent',
        name: 'agent_name',
        x: 70,
        y: 980,
        className: 'agent-name-before',
        style: styles.agentName,
      }],
      done: false,
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.biocardRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.setImageUrl = this.setImageUrl.bind(this);
    this.handleConfirmCropper = this.handleConfirmCropper.bind(this);
  }
  handleCheck(e) {
    const { checked, name } = e.target;
    const { images } = this.state;
    const newImages = images.map((item) => {
      if (item.name === name) {
        return Object.assign({}, item, {
          show: checked,
        });
      }
      return item;
    });
    this.setState({
      images: newImages,
    });
    this.setImageUrl();
  }
  handleChange(e) {
    const { name, value } = e.target;
    const { texts } = this.state;
    const newTexts = texts.map((item) => {
      if (name === item.name) {
        return Object.assign({}, item, {
          text: value,
        });
      }
      return item;
    });
    this.setState({
      texts: newTexts,
    });
    this.setImageUrl();
  }
  setImageUrl() {
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
  handleConfirmCropper(url) {
    const { images } = this.state;
    const newImage = {
      xlinkHref: url,
      x: 0,
      y: 0,
      name: 'mainImage',
      show: true,
    };
    images.unshift(newImage);
    this.setState({
      images,
    });
  }
  render() {
    const { images, texts, imageUrl } = this.state;
    return (
      <div >
        <Grid container>
          <Grid item>
            <svg
              height={1050}
              width={750}
              className="biocard-container"
              ref={this.biocardRef}
            >
              <rect
                style={styles.base}
                className="biocard-base"
              />
              {images.map((item) => {
                const { name, show, ...others } = item;
                return show ? <image key={name} {...others} /> : null;
              })}
              {texts.map((item) => {
                const { name, text, ...others } = item;
                return <text key={name} {...others} >{text}</text>;
              })}
            </svg>
          </Grid>
          <Grid item >
            <form>
              <FormControl component="fieldset">
                <FormLabel component="legend">checked to show component </FormLabel>
                <FormGroup>
                  {images.map((item) => {
                    const { name, show } = item;
                    return (
                      <FormControlLabel
                        key={name}
                        control={
                          <Checkbox
                            name={name}
                            checked={show}
                          />
                        }
                        onChange={this.handleCheck}
                        label={name}
                      />
                    );
                  })}
                </FormGroup>
              </FormControl>

              <FormControl component="legend">
                {texts.map((item) => {
                  const { name, text } = item;
                  return (
                    <TextField
                      key={name}
                      name={name}
                      placeholder={name}
                      value={text}
                      label={name}
                      onChange={this.handleChange}
                    />
                  );
                })}
              </FormControl>
              <FormControl component="legend">
                <CropperImage
                  onConfirm={this.handleConfirmCropper}
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
        <img
          src={imageUrl}
          alt="preview_biocard"
          className="preview"
        />
      </div>
    );
  }
}
export default EditForm;
