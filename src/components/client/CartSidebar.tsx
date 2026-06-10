// src/components/client/CartSidebar.tsx

'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { HiX, HiTrash } from 'react-icons/hi';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTax = useCartStore((state) => state.getTax);
  const getTotal = useCartStore((state) => state.getTotal);
  const [taxPercentage, setTaxPercentage] = useState(13);

  useEffect(() => {
    // Fetch tax percentage from settings
    setTaxPercentage(13); // Default value
  }, []);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-dark">Tu Carrito</h2>
            <button
              onClick={onClose}
              className="text-dark hover:text-primary transition"
            >
              <HiX size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start space-x-4 p-3 bg-background rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-dark truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.product.price)} c/u
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">
                    {formatCurrency(getSubtotal())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuesto ({taxPercentage}%):</span>
                  <span className="font-semibold">
                    {formatCurrency(getTax(taxPercentage))}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(getTotal(taxPercentage))}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="btn-primary w-full text-center block"
              >
                Proceder al Pago
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
