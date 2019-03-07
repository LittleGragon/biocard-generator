import _ from 'lodash';

class ImageUtil {
  async transImageUrlByMime(originUrl, mime) {
    const pr = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = originUrl;
      const transImageByCanvas = () => {
        const width = _.get(this, 'width', 0);
        const height = _.get(this, 'height', 0);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const downloadUrl = canvas.toDataURL(mime);
        resolve(downloadUrl);
      };
      image.onload = transImageByCanvas();
    });
    const url = await pr;
    return url;
  }

  async downloadImage(originUrl, mime) {
    const url = await this.transImageUrlByMime(originUrl, mime);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'biocard');
    a.click();
  }
}
export default new ImageUtil();
