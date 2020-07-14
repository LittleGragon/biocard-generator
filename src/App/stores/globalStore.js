import { observable, action } from 'mobx';

class GlobalStore {
  @observable downloadCanvas = '';

  @action setCanvas = (canvas) => {
    this.downloadCanvas = canvas;
  }
}

export default new GlobalStore();
