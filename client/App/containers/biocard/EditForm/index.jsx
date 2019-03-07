import React from 'react';
import CommonEditGroup from '$components/common-edit-group';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import logoBadge from '../images/ingress_logo_badge.png';
import orangeTrim from '../images/orange_trim.png';
import beforeColorsBox from '../images/before_colors_box.png';
import eighteenYearBadge from '../images/18_year_badge.png';
import backColorBox from '../images/colors_box.png';
import logo from '../images/ingress_logo.png';
import niaBadge from '../images/NIA_badge.png';
import './style.less';

const styles = {
  biocardContainer: {
  },
  base: {
    fill: '#ccc',
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
    color: '#c3751a',
    margin: 0,
  },
  unaligned: {
    fontSize: 29,
    fill: '#c3751a',
  },
  backLogo: {
    width: 62,
  },
  backLongDesc: {
    fontSize: 21,
    color: '#ffffff',
    margin: 0,
  },
};
class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'before',
      beforeFileds: [{
        type: 'basePanel',
        style: styles.base,
        name: 'beforeBase',
      }, {
        xlinkHref: logoBadge,
        x: 59,
        y: 57,
        name: 'logoBadge',
        show: true,
        type: 'image',
        editType: 'checkbox',
        width: 127 * 2,
        height: 165 * 2,
      }, {
        xlinkHref: orangeTrim,
        x: 0,
        y: 838,
        name: 'orangeTrim',
        show: true,
        type: 'image',
        editType: 'checkbox',
        width: 750,
        height: 28,
      }, {
        xlinkHref: beforeColorsBox,
        x: 598,
        y: 988,
        name: 'beforeCorlorBox',
        show: true,
        type: 'image',
        editType: 'checkbox',
        width: 85,
        height: 42,
      }, {
        xlinkHref: eighteenYearBadge,
        x: 599,
        y: 892,
        name: 'eightenYearBadge',
        show: true,
        type: 'image',
        editType: 'checkbox',
        width: 82,
        height: 87,
      },
      {
        text: 'Agent',
        name: 'agent_name',
        x: 70,
        y: 980,
        className: 'agent-name-before',
        style: styles.agentName,
        type: 'text',
        editType: 'input',
      },
      ],
      backFields: [{
        type: 'basePanel',
        style: styles.base,
        name: 'backBase',
      }, {
        xlinkHref: backColorBox,
        name: 'backColorBox',
        x: 91,
        y: 888,
        show: true,
        type: 'image',
        editType: 'checkbox',
        width: 79,
        height: 65,
      }, {
        xlinkHref: logo,
        name: 'logo',
        x: 184,
        y: 888,
        show: true,
        style: styles.backLogo,
        type: 'image',
        editType: 'checkbox',
        width: 62,
        height: Math.ceil(62 * (2032 / 1760)),
      }, {
        xlinkHref: niaBadge,
        name: 'niaBadge',
        x: 280,
        y: 850,
        show: true,
        type: 'image',
        editType: 'checkbox',
        width: 285,
        height: 105,
      }, {
        x: 90,
        y: 330,
        width: 576,
        height: 443,
        name: 'long_desc',
        text: 'desc',
        type: 'multiText',
        editType: 'input',
        style: styles.backLongDesc,
      }, {
        text: 'AGENTNAME',
        name: 'agent_name',
        x: 89,
        y: 162,
        style: styles.backAgentName,
        type: 'text',
        editType: 'input',
      }, {
        x: 91,
        y: 230,
        name: 'desc',
        text: 'DESCRIPTION GOES HERE',
        style: styles.backDesc,
        type: 'multiText',
        editType: 'input',
        height: 48,
        width: 576,
      }, {
        x: 90,
        y: 870,
        name: 'unaligned',
        style: styles.unaligned,
        text: 'UNALIGNED',
        type: 'text',
        editType: 'input',
      }, {
        stroke: '#c3751a',
        strokeDasharray: '5, 5',
        name: 'line_one',
        d: 'M90 230 l571 0',
        strokeWidth: 2,
        type: 'dottedLines',
      }, {
        stroke: '#c3751a',
        strokeDasharray: '5, 5',
        name: 'line_two',
        d: 'M90 312 l571 0',
        strokeWidth: 2,
        type: 'dottedLines',
      }, {
        stroke: '#c3751a',
        strokeDasharray: '5, 5',
        name: 'line_three',
        d: 'M90 830 l571 0',
        strokeWidth: 2,
        type: 'dottedLines',
      }],
    };
  }

  render() {
    const { beforeFileds, backFields, tabValue } = this.state;
    return (
      <div>
        <Tabs
          value={tabValue}
          onChange={(e, value) => {
            this.setState({
              tabValue: value,
            });
          }}
        >
          <Tab value="before" label="前面版" />
          <Tab value="after" label="后面板" />
        </Tabs>
        <Typography component="div" style={{ padding: 8 * 3 }}>
          {tabValue === 'before' && (
          <CommonEditGroup
            fields={beforeFileds}
            onChange={(fields) => {
              this.setState({
                beforeFileds: fields,
              });
            }}
          />
          )}
          {tabValue === 'after' && (
          <CommonEditGroup
            fields={backFields}
            onChange={(fields) => {
              this.setState({
                backFields: fields,
              });
            }}
          />
          )}
        </Typography>
      </div>
    );
  }
}
export default EditForm;
