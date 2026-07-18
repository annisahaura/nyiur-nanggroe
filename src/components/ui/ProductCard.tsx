"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Eye, Leaf, Star, Package } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { StarRating } from "@/components/ui/StarRating";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  const secondaryImage = product.images?.[1];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const added = addItem(product, 1);
    if (!added) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/masuk?alasan=keranjang&redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("group", className)}
    >
      <Link
        href={`/produk/${product.slug}`}
        className="block bg-white rounded-2xl border border-border/40 overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
        aria-label={`Lihat detail ${product.name}`}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square bg-mist">
          {primaryImage && (
            <>
              {/* Primary image */}
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt ?? product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={cn(
                  "object-cover transition-all duration-700 group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                priority={priority}
              />
              {/* Secondary image on hover */}
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105"
                />
              )}
            </>
          )}

          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {product.is_eco_certified && (
              <span className="badge-eco text-[10px] px-1.5 py-0.5 gap-0.5">
                <Leaf className="w-2.5 h-2.5" />
                Eco
              </span>
            )}
            {product.is_featured && (
              <span className="badge-new text-[10px] px-1.5 py-0.5">
                ✦ Unggulan
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-150 hover:scale-110 active:scale-95"
            aria-label={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          >
            <motion.div
              animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors",
                  isWishlisted ? "fill-red-500 text-red-500" : "text-charcoal-400"
                )}
              />
            </motion.div>
          </button>

          {/* Quick View overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex gap-1 p-2">
              <button
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200",
                  addedToCart
                    ? "bg-moss text-white"
                    : "bg-forest-600 text-cream hover:bg-forest-500"
                )}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-1.5"
                    >
                      ✓ Ditambahkan
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Keranjang
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                onClick={(e) => { e.preventDefault(); router.push(`/produk/${product.slug}`); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/90 text-charcoal-600 hover:text-forest-600 backdrop-blur-sm transition-colors"
                aria-label="Lihat detail"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5">
          {/* Store name */}
          <p className="text-[10px] font-medium text-charcoal-400 mb-1 flex items-center gap-1 truncate">
            <Package className="w-2.5 h-2.5 flex-shrink-0" />
            {product.store?.name}
          </p>

          {/* Product name */}
          <h3 className="text-sm font-semibold text-charcoal-800 line-clamp-2 leading-snug mb-2 group-hover:text-forest-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <StarRating rating={product.rating} size="xs" />
            <span className="text-[10px] text-charcoal-400">
              {product.rating.toFixed(1)} ({product.review_count.toLocaleString("id-ID")})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-forest-700">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] text-charcoal-400">/{product.unit}</span>
          </div>

          {/* Sold count */}
          {product.total_sold > 100 && (
            <p className="text-[10px] text-charcoal-400 mt-0.5">
              {product.total_sold.toLocaleString("id-ID")}+ terjual
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
