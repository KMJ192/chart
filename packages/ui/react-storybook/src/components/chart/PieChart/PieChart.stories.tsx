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
  width: 1200,
  height: 700,
  data: [
    {
      name: 'data1',
      value: 10,
      color: 'red',
    },
    {
      name: 'data2',
      value: 23,
      color: 'green',
    },
    {
      name: 'data3',
      value: 43,
      color: 'blue',
    },
  ],
};
