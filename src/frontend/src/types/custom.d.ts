import type React from '@types/react';

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
declare module 'ol/style';
declare module 'pako/lib/deflate';
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends IntrinsicElements {
      'hot-tracking': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'site-id'?: string;
        domain?: string;
        force?: boolean;
      };
      'hot-header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        class?: string;
        title?: string;
        size?: string;
        borderBottom?: boolean;
        drawer?: boolean;
        showLogin?: boolean;
        loginProviders?: string;
        defaultLoginIcon?: string;
        onLogin?: () => void;
      };
      'hot-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        class?: string;
        onclick?: () => void;
        onkeydown?: (e: React.KeyboardEvent) => void;
        role?: string;
        tabindex?: number;
        'aria-label'?: string;
      };
      'hot-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: string;
        size?: string;
        class?: string;
        onclick?: () => void;
        onkeydown?: (e: React.KeyboardEvent) => void;
        role?: string;
        tabindex?: number;
        disabled?: boolean;
        caret?: boolean;
        slot?: string;
      };
    }
  }
}
