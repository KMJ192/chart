import { Story } from '@storybook/react';
import PieChart from './PieChart';

export default {
  title: 'Chart/PieChart',
  component: PieChart,
  parameters: {
    componentSubtitle: 'PieChart',
  },
};

const pieChartTemplate = (): JSX.Element => {
  return <PieChart />;
};

export const pieChart: Story = pieChartTemplate.bind({});
pieChart.args = {};
