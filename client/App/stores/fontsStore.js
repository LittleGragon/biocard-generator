import { observable, action, computed } from 'mobx';
import axios from 'axios';

class FontsStore {
  @observable fontList = [
    'Baloo',
    'Fredericka the Great',
    'Prosto One',
  ];

  @computed get fontLink() {
    const fontString = this.fontList.map((font) => {
      return font.replace(/\s/g, '+');
    }).join('|');
    const fontLink = `https://fonts.googleapis.com/css?family=${fontString}&amp;subset=cyrillic`;
    return fontLink;
  }

  @action loadFontList = async () => {
    const res = await axios({
      method: 'get',
      url: '/fonts',
    });
    const { data } = res.data;
    this.fontList = data.familyMetadataList.map((font) => {
      return font.family;
    });
  }
}
export default new FontsStore();
