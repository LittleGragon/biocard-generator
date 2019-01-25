class UrlUtil {
  transSvgToBase64(previewSvg) {
    if (!previewSvg) {
      return '';
    }
    const xml = new XMLSerializer().serializeToString(previewSvg);
    const svg = unescape(encodeURIComponent(xml));
    const data = `data:image/svg+xml;base64,${btoa(svg)}`;
    return data;
  }
}
export default new UrlUtil();
