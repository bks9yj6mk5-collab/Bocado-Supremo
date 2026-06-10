// src/components/client/ProductCard.tsx

'use client';

import { Product } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import { HiShoppingCart } from 'react-icons/hi';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useNotificationStore((state) => state.addToast);

  const handleAddToCart = () => {
    if (quantity < 1) {
      addToast('Ingresa una cantidad válida', 'error');
      return;
    }

    addItem(product, quantity);
    addToast(`${product.name} agregado al carrito`, 'success');
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">No disponible</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          <span className="text-xs bg-secondary text-dark px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Add to Cart */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="input-field w-16 py-1 text-center"
          />
          <button
            onClick={handleAddToCart}
            disabled={!product.available}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <HiShoppingCart size={20} />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
