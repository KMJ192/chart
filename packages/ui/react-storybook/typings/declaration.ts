declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.styl' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare interface Vector {
  x: number;
  y: number;
}

declare interface ObjectType {
  [key: string]: any;
}

declare interface Size {
  width: number;
  height: number;
}

declare interface RectArea<T> {
  top: T;
  bottom: T;
  left: T;
  right: T;
}
