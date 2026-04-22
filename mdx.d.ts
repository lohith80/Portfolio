declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export const meta: Record<string, unknown>;
  export default Component;
}
