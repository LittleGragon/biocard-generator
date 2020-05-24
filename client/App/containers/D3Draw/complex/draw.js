import * as d3 from 'd3';

class Draw {
  init(container) {
    console.log('init');
    return d3.select(container);
  }
}


export default Draw;
