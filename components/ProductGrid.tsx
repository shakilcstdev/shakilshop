
"use client";

import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { client } from "@/sanity/lib/client";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants";
import NoProductAvailable from "./product/NoProductAvailable";
import Container from "./Container";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import { ProductGridSkeleton } from "./ProductSkeletons";

type Product = ALL_PRODUCTS_QUERYResult[number];

const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  ...,
  "categories": categories[]->title
}`;

const ProductGrid = () => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [selectedTab, setSelectedTab] = useState("All Products");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const result: ALL_PRODUCTS_QUERYResult = await client.fetch(
          ALL_PRODUCTS_QUERY
        );

        if (!cancelled) {
          setProducts(result ?? []);
        }
      } catch (error) {
        console.error("Product fetching error:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedTab === "All Products") {
      return products;
    }

    const selectedVariant = productType.find(
      (item) => item.title === selectedTab
    )?.value;

    if (!selectedVariant) {
      return products;
    }

    return products.filter(
      (product: Product) =>
        product.variant?.toLowerCase() === selectedVariant.toLowerCase()
    );
  }, [products, selectedTab]);

  return (
    <Container className="mt-16 flex flex-col lg:px-0 lg:mt-24">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-shop_light_green to-shop_dark_green" />

          <h2 className="text-3xl font-bold text-dark-color lg:text-4xl">
            Featured Products
          </h2>

          <div className="h-1 w-12 rounded-full bg-gradient-to-l from-shop_light_green to-shop_dark_green" />
        </div>

        <p className="mx-auto max-w-2xl text-lg text-light-color">
          Discover our carefully curated selection of premium products
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-shop_light_green/10 bg-white p-5 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedTab("All Products")}
            className={`rounded-full border px-4 py-2 transition ${
              selectedTab === "All Products"
                ? "border-shop_light_green bg-shop_light_green text-white"
                : "border-shop_light_green/30 bg-shop_light_green/10"
            }`}
          >
            All Products
          </button>

          <HomeTabbar
            selectedTab={selectedTab}
            onTabSelect={setSelectedTab}
          />
        </div>

        <p className="text-sm text-light-color">
          {loading ? "Loading products..." : `${filteredProducts.length} products`}
        </p>
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="group min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;
