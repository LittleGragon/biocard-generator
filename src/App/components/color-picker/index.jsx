import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleInitProps = () => {
    const { color } = this.props;
    this.setState({
      color,
    });
  }

  handleChange = (color) => {
    const { onChange } = this.props;
    this.setState({
      color,
    });
    onChange(color);
  }

  componentDidMount() {
    this.handleInitProps();
  }

  render() {
    const { color } = this.state;
    return (
      <div>
        <SketchPicker color={color} onChangeComplete={this.handleChange} />
      </div>
    );
  }
}
ColorPicker.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func,
};
ColorPicker.defaultProps = {
  color: '#fff',
  onChange: (color) => {
    return color;
  },
};

export default ColorPicker;
