// app/shop/[username]/[productSlug]/page.js
// Page produit publique - Design qui convertit + Collecte de leads

import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

// Fetch product data
async function getProductData(username, productSlug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/shop/${username}/${productSlug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data : null;
  } catch (error) {
    console.error("Erreur fetch product:", error);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({ params }) {
  const { username, productSlug } = await params;
  const data = await getProductData(username, productSlug);
  
  if (!data) return { title: "Produit introuvable" };
  
  return {
    title: `${data.product.title} | ${data.shop.name}`,
    description: data.product.description?.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: data.product.title,
      description: data.product.description?.replace(/<[^>]*>/g, '').substring(0, 160),
      images: data.product.cover ? [data.product.cover] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { username, productSlug } = await params;
  const data = await getProductData(username, productSlug);
  
  if (!data) notFound();
  
  return <ProductPageClient shop={data.shop} product={data.product} username={username} />;
}