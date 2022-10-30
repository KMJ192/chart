class WebGLObj {
  private canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.getElementById('canvas-test') as HTMLCanvasElement;
  }

  private test = () => {
    const gl = this.canvas.getContext('webgl');
  };

  public run = () => {
    this.test();
  };
}

export default WebGLObj;
