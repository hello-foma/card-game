import React from 'react';

export type ReactNodeProps<T> = T & {
  children?: React.ReactNode;
};
