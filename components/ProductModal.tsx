
import React from 'react';
import { Product } from '../types';
import { X, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface ProductModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  allProducts, 
  onClose, 
  onAddToCart,
  onSelectProduct 
}) => {
  const similarProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header / Image */}
        <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white shadow-sm z-10 transition-transform hover:scale-110"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
          
          {product.discount && product.discount > 0 && (
            <div className="absolute bottom-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              خصم {product.discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md mt-1 inline-block">
                {product.category}
              </span>
            </div>
            <div className="text-left">
               {product.discount ? (
                 <div className="flex flex-col items-end">
                   <span className="text-gray-400 line-through text-sm">{product.price} ريال</span>
                   <span className="text-2xl font-bold text-[#0C612D]">{finalPrice.toFixed(2)} ريال</span>
                 </div>
               ) : (
                 <span className="text-2xl font-bold text-[#0C612D]">{product.price} ريال</span>
               )}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-2">
             <Sparkles className="w-5 h-5 text-[#F68B1F] flex-shrink-0 mt-0.5" />
             {product.description || "منتج عالي الجودة من سوبر ماركت الشارقة، تم اختياره بعناية لكم."}
          </p>

          <Button onClick={() => onAddToCart(product)} className="w-full py-4 text-lg shadow-lg shadow-orange-100 mb-8">
             <ShoppingCart className="w-5 h-5" /> أضف إلى السلة
          </Button>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#F68B1F] rounded-full"></span>
                منتجات مشابهة قد تعجبك
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {similarProducts.map(sim => (
                  <div 
                    key={sim.id} 
                    onClick={() => onSelectProduct(sim)}
                    className="cursor-pointer group bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all hover:border-[#F68B1F]/50"
                  >
                    <div className="h-24 mb-2 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={sim.imageUrl} alt={sim.name} className="h-full w-full object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="font-bold text-sm text-gray-800 truncate">{sim.name}</p>
                    <p className="text-[#0C612D] text-sm font-bold">{sim.price} ريال</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
