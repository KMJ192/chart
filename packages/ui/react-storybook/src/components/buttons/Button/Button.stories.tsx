import React from 'react';

import Button from './Button';

import { buttonType } from './types';

export default {
  title: 'Button',
  component: Button,
  parameters: {
    componentSubtitle: 'Button',
  },
};

export const primaryButton = (): JSX.Element => {
  return <Button theme={buttonType.PRIMARY}>primary btn</Button>;
};

export const secondaryButton = (): JSX.Element => {
  return <Button theme={buttonType.SECONDARY}>secondary btn</Button>;
};
