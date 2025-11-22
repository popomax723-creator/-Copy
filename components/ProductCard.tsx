import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  className?: string;
  minimal?: boolean;
  withGlow?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAdd, 
  isAdmin, 
  onEdit, 
  onDelete,
  className = '',
  minimal = false,
  withGlow = false
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const finalPrice = product.discount 
    ? product.price - (product.price * (product.discount / 100)) 
    : product.price;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className={`
      relative flex flex-col h-full group transition-all duration-300
      ${minimal ? 'rounded-2xl' : 'bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg overflow-hidden'}
      ${className}
    `}>
      {product.discount && product.discount > 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 animate-pulse shadow-sm">
          خصم {product.discount}%
        </div>
      )}
      
      <div className={`relative overflow-hidden flex items-center justify-center ${minimal ? 'h-40 p-4' : 'h-48 bg-gray-50'}`}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className={`
            w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 
            ${withGlow ? 'drop-shadow-[0_0_8px_rgba(246,139,31,0.6)]' : 'drop-shadow-sm'}
          `}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/300/300`
          }}
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
            <h3 className={`font-bold truncate text-gray-800 ${minimal ? 'text-base' : 'text-lg'}`}>{product.name}</h3>
        </div>
        {!minimal && <p className="text-xs text-gray-500 mb-2">{product.category}</p>}
        
        {product.description && !minimal && (
            <div className="bg-orange-50 p-2 rounded-lg mb-3 text-xs text-gray-600 flex gap-1 items-start">
                <Sparkles className="w-3 h-3 text-[#F68B1F] mt-0.5 flex-shrink-0" />
                <p>{product.description}</p>
            </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div>
            {product.discount ? (
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-gray-400 line-through">{product.price} ريال</span>
                <span className="text-lg font-bold text-[#0C612D]">{finalPrice.toFixed(2)} ريال</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-[#0C612D]">{product.price} ريال</span>
            )}
          </div>

          {!isAdmin ? (
            <div className="relative">
                {isAdded && (
                     <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#0C612D] text-white text-[10px] font-bold rounded-md shadow-md whitespace-nowrap transition-all animate-pulse z-20 pointer-events-none">
                        تمت الإضافة!
                     </span>
                )}
                <button 
                  onClick={handleAddClick}
                  className={`
                    text-white rounded-full transition-all shadow-md flex items-center justify-center
                    ${minimal ? 'w-8 h-8' : 'p-2'}
                    ${isAdded ? 'bg-[#0C612D] scale-110' : 'bg-[#F68B1F] hover:bg-[#d97817]'}
                  `}
                >
                  {isAdded ? <Check className={`${minimal ? 'w-4 h-4' : 'w-5 h-5'}`} /> : <Plus className={`${minimal ? 'w-4 h-4' : 'w-5 h-5'}`} />}
                </button>
            </div>
          ) : (
            <div className="flex gap-2">
                <button onClick={() => onEdit?.(product)} className="text-blue-600 text-sm font-medium hover:underline">تعديل</button>
                <button onClick={() => onDelete?.(product.id)} className="text-red-600 text-sm font-medium hover:underline">حذف</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};