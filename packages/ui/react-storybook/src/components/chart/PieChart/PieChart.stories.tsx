import { Story } from '@storybook/react';
import PieChart from './PieChart';

import type { Args } from './types';

export default {
  title: 'Chart/PieChart',
  component: PieChart,
  parameters: {
    componentSubtitle: 'PieChart',
  },
};

const webGLTemplate = (args: Args): JSX.Element => {
  return <PieChart {...args} />;
};

export const WebGLTest: Story<Args> = webGLTemplate.bind({});
WebGLTest.args = {};
