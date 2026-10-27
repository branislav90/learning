// Button.stories.tsx — Component Story Format (CSF 3). ⚠ import paths/types vary by Storybook version and framework package.
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Triggers an action. Use a link (`<a>`) for navigation. Keyboard: Space/Enter activate. ' +
          'Always provide an accessible name; icon-only buttons require `aria-label`.',
      },
    },
  },
  argTypes: {
    tone: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { tone: 'primary', children: 'Save' } };
export const Disabled: Story = { args: { tone: 'primary', children: 'Save', disabled: true } };
export const IconOnly: Story = {
  args: { tone: 'ghost', 'aria-label': 'Close', children: '×' },
};
