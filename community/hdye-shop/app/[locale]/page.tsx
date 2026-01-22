import { useTranslations } from 'next-intl';
import ProductCard from '@/components/ProductCard';

const products = [
  {
    id: 'midnight_black',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    colorHex: '#1a1a1a'
  },
  {
    id: 'chestnut_brown',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400',
    colorHex: '#8B4513'
  },
  {
    id: 'golden_blonde',
    imageUrl: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=400',
    colorHex: '#FFD700'
  },
  {
    id: 'auburn_red',
    imageUrl: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=400',
    colorHex: '#A0522D'
  },
  {
    id: 'platinum_blonde',
    imageUrl: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400',
    colorHex: '#E5E4E2'
  },
  {
    id: 'burgundy',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400',
    colorHex: '#800020'
  }
];

export default function Home() {
  const t = useTranslations('products');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        {t('title')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            imageUrl={product.imageUrl}
            colorHex={product.colorHex}
          />
        ))}
      </div>
    </div>
  );
}