class Animation {
  private canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.getElementById('canvas-test') as HTMLCanvasElement;
  }

  private animate = (time: number) => {
    window.requestAnimationFrame(this.animate);

    return () => {
      // window.cancelAnimationFrame(this.animate);
    };
  };

  public run = () => {
    const unmount: Array<() => void> = [];
    unmount.push(this.animate(1));

    return () => {
      unmount.forEach((obj) => obj());
    };
  };
}

export default Animation;
