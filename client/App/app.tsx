import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill';
import { BrowserRouter } from 'react-router-dom';
import RouterContent from './routes.tsx';
import './font/Geom_Graphic_Semi-Bold.ttf';
declare const CanvasRenderingContext2D
declare const window;
// TODO:之后再把这类代码收拢一下
CanvasRenderingContext2D.prototype.wrapText = function (text, x, locationY, mw, lh) {
  let maxWidth = mw;
  let lineHeight = lh;
  const context = this;
  const { canvas } = context;
  // const canvas: Element = context.canvas;
  if (typeof maxWidth === 'undefined') {
    maxWidth = (canvas && canvas.width) || 300;
  }
  if (typeof lineHeight === 'undefined') {
    if(canvas) {
      lineHeight = (parseInt(window.getComputedStyle(canvas).lineHeight, 10))
      || parseInt(window.getComputedStyle(document.body).lineHeight, 10);
    }
  }
  let y = locationY + lineHeight * 0.8;
  if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
    return;
  }

  // 字符分隔为数组
  const arrText = text.split('');
  let line = '';

  for (let n = 0; n < arrText.length; n += 1) {
    const testLine = line + arrText[n];
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = arrText[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
};
const rootDocument = document.getElementById('app');
render(<BrowserRouter><RouterContent /></BrowserRouter>, rootDocument);
