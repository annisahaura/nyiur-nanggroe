// Deklarasi tipe untuk impor file CSS dengan side-effect (tanpa nilai ekspor)
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// Deklarasi tipe untuk impor SVG
declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export { ReactComponent };
  const src: string;
  export default src;
}

// Deklarasi tipe untuk gambar
declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}
