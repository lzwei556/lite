import React from 'react';
import intl from 'react-intl-universal';

export * as Dayjs from './dayjsUtils';
export * from './enum';
export const createReactIntlTextNode = (text: string, variables?: any) => {
  return React.createElement(React.Fragment, undefined, intl.get(text, variables).d(text));
};
