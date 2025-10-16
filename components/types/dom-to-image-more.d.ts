// types/dom-to-image-more.d.ts
declare module 'dom-to-image-more' {
  // minimal surface you use; everything as `any` is fine for now
  export function toPng(
    node: HTMLElement,
    options?: {
      filter?: (node: Element) => boolean;
      bgcolor?: string;
      width?: number;
      height?: number;
      style?: Partial<CSSStyleDeclaration> | Record<string, string>;
      quality?: number;
      pixelRatio?: number;
      cacheBust?: boolean;
      imagePlaceholder?: string;
      skipFonts?: boolean;
    }
  ): Promise<string>;
}
