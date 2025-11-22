
import React from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronRight, Sparkles } from 'lucide-react';
import { CATEGORY_ICONS } from './HomeView';

interface CategoryPageProps {
  category: ProductCategory;
  products: Product[];
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  products,
  onBack,
  onAddToCart,
  onProductClick
}) => {
  const categoryProducts = products.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <ChevronRight className="w-6 h-6 rtl:rotate-180" />
          </button>
          
          <div className="flex items-center gap-3">
             <div className="text-[#F68B1F]">
               {CATEGORY_ICONS[category]}
             </div>
             <h1 className="text-2xl font-bold text-[#0C612D]">{category}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {categoryProducts.length === 0 ? (
            <div className="text-center py-20">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Sparkles className="w-10 h-10" />
                </div>
                <p className="text-gray-500 text-lg">لا توجد منتجات في هذا القسم حالياً.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {categoryProducts.map(product => (
                <div key={product.id} onClick={() => onProductClick(product)} className="cursor-pointer">
                    <ProductCard 
                        product={product} 
                        onAdd={onAddToCart} 
                        withGlow={true}
                        className="bg-white hover:shadow-xl transition-all duration-300 border-transparent hover:border-[#F68B1F]/20"
                    />
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};
