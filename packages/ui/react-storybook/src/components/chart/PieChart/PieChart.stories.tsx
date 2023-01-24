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

const pieChartTemplate = (args: Args): JSX.Element => {
  return <PieChart {...args} />;
};

export const PieChartTemplate: Story<Args> = pieChartTemplate.bind({});
PieChartTemplate.args = {
  width: 500,
  height: 300,
  data: {
    total: 100,
    radius: 100,
    startDegree: 0,
    name: ['data1', 'data2', 'data3'],
    value: [10, 23, 33],
    color: ['red', 'green', 'blue'],
  },
};
