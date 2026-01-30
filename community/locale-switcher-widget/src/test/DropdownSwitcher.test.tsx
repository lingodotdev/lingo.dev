import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropdownSwitcher } from '../components/DropdownSwitcher';
import { buildLocaleOptions } from '../utils';

describe('DropdownSwitcher', () => {
  const mockOnLocaleChange = vi.fn();
  const locales = buildLocaleOptions(['en', 'es', 'fr']);

  beforeEach(() => {
    mockOnLocaleChange.mockClear();
  });

  it('renders current locale', () => {
    render(
      <DropdownSwitcher
        currentLocale="en"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
      />
    );

    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('opens menu on click', () => {
    render(
      <DropdownSwitcher
        currentLocale="en"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
      />
    );

    const trigger = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(trigger);

    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
  });

  it('calls onLocaleChange when selecting a locale', () => {
    render(
      <DropdownSwitcher
        currentLocale="en"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
      />
    );

    const trigger = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(trigger);

    const spanishOption = screen.getByText('Español');
    fireEvent.click(spanishOption);

    expect(mockOnLocaleChange).toHaveBeenCalledWith('es');
  });

  it('hides labels when showLabels is false', () => {
    render(
      <DropdownSwitcher
        currentLocale="en"
        locales={locales}
        onLocaleChange={mockOnLocaleChange}
        showLabels={false}
      />
    );

    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });
});
