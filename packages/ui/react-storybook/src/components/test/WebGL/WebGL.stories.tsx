import React from 'react';

import { Story } from '@storybook/react';
import WebGL from './WebGL';

import type { WebGLType } from './types';

export default {
  title: 'Test/WebGL',
  component: WebGL,
  parameters: {
    componentSubtitle: 'WebGL',
  },
};

const webGLTemplate = (args: WebGLType): JSX.Element => {
  return <WebGL {...args} />;
};

export const WebGLTest: Story<WebGLType> = webGLTemplate.bind({});
WebGLTest.args = {};
