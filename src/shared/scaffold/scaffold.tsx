import { ReactNodeProps } from '../types/react-elem.type';
import React from 'react';

type ScaffoldProps = ReactNodeProps<{
  title?: string,
  footer?: React.ReactNode
}>;

function Scaffold({ title, children, footer }: ScaffoldProps) {
  return <div className="scaffold">
    <header><h1>{title}</h1></header>
    <main>{children}</main>
    <footer>
      {footer}
    </footer>
  </div>
}

export default Scaffold
