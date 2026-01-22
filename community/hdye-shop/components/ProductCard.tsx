'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  imageUrl: string;
  colorHex: string;
}

export default function ProductCard({ id, imageUrl, colorHex }: ProductCardProps) {
  const t = useTranslations('dyes');
  const tProducts = useTranslations('products');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 bg-gray-200">
        <Image
          src={imageUrl}
          alt={t(`${id}.name`)}
          fill
          className="object-cover"
        />
        <div 
          className="absolute top-4 right-4 w-12 h-12 rounded-full border-4 border-white shadow-lg"
          style={{ backgroundColor: colorHex }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {t(`${id}.name`)}
        </h3>
        <p className="text-gray-600 mb-4">
          {t(`${id}.description`)}
        </p>
        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200">
          {tProducts('addToCart')}
        </button>
      </div>
    </div>
  );
}