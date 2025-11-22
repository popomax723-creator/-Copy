
import React, { useRef } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Beef, 
  Apple, 
  CakeSlice, 
  Cookie, 
  GlassWater, 
  SprayCan, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Percent,
  Flame,
  CupSoda,
  Gem
} from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenCategory: (cat: ProductCategory) => void;
  onProductClick: (product: Product) => void;
}

export const CATEGORY_ICONS: Record<ProductCategory, React.ReactNode> = {
  [ProductCategory.MEAT]: <Beef className="w-8 h-8" strokeWidth={1.5} />,
  [ProductCategory.FRUITS_VEG]: <Apple className="w-8 h-8" strokeWidth={1.5} />,
  [ProductCategory.CAKE]: <CakeSlice className="w-8 h-8" strokeWidth={1.5} />,
  [ProductCategory.BISCUITS]: <Cookie className="w-8 h-8" strokeWidth={1.5} />,
  [ProductCategory.JUICES]: <GlassWater className="w-8 h-8" strokeWidth={1.5} />,
  [ProductCategory.DRINKS]: <CupSoda className="w-8 h-8" strokeWidth={1.5} />,
  [ProductCategory.CLEANING]: <SprayCan className="w-8 h-8" strokeWidth={1.5} />,
  [ProductCategory.PERSONAL_CARE]: <Gem className="w-8 h-8" strokeWidth={1.5} />,
};

const CATEGORY_STYLES: Record<ProductCategory, string> = {
    [ProductCategory.MEAT]: 'bg-red-50 text-red-600 border-red-100 hover:border-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    [ProductCategory.FRUITS_VEG]: 'bg-green-50 text-[#0C612D] border-green-100 hover:border-green-300 hover:shadow-[0_0_15px_rgba(12,97,45,0.2)]',
    [ProductCategory.CAKE]: 'bg-orange-50 text-[#F68B1F] border-orange-100 hover:border-[#F68B1F] hover:shadow-[0_0_15px_rgba(246,139,31,0.2)]',
    [ProductCategory.BISCUITS]: 'bg-yellow-50 text-yellow-600 border-yellow-100 hover:border-yellow-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    [ProductCategory.JUICES]: 'bg-orange-50 text-orange-500 border-orange-100 hover:border-orange-300 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]',
    [ProductCategory.DRINKS]: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    [ProductCategory.CLEANING]: 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    [ProductCategory.PERSONAL_CARE]: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.2)]',
};

