import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlagsSwitcher } from '../components/FlagsSwitcher';
import { buildLocaleOptions } from '../utils';

describe('FlagsSwitcher', () => {
  const mockOnLocaleChange = vi.fn();
  const locales = buildLocaleOptions(['en', 'es', 'fr', 'de']);

  it('renders all locale flags', () => {
    render(
      <FlagsSwitcher
        currentLocale="en"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
      />
    );

    const buttons = screen.getAllByRole('radio');
    expect(buttons).toHaveLength(4);
  });

  it('marks current locale as active', () => {
    render(
      <FlagsSwitcher
        currentLocale="es"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
      />
    );

    const spanishButton = screen.getByRole('radio', { name: /español/i });
    expect(spanishButton).toHaveClass('lingo-active');
  });

  it('calls onLocaleChange when clicking a flag', () => {
    render(
      <FlagsSwitcher
        currentLocale="en"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
      />
    );

    const frenchButton = screen.getByRole('radio', { name: /français/i });
    fireEvent.click(frenchButton);

    expect(mockOnLocaleChange).toHaveBeenCalledWith('fr');
  });
});
