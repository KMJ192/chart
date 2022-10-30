import React from 'react';

import { Story } from '@storybook/react';
import Canvas from './Canvas';

import type { CanvasTypes } from './types';

export default {
  title: 'Test/Canvas',
  component: Canvas,
  parameters: {
    componentSubtitle: 'Canvas',
  },
};

const webGLTemplate = (args: CanvasTypes): JSX.Element => {
  return <Canvas {...args} />;
};

export const CanvasTest: Story<CanvasTypes> = webGLTemplate.bind({});
CanvasTest.args = {};
