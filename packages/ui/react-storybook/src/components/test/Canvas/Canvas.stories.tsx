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

const canvasTestTemplate = (args: CanvasTypes): JSX.Element => {
  return <Canvas {...args} />;
};

export const CanvasTest: Story<CanvasTypes> = canvasTestTemplate.bind({});
CanvasTest.args = {};
