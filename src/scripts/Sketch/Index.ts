import Camera from "./Camera";
import Drawing from "./Images/Drawing";
import Background from "./Images/Background";
import AbstractImage from "./Images/AbstractImage";
import ToolsManager from "./Tools/ToolsManager";
import { Coordinate } from "./types/eventsTypes";
import Animation from "./Animation";
import HistoryManager from "./History";
import exportGif from "./utils/export/gif/exportGif";
import exportPng from "./utils/export/png/exportPng";
import exportJson from "./utils/export/json/exportJson";
import loadJson from "./utils/import/loadJson";

export default class Sketch extends HTMLElement {
  public _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  // public layers: LayersManager
  public animation: Animation;
  private _cursor: Drawing;
  private _background: AbstractImage;
  public camera: Camera;
  public size = 1;
  public color: string = "#000000";
  private _tools: ToolsManager;
  private _history: HistoryManager;
  public onion = false;

  private _animationFrame: number | null = null;
  private _nextFrame: number | null = null;

  public playing = false;
  private _savedFrame: number | null = null;

  public fps = 5;

  constructor() {
    super();
    this._canvas = this._createCanvas()!;
    this._ctx = this._canvas.getContext("2d")!;

    // this.layers = new LayersManager(this)
    this.animation = new Animation(this);
    this._cursor = new Drawing(this.width, this.height);
    this._background = new Background(this.width, this.height);
    this.camera = new Camera(this, this._canvas);

    this._tools = new ToolsManager(this, this.animation, this._cursor);
    this._history = new HistoryManager(this, this.animation);
  }

  connectedCallback() {
    this.camera.fitSketch();
    this.updatePreview();
  }

  private _createCanvas() {
    const shadow = this.attachShadow({ mode: "open" });
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    const style = document.createElement("style");
    style.textContent = /*css*/ `
        canvas{
			-webkit-optimize-contrast: pixelated;
			-ms-interpolation-mode: nearest-neighbor;
			image-rendering: crisp-edges;  
			image-rendering: pixelated;    
			background-color: #ffff;
			cursor:crosshair;
			pointer-events:none;
        }
        `;
    shadow.appendChild(canvas);
    shadow.appendChild(style);
    return canvas;
  }
  get width() {
    return this._canvas.width;
  }
  get height() {
    return this._canvas.height;
  }

  set tool(value: string) {
    this._tools.tool = value;
  }

  get actif() {
    return this.animation.actif && !this.playing;
  }

  static get observedAttributes() {
    return ["width", "height"];
  }

  public crop(x: number, y: number, width: number, height: number) {
    this._canvas.width = width;
    this._canvas.height = height;
    this.animation.crop(x, y, width, height);
    this._cursor.resize(width, height);
    this._background.resize(width, height);
    this._background.clear();
    this.camera.fitSketch();
    this.updatePreview();
    this.dispatchUpdate();
  }
  public resize(width: number, height: number, hAlign: number, vAlign: number) {
    this._canvas.width = width;
    this._canvas.height = height;
    this.animation.resize(width, height, hAlign, vAlign);
    this._cursor.resize(width, height);
    this._background.resize(width, height);
    this._background.clear();
    this.camera.fitSketch();
    this.updatePreview();
    this.dispatchUpdate();
  }

  attributeChangedCallback(name: string, _: string, val: string) {
    if (!val || isNaN(Number(val))) return;
    const value = Number(val);
    switch (name) {
      case "width":
        if (value >= 1) {
          this._canvas.width = value;
          this.animation.resize(value, this._canvas.height);
          this._cursor.resize(value, this._canvas.height);
          this._background.resize(value, this._canvas.height);
          this._background.clear();
          this.camera.fitSketch();
          this.updatePreview();
        }
        break;
      case "height":
        this._canvas.height = value;
        this.animation.resize(this._canvas.width, value);
        this._cursor.resize(this._canvas.width, value);
        this._background.resize(this._canvas.width, value);
        this._background.clear();
        this.camera.fitSketch();
        this.updatePreview();
        break;
      default:
        return;
    }
  }

  public updatePreview() {
    const onionImg = this.animation.previousFrame?.preview;

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.drawImage(this._background.canvas, 0, 0);
    this._ctx.globalAlpha = 0.4;
    if (this.onion && onionImg && !this.playing)
      this._ctx.drawImage(onionImg, 0, 0);
    this._ctx.globalAlpha = 1;
    if (this.animation.currentFrame)
      this._ctx.drawImage(this.animation.currentFrame.preview, 0, 0);
    this._ctx.drawImage(this._cursor.canvas, 0, 0);
  }

  public clear() {
    this._background.clear();
    this.animation.clear();
    this._cursor.clear();
    this.updatePreview();
    this.dispatchUpdate();
    this.historyPush();
  }

  public historyPush() {
    this._history.push();
  }

  public undo() {
    this._history.undo();
    this.updatePreview();
  }

  public redo() {
    this._history.redo();
    this.updatePreview();
  }

  public gridCoordinate({ x, y }: Coordinate): Coordinate {
    const { left, top } = this._canvas.getBoundingClientRect();
    const px = (x - left) / this.camera.zoomValue;
    const py = (y - top) / this.camera.zoomValue;
    return { x: Math.floor(px), y: Math.floor(py) };
  }

  public dispatchUpdate() {
    this.dispatchEvent(new CustomEvent("update"));
  }
  public dispatchLoadFile() {
    this.dispatchEvent(new CustomEvent("load"));
  }

  public stop() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      if (this._savedFrame) this.animation.selectFrame(this._savedFrame);
      this.updatePreview();
    }
    this.playing = false;
  }

  public play() {
    this._nextFrame = window.performance.now();
    this._savedFrame = this.animation.currentFrame?.id ?? 1;
    this._loop();
    this.playing = true;
  }

  public download(
    fileName: string,
    format: string,
    scale: number,
    columns: number,
    rows: number,
  ) {
    const frames = this.animation.frames.map((f) => f.preview);
    switch (format) {
      case "gif":
        exportGif(fileName, frames, this.fps, scale);
        break;
      case "png":
        exportPng(fileName, frames, scale, columns, rows);
        break;
      case "json":
        exportJson(fileName, this.getDatas());
        break;
    }
  }

  public loadJson(str: string) {
    loadJson(str, this);
  }

  public getDatas() {
    const width = this.width;
    const height = this.height;
    const selectedFrame = this.animation.frameIndex;
    const frames = this.animation.frames.map((f) => f.getDatas());
    return { width, height, selectedFrame, frames };
  }

  private _loop() {
    this._animationFrame = requestAnimationFrame(() => this._loop());
    const now = window.performance.now();
    this._nextFrame = this._nextFrame ?? now;
    if (now < this._nextFrame) return;
    this.animation.nextFrame();
    this.updatePreview();
    this._nextFrame += 1000 / this.fps;
    this.updatePreview();
  }
}
