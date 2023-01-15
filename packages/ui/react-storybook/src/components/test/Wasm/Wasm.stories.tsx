import { Story } from '@storybook/react';

export default {
  title: 'Test/Wasm',
};

const wasmTestTemplate = (): JSX.Element => {
  import('@wasm/pkg').then(async (module) => {
    await module.default();
    module.console();
  });

  return <></>;
};

export const WasmTest: Story = wasmTestTemplate.bind({});
