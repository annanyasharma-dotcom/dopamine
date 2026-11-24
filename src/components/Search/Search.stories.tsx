import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Search } from './Search';

const meta = {
  title: 'Components/Search',
  component: Search,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Search bar from the Figma “Search” component set. Figma `labs AI` maps to `labsAi`. It is a real search input; for a tap-to-open entry point, pass `readOnly` and `onClick`.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 328 }}><Story /></div>],
  args: { placeholder: 'Search ‘crocin’...', labsAi: false, onChange: fn(), onAiClick: fn() },
  argTypes: {
    placeholder: { control: 'text' },
    labsAi: { control: 'boolean', description: 'Labs AI button (Figma `labs AI`).', table: { defaultValue: { summary: 'false' } } },
    aiLabel: { control: 'text', table: { defaultValue: { summary: 'Ask Labs AI' } } },
    readOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `labs AI=false`. */
export const Playground: Story = {};
export const Default: Story = {};
/** Figma `labs AI=true`. */
export const LabsAi: Story = { name: 'Labs AI', args: { labsAi: true } };

export const Typing: Story = {
  name: 'Test: typing',
  play: async ({ args, canvas }) => {
    const box = canvas.getByRole('searchbox', { name: 'Search' });
    await userEvent.type(box, 'paracetamol');
    await expect(box).toHaveValue('paracetamol');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const AiButton: Story = {
  name: 'Test: Labs AI button',
  args: { labsAi: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Ask Labs AI' }));
    await expect(args.onAiClick).toHaveBeenCalledTimes(1);
  },
};

/** Entry point that opens a search screen instead of typing in place. */
export const EntryPoint: Story = { name: 'Tap to open (read-only)', args: { readOnly: true, onClick: fn() } };
