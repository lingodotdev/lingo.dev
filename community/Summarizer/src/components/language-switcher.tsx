'use client';

import { useLocalization } from '@/i18n/context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocalization();

  return (
    <Select value={locale} onValueChange={setLocale}>
      <SelectTrigger className="w-full" suppressHydrationWarning>
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
      </SelectContent>
    </Select>
  );
}
