class ImageUtil {
  async transImageUrlByMime(originUrl, mime) {
    const pr = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = originUrl;
      const transImageByCanvas = () => {
        const width = 750;
        const height = 1050;
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
    this.createDownload(url);
  }

  createDownload(url) {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'biocard');
    a.click();
  }

  downloadImageByMime(canvas, mime) {
    const url = canvas.toDataURL(mime);
    this.createDownload(url);
  }
}
export default new ImageUtil();
