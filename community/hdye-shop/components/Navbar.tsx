'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const changeLocale = (newLocale: string) => {
    const path = pathname.split('/').slice(2).join('/');
    router.push(`/${newLocale}/${path}`);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link 
              href={`/${locale}`}
              className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-purple-600 font-medium"
            >
              {t('home')}
            </Link>
            <Link 
              href={`/${locale}/categories`}
              className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-purple-600 font-medium"
            >
              {t('categories')}
            </Link>
            <Link 
              href={`/${locale}/cart`}
              className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-purple-600 font-medium"
            >
              {t('cart')}
            </Link>
            <Link 
              href={`/${locale}/settings`}
              className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-purple-600 font-medium"
            >
              {t('settings')}
            </Link>
          </div>
          
          <div className="flex items-center">
            <select 
              value={locale}
              onChange={(e) => changeLocale(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}