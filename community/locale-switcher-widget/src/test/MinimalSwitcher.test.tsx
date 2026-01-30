import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MinimalSwitcher } from '../components/MinimalSwitcher';
import { buildLocaleOptions } from '../utils';

describe('MinimalSwitcher', () => {
  const mockOnLocaleChange = vi.fn();
  const locales = buildLocaleOptions(['en', 'es', 'fr']);

  it('renders next locale code', () => {
    render(
      <MinimalSwitcher
        currentLocale="en"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
      />
    );

    expect(screen.getByText('ES')).toBeInTheDocument();
  });

  it('cycles to next locale on click', () => {
    render(
      <MinimalSwitcher
        currentLocale="en"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnLocaleChange).toHaveBeenCalledWith('es');
  });

  it('cycles back to first locale from last', () => {
    render(
      <MinimalSwitcher
        currentLocale="fr"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnLocaleChange).toHaveBeenCalledWith('en');
  });
});