export const HomeView: React.FC<HomeViewProps> = ({ products, onAddToCart, onOpenCategory, onProductClick }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (dir: 'left' | 'right') => {
    if (sliderRef.current) {
        const scrollAmount = 300;
        sliderRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const offers = products.filter(p => p.discount && p.discount > 0);
  const featuredProducts = products.filter(p => !p.discount || p.discount === 0).slice(0, 8); 

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. Marketing Hero Section */}
      <section className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-b from-[#f8f9fa] to-white shadow-sm mx-0 pt-8 pb-16 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F68B1F]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0C612D]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl leading-[1.3] font-bold font-['Almarai'] tracking-wide">
            <span className="text-gray-800">مرحبًا بك في </span>
            <span className="text-[#F68B1F] drop-shadow-[0_0_15px_rgba(246,139,31,0.3)] block md:inline"> سوبر ماركت الشارقة </span>
            <br className="hidden md:block" />
            <span className="text-gray-600 text-2xl md:text-4xl font-normal mt-4 block">
                حيث تجد <span className="text-[#0C612D] font-extrabold drop-shadow-[0_0_10px_rgba(12,97,45,0.2)]">أفضل العروض</span>، 
                أجود <span className="text-blue-600 font-extrabold drop-shadow-[0_0_10px_rgba(37,99,235,0.2)]">المنتجات الطازجة</span>، 
            </span>
            <span className="text-gray-600 text-2xl md:text-4xl font-normal mt-2 block">
                خصومات <span className="text-[#F68B1F] font-extrabold animate-pulse">لا تُفوَّت</span>، 
                وكل ما تحتاجه <span className="text-gray-800 border-b-4 border-[#F68B1F]/50">في مكان واحد</span>!
            </span>
          </h1>
          
          <div className="mt-8 flex justify-center gap-4">
            <button 
               onClick={() => document.getElementById('offers-section')?.scrollIntoView({behavior: 'smooth'})}
               className="px-8 py-3 bg-[#F68B1F] text-white rounded-full font-bold shadow-lg shadow-orange-200 hover:scale-105 hover:shadow-orange-300 transition-all flex items-center gap-2"
            >
              <Flame className="w-5 h-5 fill-white animate-pulse" /> شاهد العروض
            </button>
            <button 
               onClick={() => document.getElementById('categories-section')?.scrollIntoView({behavior: 'smooth'})}
               className="px-8 py-3 bg-white text-[#0C612D] border border-[#0C612D]/20 rounded-full font-bold shadow-sm hover:bg-[#0C612D] hover:text-white transition-all"
            >
              تصفح الأقسام
            </button>
          </div>
        </div>
      </section>

      {/* 2. Categories Grid Buttons */}
      <section id="categories-section" className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 justify-center">
             <h2 className="text-3xl font-bold text-center text-gray-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-[#0C612D] rounded-full"></span>
                تصفح الأقسام
            </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Object.values(ProductCategory).map((cat) => (
                <button 
                    key={cat}
                    onClick={() => onOpenCategory(cat)}
                    className={`
                        relative overflow-hidden p-6 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 
                        border shadow-sm hover:shadow-xl hover:-translate-y-1 group
                        ${CATEGORY_STYLES[cat]}
                    `}
                >
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {CATEGORY_ICONS[cat]}
                    </div>
                    <span className="relative z-10 font-extrabold text-base md:text-lg tracking-wide drop-shadow-sm group-hover:drop-shadow-md">{cat}</span>
                    
                    <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                </button>
            ))}
        </div>
      </section>

      {/* 3. Offers Section */}
      <section id="offers-section" className="px-4 md:px-8">
        <div className="flex items-center gap-3 mb-8 justify-center">
            <h2 className="text-3xl font-bold text-center text-[#F68B1F] flex items-center gap-3 drop-shadow-sm">
                <Percent className="w-8 h-8 animate-bounce" />
                عروضنا الخاصة
                <Percent className="w-8 h-8 animate-bounce" />
            </h2>
        </div>

        {offers.length === 0 ? (
             <div className="text-center p-12 bg-orange-50/50 rounded-3xl border border-orange-100">
                <p className="text-gray-500">انتظروا عروضنا المميزة قريباً!</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {offers.map(product => (
                    <div key={product.id} onClick={() => onProductClick(product)} className="cursor-pointer">
                        <div className="relative group bg-white/60 backdrop-blur-md rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:border-[#F68B1F]/30 hover:shadow-[0_8px_30px_rgba(246,139,31,0.1)] transition-all duration-500 overflow-hidden h-full">
                            {/* Graphic Icon Background */}
                            <div className="absolute -right-6 -top-6 text-[#F68B1F]/5 group-hover:text-[#F68B1F]/10 transition-colors duration-500 transform rotate-12 group-hover:rotate-0">
                                {React.cloneElement(CATEGORY_ICONS[product.category] as React.ReactElement, { size: 120, strokeWidth: 1 })}
                            </div>

                            {/* Discount Badge */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-black text-lg px-3 py-1 rounded-full shadow-lg shadow-red-200 z-20 animate-pulse">
                                {product.discount}% OFF
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="h-48 w-full p-2 mb-4 relative">
                                    <img 
                                        src={product.imageUrl} 
                                        className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                                        alt={product.name}
                                    />
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-800 mb-1 truncate pr-2">{product.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                    {CATEGORY_ICONS[product.category]}
                                    <span>{product.category}</span>
                                </div>

                                <div className="mt-auto flex items-end justify-between">
                                    <div>
                                        <span className="block text-sm text-gray-400 line-through decoration-red-400">{product.price} ريال</span>
                                        <span className="block text-2xl font-black text-[#F68B1F] drop-shadow-sm">
                                            {(product.price * (1 - (product.discount! / 100))).toFixed(2)} <span className="text-sm">ريال</span>
                                        </span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                                        className="bg-[#0C612D] text-white p-3 rounded-full shadow-lg shadow-green-200 hover:bg-[#094a22] hover:scale-110 transition-all"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </section>

      {/* 4. Featured Products Slider */}
      <section className="px-4 md:px-8 bg-gradient-to-r from-[#0C612D]/5 to-transparent py-12">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0C612D] flex items-center gap-2">
                <Sparkles className="text-[#0C612D] w-6 h-6" /> 
                منتجات مميزة
            </h2>
            <div className="flex gap-2">
                <button onClick={() => scrollSlider('right')} className="p-3 rounded-full bg-white text-[#0C612D] shadow-sm hover:shadow-md transition"><ChevronRight /></button>
                <button onClick={() => scrollSlider('left')} className="p-3 rounded-full bg-white text-[#0C612D] shadow-sm hover:shadow-md transition"><ChevronLeft /></button>
            </div>
        </div>
        
        <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-8 px-2 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {featuredProducts.map(product => (
                <div key={product.id} onClick={() => onProductClick(product)} className="min-w-[220px] md:min-w-[260px] snap-center cursor-pointer">
                    <ProductCard 
                        product={product} 
                        onAdd={onAddToCart} 
                        minimal={true} 
                        withGlow={true}
                        className="h-full bg-white/60 backdrop-blur-sm border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
                    />
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};
