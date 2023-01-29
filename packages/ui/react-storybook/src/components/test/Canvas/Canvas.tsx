import { useEffect, useRef } from 'react';

import classNames from 'classnames/bind';
import style, { slider } from './style.module.scss';
const cx = classNames.bind(style);

let COREHTML5: any = {};
COREHTML5.RoundedRectangle = function (
  strokeStyle: string,
  fillStyle: string,
  horizontalSizePercent: number,
  verticalSizePercent: number,
) {
  this.strokeStyle = strokeStyle ? strokeStyle : 'gray';
  this.fillStyle = fillStyle ? fillStyle : 'skyblue';
  horizontalSizePercent = horizontalSizePercent || 100;
  verticalSizePercent = verticalSizePercent || 100;
  this.SHADOW_COLOR = 'rgba(100, 100, 100, 0.8)';
  this.SHADOW_OFFSET_X = 3;
  this.SHADOW_OFFSET_Y = 3;
  this.SHADOW_BLUR = 3;
  this.setSizePercents(horizontalSizePercent, verticalSizePercent);
  this.createCanvas();
  this.createDOMElement();

  return this;
};

COREHTML5.RoundedRectangle.prototype = {
  createCanvas: function () {
    const canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d');
    return canvas;
  },
  createDOMElement: function () {
    this.domElement = document.createElement('div');
    this.domElement.appendChild(this.context.canvas);
  },
  appendTo: function (element: HTMLElement) {
    element.appendChild(this.domElement);
    this.domElement.style.width = `${element.offsetWidth}px`;
    this.domElement.style.height = `${element.offsetHeight}px`;
    this.resize(element.offsetWidth, element.offsetHeight);
  },
  resize: function (width: number, height: number) {
    this.HORIZONTAL_MARGIN = (width - width * this.horizontalSizePercent) / 2;
    this.VERTICAL_MARGIN = (height - height * this.verticalSizePercent) / 2;
    this.cornerRadius = (this.context.canvas.height / 2 - 2 * this.VERTICAL_MARGIN) / 2;

    this.top = this.VERTICAL_MARGIN;
    this.left = this.HORIZONTAL_MARGIN;
    this.right = this.left + width - 2 * this.HORIZONTAL_MARGIN;
    this.bottom = this.top + height - 2 * this.VERTICAL_MARGIN;

    this.context.canvas.width = width;
    this.context.canvas.height = height;
  },
  setSizePercents: function (h: number, w: number) {
    this.horizontalSizePercent = h > 1 ? h / 100 : h;
    this.verticalSizePercent = w > 1 ? w / 100 : w;
  },
  fill: function () {
    const radius = (this.bottom - this.top) / 2;

    this.context.save();
    this.context.shadowColor = this.SHADOW_COLOR;
    this.context.shadowOffsetX = this.SHADOW_OFFSET_X;
    this.context.shadowOffsetY = this.SHADOW_OFFSET_Y;
    this.context.shadowBlur = 6;

    this.context.beginPath();

    this.context.moveTo(this.left + radius, this.top);
    this.context.arcTo(this.right, this.top, this.right, this.bottom, radius);
    this.context.arcTo(this.right, this.bottom, this.left, this.bottom, radius);
    this.context.arcTo(this.left, this.bottom, this.left, this.top, radius);
    this.context.arcTo(this.right, this.top, this.right, this.top, radius);
    this.context.closePath();
    this.context.fillStyle = this.fillStyle;
    this.context.fill();
    this.context.shadowColor = undefined;
  },
  overlayGradient: function () {
    const gradient = this.context.createLinearGradient(this.left, this.top, this.left, this.bottom);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.6');
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.7');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.7');
    gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.6');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.4');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1');

    this.context.fillStyle = gradient;
    this.context.fill();

    this.context.lineWidth = 0.4;
    this.context.strokeStyle = this.strokeStyle;
    this.context.stroke();

    this.context.restore();
  },
  draw: function (context: any) {
    let originalContext;
    if (context) {
      originalContext = this.context;
      this.context = context;
    }
    this.fill();
    this.overlayGradient();

    if (context) {
      this.context = originalContext;
    }
  },
  erase: function () {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  },
};

COREHTML5.Slider = function (
  strokeStyle: string,
  fillStyle: string,
  knobPercent: number,
  hpercent: number,
  vpercent: number,
) {
  this.trough = new COREHTML5.RoundedRectangle(
    strokeStyle,
    fillStyle,
    hpercent || 95,
    vpercent || 55,
  );

  this.knobPercent = knobPercent || 0;
  this.strokeStyle = strokeStyle ? strokeStyle : 'gray';
  this.fillStyle = fillStyle ? fillStyle : 'skyblue';

  this.SHADOW_COLOR = 'rgba(100, 100, 100, .8)';
  this.SHADOW_OFFSET_X = 3;
  this.SHADOW_OFFSET_Y = 3;

  this.KNOB_SHADOW_COLOR = 'yellow';
  this.KNOB_SHADOW_OFFSET_X = 1;
  this.KNOB_SHADOW_OFFSET_Y = 1;
  this.KNOB_SHADOW_BLUR = 0;

  this.KNOB_FILL_STYLE = 'rgba(255, 255, 255, 0.45)';
  this.KNOB_STROKE_STYLE = 'rgba(0, 0, 150, 0.45)';

  this.context = document.createElement('canvas').getContext('2d');
  this.changeEventListener = [];

  this.createDOMElement();
  this.addMouseHandlers();

  return this;
};

