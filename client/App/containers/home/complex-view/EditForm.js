import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import defaultAvatar from './images/default_avatar.png';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    width: 400,
  },
  menu: {
    width: 200,
  },
  svg: {
    title: {
      fontSize: 16,
      color: 'green',
    },
  },
  preview: {
    marginTop: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit,
  },
});
const formConfig = [{
  label: '标题',
  key: 'title',
}, {
  type: 'text',
  label: '姓名',
  key: 'name',
}, {
  type: 'number',
  label: '年龄',
  key: 'age',
  min: 0,
}, {
  type: 'datetime-local',
  label: '走失日期',
  key: 'datetime',
  InputLabelProps: {
    shrink: true,
  },
}, {
  type: 'text',
  label: '走失地点',
  key: 'place',
}, {
  type: 'text',
  label: '走失原因',
  key: 'reason',
}];
class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      date: new Date(),
      place: '',
      age: '',
      title: '寻人启事',
      url: '',
      reason: '',
      avatar: defaultAvatar,
    };
    this.handleChange = this.handleChange.bind(this);
    this.imageUrl = this.imageUrl.bind(this);
    this.handleSetImage = this.handleSetImage.bind(this);
    this.svgRef = React.createRef();
  }
  handleChange(e) {
    const { name, value } = e.target;
    const newSate = {
      [name]: value,
    };
    this.setState(newSate);
    setTimeout(this.handleSetImage, 0);
  }
  handleSetImage() {
    const url = this.imageUrl();
    this.setState({
      url,
    });
  }
  imageUrl() {
    const previewSvg = this.svgRef.current;
    if (!previewSvg) {
      return '';
    }
    const xml = new XMLSerializer().serializeToString(previewSvg);
    const svg = unescape(encodeURIComponent(xml));
    const data = `data:image/svg+xml;base64,${btoa(svg)}`;
    return data;
  }
  render() {
    const { classes } = this.props;
    const timeString = moment(this.state.datetime).format('YYYY-MM-DD HH:mm');
    return (
      <Grid container spacing={8} className={classes.container}>
        <Grid item lg={6}>
          <form>
            <img src={this.state.avatar} alt="avatar" />
            {formConfig.map((item) => {
              return (
                <TextField
                  type={item.type}
                  key={item.key}
                  min={item.min}
                  value={this.state[item.key]}
                  name={item.key}
                  label={item.label}
                  InputLabelProps={item.InputLabelProps}
                  className={classes.textField}
                  onChange={this.handleChange}
                />
              );
            })}
            <Button
              className={classes.button}
              color="primary"
              download={`${this.state.name}-${timeString}-寻人启事`}
              href={this.imageUrl()}
            >
              下载寻人启事
            </Button>
          </form>
        </Grid>
        <Grid item lg={6} className={classes.preview}>
          <svg ref={this.svgRef}>
            <text className={classes.svg.title} x={0} y={20}>{this.state.title}</text>
            <text x={0} y={40}>姓名：{this.state.name}</text>
            <text x={0} y={60}>年龄：{this.state.age} 岁</text>
            <text x={0} y={80}>走失时间：{timeString}</text>
            <text x={0} y={100}>走失地点：{this.state.place}</text>
            <text x={0} y={120}>走失原因：{this.state.reason}</text>
          </svg>
        </Grid>
      </Grid>
    );
  }
}
EditForm.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EditForm);
