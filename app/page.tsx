import { Suspense } from "react";
import { unstable_cache as cache } from "next/cache";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
};

export const dynamic = 'force-static';

async function getProductData() {
  const res = await fetch(`https://api.vercel.app/products`);
  console.log('Fetching products');
  await new Promise(resolve => setTimeout(resolve, 10000));
  const data = await res.json();
  return { 
    products: data,
    fetchedAt: new Date().toLocaleTimeString(),
  };
}

const getCachedProductData = cache(
  getProductData,
  ['dynamic-product'],
  {
    revalidate: 10,
    tags: ['product']
  }
);

async function ProductQuantity() {
  const data = await getCachedProductData();
  return (
    <div className="text-white w-full">
      <div className="text-center mb-4">
        <div>Fetched at: {data.fetchedAt}</div>
        <div>Total Products: {data.products.length}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 w-full">
        {data.products.map((product: Product) => (
          <div key={product.id} className="border border-gray-600 rounded p-3 text-sm min-w-0">
            <div className="font-bold truncate">{product.name}</div>
            <div>ID: {product.id}</div>
            <div>Price: ${product.price}</div>
            <div className="text-xs text-gray-400 truncate">{product.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="flex flex-col items-center py-8 gap-4">
        <h1 className="text-4xl font-bold">Cache Test</h1>
        <p className="text-gray-400 text-center max-w-md">
          Fetches all products from API<br/>
          Cached for 10 seconds
        </p>
        <Suspense key="dynamic-product" fallback={<Skeleton />}>
          <ProductQuantity />
        </Suspense>
      </div>
    </div>
  );
}

export const Skeleton = () => {
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 w-full">
    <div className="h-40 w-full flex items-center justify-center bg-gray-800">Loading...</div>
    <div className="h-40 w-full flex items-center justify-center bg-gray-800">Loading...</div>
    <div className="h-40 w-full flex items-center justify-center bg-gray-800">Loading...</div>
    <div className="h-40 w-full flex items-center justify-center bg-gray-800">Loading...</div>
    </div>
    </>
  );
}