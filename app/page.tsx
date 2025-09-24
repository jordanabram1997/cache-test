import { Suspense } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  species: string;
}

let cache: { data: { products: { results: Product[] }; fetchedAt: string }; expires: number } | null = null;

async function getProductData(): Promise<{
  products: { results: Product[] };
  fetchedAt: string;
}> {
  if (cache && Date.now() < cache.expires) {
    return cache.data;
  }

  console.log("Fetching characters…");
  const res = await fetch("https://rickandmortyapi.com/api/character", {
    cache: "no-store", 
  });
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const json = await res.json();

  const freshData = {
    products: json,
    fetchedAt: new Date().toLocaleTimeString(),
  };

  cache = { data: freshData, expires: Date.now() + 10_000 };

  return freshData;
}

async function ProductQuantity() {
  const data = await getProductData();

  return (
    <div className="text-white w-full">
      <div className="text-center mb-4">
        <div>Fetched at: {data.fetchedAt}</div>
        <div>Total Characters: {data.products.results.length}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto px-4 h-full w-full">
        {data.products.results.map((product: Product) => (
          <div key={product.id} className="rounded p-3 text-sm min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-t-xl"
            />
            <div className="font-bold truncate">{product.name}</div>
            <div>ID: {product.id}</div>
            <div>Species: {product.species}</div>
            <div className="text-xs text-gray-400 truncate">{product.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto px-4 h-full w-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded p-3 text-sm min-w-0">
          <div className="w-full h-64 bg-gray-800 rounded-t-xl animate-pulse mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2"></div>
            <div className="h-3 bg-gray-800 rounded animate-pulse w-1/3"></div>
            <div className="h-3 bg-gray-800 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="flex flex-col items-center py-8 gap-4">
        <h1 className="text-4xl font-bold">Cache Test</h1>
        <p className="text-gray-400 text-center max-w-md">
          Fetches all characters from <Link className="text-blue-500 hover:underline" href="https://rickandmortyapi.com/">Rick and Morty API</Link>
          <br />
          Cached for 10 seconds
          <br />
          Shows loading state during revalidation
        </p>
        <Suspense fallback={<Skeleton />}>
          <ProductQuantity />
        </Suspense>
      </div>
    </div>
  );
}
