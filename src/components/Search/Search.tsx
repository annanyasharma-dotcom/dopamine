import type { ComponentPropsWithRef } from 'react';
import { Icon } from '../Icon';
import './Search.css';

export interface SearchProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'type'> {
  /** Figma `labs AI`. Shows the Labs AI button at the end. @default false */
  labsAi?: boolean;
  /** Called when the Labs AI button is pressed. */
  onAiClick?: () => void;
  /** Accessible name of the Labs AI button. @default 'Ask Labs AI' */
  aiLabel?: string;
  /** Class on the outer pill (`className` goes on the `<input>`). */
  wrapperClassName?: string;
}

/**
 * Search bar (Figma “Search”). A real `type="search"` input; for a tap-to-open entry point,
 * pass `readOnly` and `onClick`.
 */
export function Search({
  labsAi = false,
  onAiClick,
  aiLabel = 'Ask Labs AI',
  wrapperClassName,
  className,
  'aria-label': ariaLabel = 'Search',
  ...rest
}: SearchProps) {
  return (
    <div className={['dp-search', wrapperClassName].filter(Boolean).join(' ')}>
      <Icon name="search" />
      <input {...rest} type="search" aria-label={ariaLabel} className={['dp-search__input', className].filter(Boolean).join(' ')} />
      {labsAi && (
        <button type="button" className="dp-search__ai" onClick={onAiClick} aria-label={aiLabel}>
          <span className="dp-search__ai-icon" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default Search;