COREHTML5.Slider.prototype = {
  createDOMElement: function () {
    this.domElement = document.createElement('div');
    this.domElement.appendChild(this.context.canvas);
  },
  appendTo: function (elementName: string) {
    document.getElementById(elementName)?.appendChild(this.domElement);
    this.setCanvasSize();
    this.resize();
  },
  setCanvasSize: function () {
    const domElementParent = this.domElement.parentNode;
    this.context.canvas.width = domElementParent.offsetWidth;
    this.context.canvas.height = domElementParent.offsetHeight;
  },
  resize: function () {
    this.cornerRadius = this.context.canvas.height / 2 - (2 * this.VERTICAL_MARGIN) / 2;
    this.top = this.HORIZONTAL_MARGIN;
    this.left = this.VERTICAL_MARGIN;
    this.right = this.left + this.context.canvas.width - 2 * this.HORIZONTAL_MARGIN;
    this.bottom = this.top + this.context.canvas.height - 2 * this.VERTICAL_MARGIN;
    this.trough.resize(this.context.canvas.width, this.context.canvas.height);
    this.knobRadius = this.context.canvas.height / 2 - this.context.lineWidth * 2;
  },
  addMouseHandlers: function () {
    const slider = this;
    this.domElement.onmouseover = function () {
      slider.context.canvas.style.cursor = 'crosshair';
    };
    this.domElement.onmousedown = function (e: any) {
      const mouse = slider.windowToCanvas(e.clientX, e.clientY);
      e.preventDefault();
      if (slider.mouseInTrough(mouse) || slider.mouseInKnob(mouse)) {
        slider.knobPercent = slider.knobPositionToPercent(mouse.x);
        slider.fireChangeEvent(e);
        slider.erase();
        slider.draw();
        slider.dragging = true;
      }
      window.addEventListener(
        'mousemove',
        function (e) {
          let mouse = null;
          let percent = null;
          e.preventDefault();
          if (slider.dragging) {
            mouse = slider.windowToCanvas(e.clientX, e.clientY);
            percent = slider.knobPositionToPercent(mouse.x);
          }
        },
        false,
      );
      window.addEventListener(
        'mouseup',
        function (e) {
          e.preventDefault();
          if (slider.dragging) {
            slider.fireChangeEvent(e);
            slider.dragging = false;
          }
        },
        false,
      );
    };
  },
  fireChangeEvent: function (e: any) {
    for (let i = 0; i < this.changeEventListener.length; i++) {
      this.changeEventListener[i](e);
    }
  },
  addChangeListener: function (listenerFunction: any) {
    this.changeEventListener.push(listenerFunction);
  },
  mouseInKnob: function (mouse: any) {
    const position = this.knobPercentToPosition(this.knobPercent);
    this.context.beginPath();
    this.context.arc(position, this.context.canvas.height / 2, this.knobRadius, 0, Math.PI * 2);

    return this.context.isPointPath(mouse.x, mouse.y);
  },
  mouseInTrough: function (mouse: any) {
    this.context.beginPath();
    this.context.rect(this.left, 0, this.right - this.left, this.bottom);

    return this.context.isPointPath(mouse.x, mouse.y);
  },
  windowToCanvas: function (x: number, y: number) {
    const bBox = this.context.canvas.getBoundingClientRect();
    return {
      x: x - bBox.left * (this.context.canvas.width / bBox.width),
      y: x - bBox.top * (this.context.canvas.height / bBox.height),
    };
  },
  knobPositionToPercent: function (position: number) {
    const troughWidth = this.right - this.left - 2 * this.knobRadius;

    return (position - this.left - this.knobRadius) / troughWidth;
  },
  knobPercentToPosition: function (percent: number) {
    if (percent > 1) percent = 1;
    if (percent < 0) percent = 0;
    const troughWidth = this.right - this.left - 2 * this.knobRadius;
    return percent * troughWidth + this.left + this.knobRadius;
  },
  fillKnob: function (position: number) {
    this.context.save();

    this.context.shadowColor = this.KNOB_SHADOW_COLOR;
    this.context.shadowOffsetX = this.KNOB_SHADOW_OFFSET_X;
    this.context.shadowOffsetY = this.KNOB_SHADOW_OFFSET_Y;
    this.context.shadowBlur = this.KNOB_SHADOW_BLUR;
    this.context.beginPath();
    this.context.arc(
      position,
      this.top + (this.bottom - this.top) / 2,
      this.knobRadius,
      0,
      Math.PI * 2,
      false,
    );
    this.context.clip();

    this.context.fillStyle = this.KNOB_FILL_STYLE;
    this.context.fill();
    this.context.restore();
  },
  strokeKnob: function () {
    this.context.save();
    this.context.lineWidth = 2;
    this.context.strokeStyle = this.KNOB_STROKE_STYLE;
    this.context.stroke();
    this.context.restore();
  },
  drawKnob: function (percent: number) {
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 2;
    this.knobPercent = percent;
    this.fillKnob(this.knobPercentToPosition(percent));
    this.strokeKnob();
  },
  drawTrough: function () {
    this.context.save();
    this.through.fillStyle = this.fillStyle;
    this.through.strokeStyle = this.strokeStyle;
    this.through.draw(this.context);
    this.context.restore();
  },
  draw: function (percent: number) {
    this.context.globalAlpha = this.opacity;
    if (percent === undefined) {
      percent = this.knobPercent;
    }
    this.drawTrough();
    this.drawKnob(percent);
  },
  erase: function () {
    this.context.clearRect(
      this.left - this.knobRadius,
      0 - this.knobRadius,
      this.context.canvas.width + 4 * this.knobRadius,
      this.context.canvas.height + 3 * this.knobRadius,
    );
  },
};

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const colorPatchContext = canvas.getContext('2d');
      if (!colorPatchContext) return;
      const redSlider = new COREHTML5.Slider('rgba(0, 0, 0)', 'rgba(255, 0, 0, 0.8', 0);
      const blueSlider = new COREHTML5.Slider('rgba(0, 0, 0)', 'rgba(0, 0, 255, 0.8', 1.0);
      const greenSlider = new COREHTML5.Slider('rgba(0, 0, 0)', 'rgba(0, 255, 0, 0.8', 0.25);
      const alphaSlider = new COREHTML5.Slider('rgba(0, 0, 0)', 'rgba(255, 255, 255, 0.8', 0.25);

      redSlider.appendTo('redSliderDiv');
      blueSlider.appendTo('blueSliderDiv');
      greenSlider.appendTo('greenSliderDiv');
      alphaSlider.appendTo('alphaSliderDiv');

      const updateColor = () => {
        let alpha: number = alphaSlider.knopPercent.toFixed(2);
        const r = redSlider.knopPercent * 255;
        const g = greenSlider.knobPercent * 255;
        const b = blueSlider.knobPercent * 255;
        const color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        colorPatchContext.fillStyle = color;
        colorPatchContext.clearRect(
          0,
          0,
          colorPatchContext.canvas.width,
          colorPatchContext.canvas.height,
        );
        colorPatchContext.fillRect(
          0,
          0,
          colorPatchContext.canvas.width,
          colorPatchContext.canvas.height,
        );
        colorPatchContext.font = '18px Arial';
        colorPatchContext.fillStyle = 'white';
        colorPatchContext.fillText(color, 10, 40);
        alpha = alpha + 2.0 > 1.0 ? 1.0 : alpha + 0.2;
        alphaSlider.opacity = alpha;
      };

      const r = (redSlider.knobPercent * 255).toFixed(0);
      const g = (greenSlider.knobPercent * 255).toFixed(0);
      const b = (blueSlider.knobPercent * 255).toFixed(0);
      const a = (alphaSlider.knobPercent * 255).toFixed(0);

      redSlider.addChangeListener(() => {
        updateColor();
        redSlider.fillStyle = `rgb(${r}, 0, 0)`;
      });

      greenSlider.addChangeListener(() => {
        updateColor();
        greenSlider.fillStyle = `rgb(0, ${g}, 0)`;
      });

      blueSlider.addChangeListener(() => {
        updateColor();
        blueSlider.fillStyle = `rgb(0, 0, ${b})`;
      });

      alphaSlider.addChangeListener(() => {
        updateColor();
        alphaSlider.fillStyle = `rgba(255, 255, 255, ${a})`;
        alphaSlider.opacity = alphaSlider.knobPercent;
      });

      redSlider.fillStyle = `rgb(${r}, 0, 0)`;
      greenSlider.fillStyle = `rgb(0, ${g}, 0)`;
      blueSlider.fillStyle = `rgb(0, 0, ${b})`;
      alphaSlider.opacity = `rgba(255, 255, 255, ${a})`;

      alphaSlider.draw();
      redSlider.draw();
      greenSlider.draw();
      blueSlider.draw();

      return () => {};
    }
  }, []);

  return (
    <div className={cx('container')}>
      <div className={cx('slider', 'red')}></div>
      <div className={cx('slider', 'green')}></div>
      <div className={cx('slider', 'blue')}></div>
      <div className={cx('slider', 'alpha')}></div>
      <canvas ref={canvasRef} width='220' height='120' className={cx('color-path-canvas')}>
        Canvas not supported
      </canvas>
    </div>
  );
}

export default Canvas;
