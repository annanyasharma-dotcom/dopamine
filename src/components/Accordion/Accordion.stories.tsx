import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Accordion } from './Accordion';

const answer =
  'The CBC (Complete Blood Count) test measures the number of red blood cells (RBCs), white blood cells (WBCs), and platelets. Each of these blood cells performs essential functions–RBCs carry oxygen from your lungs to the various body parts, WBCs help fight infections and other diseases, and platelets help your blood to clot. Therefore, determining their levels can provide significant health information. A CBC test also determines the hemoglobin level, a protein in RBC that carries oxygen from the lungs to the rest of your body. Evaluating all these components together can provide important information about your overall health.';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Expandable question/answer row from the Figma “Accordian” component set. Figma `state`: rest (closed) → expanded (answer clamped to 6 lines with “see more”) → more expanded (full answer). The header is a button with `aria-expanded`.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 328 }}><Story /></div>],
  args: { title: 'What does CBC (Complete Blood Count) measure?', children: answer, lines: 6, onExpandedChange: fn() },
  argTypes: {
    title: { control: 'text' },
    children: { control: 'text' },
    defaultExpanded: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    expanded: { control: false },
    lines: { control: { type: 'number', min: 0 }, table: { defaultValue: { summary: '6' } } },
    seeMoreLabel: { control: 'text', table: { defaultValue: { summary: 'see more' } } },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `state=rest`. */
export const Rest: Story = {};
/** Figma `state=expanded`: answer clamped with “see more”. */
export const Expanded: Story = { args: { defaultExpanded: true } };
/** Figma `state=more expanded`: full answer. */
export const MoreExpanded: Story = {
  name: 'More expanded',
  args: { defaultExpanded: true },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'see more' }));
    await expect(canvas.queryByRole('button', { name: 'see more' })).toBeNull();
  },
};
export const ShortAnswer: Story = { name: 'Short answer (no see more)', args: { defaultExpanded: true, children: 'A CBC measures your red cells, white cells and platelets.' } };

export const Interactions: Story = {
  name: 'Test: open, see more, close',
  play: async ({ args, canvas }) => {
    const header = canvas.getByRole('button', { name: /What does CBC/ });
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(header);
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(true);
    await expect(canvas.getByRole('region')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'see more' }));
    await userEvent.click(header);
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(false);
    await expect(canvas.queryByRole('region')).toBeNull();
  },
};

export const AllStates: Story = {
  name: 'All states',
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--gap-40)' }}>
      <Accordion {...args} />
      <Accordion {...args} defaultExpanded />
      <Accordion {...args} defaultExpanded lines={0} />
    </div>
  ),
};
