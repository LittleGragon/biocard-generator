import React from 'react';
import Draw from './complex/draw';

const draw = new Draw();
export default class D3Draw extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    console.log('cc', this.container.current);
    const drawFunc = draw
      .init(this.container.current);

    drawFunc.append('line')
      .attr('stroke-dasharray', '2 0')
      .attr('x1', 20)
      .attr('y1', 20)
      .attr('x2', 100)
      .attr('y2', 20)
      .attr('stroke', 'red');

    drawFunc.append('circle')
      .attr('cx', 20)
      .attr('cy', 20)
      .attr('r', 2)
      .attr('fill', 'red')
      .attr('stroke', 'red');

    drawFunc.append('path')
      .attr('d', 'M 100 15 L 110 20 L 100 25')
      .attr('fill', 'red');
  }

  render() {
    return (
      <div>
        <svg id="d3-container" ref={this.container} />
      </div>
    );
  }
}
