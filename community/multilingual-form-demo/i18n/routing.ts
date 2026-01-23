import { locales } from '@/app/components/languageSwitcher/types';
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: locales.map((locale) => locale.code),
    defaultLocale: 'en',
    localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
