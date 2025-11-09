"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BarLoader from "@/components/loader";

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedEMI, setSelectedEMI] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`,{
          cache: "no-store"
      });
        const data = await res.json();
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
          setSelectedColor(data.variants[0].color);
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-72 sm:h-80 md:h-96">
        <BarLoader />
      </div>
    );

  if (!product) return <p className="p-10 text-red-600">Product not found.</p>;

  const images = selectedColor?.images || [];

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 py-8">
      
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-500 mb-4 flex flex-wrap gap-1">
        <Link href="/">Home</Link> /
        <Link href="/products" className="ml-1">Products</Link> /
        <span className="ml-1 text-black font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT SIDE */}
        <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-3">
          
          {/* Thumbnails */}
          <div className="col-span-1 flex flex-col gap-2">
            {images?.map((img: string, idx: number) => (
              <img
                key={idx}
                onClick={() => {
                  const newArr = [...images];
                  [newArr[0], newArr[idx]] = [newArr[idx], newArr[0]];
                  selectedColor.images = newArr;
                  setSelectedColor({ ...selectedColor });
                }}
                src={img}
                className="p-2 w-16 h-16 sm:w-20 sm:h-20 object-contain border border-gray-300 rounded hover:border-black cursor-pointer"
              />
            ))}
          </div>

          {/* Main image */}
          {images?.length > 0 && (
            <img
              src={images[0]}
              className="col-span-3 sm:col-span-4 w-full h-64 sm:h-80 lg:h-[380px] object-contain rounded-xl"
            />
          )}
        </div>

        {/* RIGHT SIDE */}
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{product.name}</h1>

          {product?.rating && (
            <p className="text-green-600 text-sm sm:text-lg mt-1">{product.rating} ★ </p>
          )}

          {/* Prices */}
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-black">
              ₹{selectedVariant.ourPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-lg sm:text-xl text-gray-500 line-through ml-3">
              ₹{selectedVariant.price.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Colors */}
          <p className="mt-6 font-medium">Brand Color</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {product?.variants?.map((v: any) => (
              <button
                key={v._id}
                className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-sm transition text-sm sm:text-base ${
                  selectedVariant._id === v._id ? "bg-black text-white" : "border-gray-300"
                }`}
                onClick={() => {
                  setSelectedVariant(v);
                  setSelectedColor(v.color);
                }}
              >
                {v.color.color}
              </button>
            ))}
          </div>

          {/* Storage */}
          <p className="mt-6 font-medium">Internal Storage</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {product?.variants.map((v: any) => (
              <button
                key={v._id + "-storage"}
                className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-sm transition text-sm sm:text-base ${
                  selectedVariant._id === v._id ? "bg-black text-white" : "border-gray-300"
                }`}
                onClick={() => {
                  setSelectedVariant(v);
                  setSelectedColor(v.color);
                }}
              >
                {v.storage}
              </button>
            ))}
          </div>

          {/* EMI Options */}
          <h2 className="text-lg sm:text-xl font-bold mt-10 mb-4">EMI Options</h2>

          <div className="grid gap-3">
            {product?.emiPlans.map((plan: any) => (
              <div
                key={plan._id}
                className={`rounded-sm p-3 sm:p-4 border cursor-pointer text-sm sm:text-base transition ${
                  selectedEMI?._id === plan._id ? "bg-black text-white" : "border-gray-300"
                }`}
                onClick={() => setSelectedEMI(plan)}
              >
                <div className="flex flex-wrap justify-between">
                  <div className="flex items-center">
                    <p className="font-bold">
                      ₹{plan.monthly.toLocaleString("en-IN")} X
                    </p>
                    <p className="text-xs sm:text-sm ml-2">{plan.tenure} months</p>
                  </div>
                  <p className="text-xs sm:text-sm">
                    <span className="font-semibold">
                      {plan.interestRate}% per month*
                    </span>
                  </p>
                </div>

                {plan?.cashback > 0 && (
                  <p className="text-xs sm:text-sm mt-1">
                    ₹{plan.cashback.toLocaleString("en-IN")} cashback applicable
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CTA BUTTON */}
          <button
            disabled={!selectedEMI}
            onClick={() => selectedEMI && setShowModal(true)}
            className={`mt-6 w-full px-6 py-3 rounded-md text-base sm:text-lg font-semibold transition
              ${selectedEMI ? "bg-black text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
          >
            {selectedEMI ? `Buy on ${selectedEMI.tenure} Months EMI` : "Select an EMI Plan"}
          </button>

        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-[350px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg sm:text-xl font-bold mb-2 text-black">EMI Details</h2>

            <p className="text-gray-700 text-sm sm:text-base">
              <strong>Monthly:</strong> ₹{selectedEMI.monthly.toLocaleString("en-IN")}
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              <strong>Tenure:</strong> {selectedEMI.tenure} months
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              <strong>Interest:</strong> {selectedEMI.interestRate}%
            </p>

            {selectedEMI.cashback > 0 && (
              <p className="text-green-600 mt-1 text-sm sm:text-base">
                Cashback: ₹{selectedEMI.cashback.toLocaleString("en-IN")}
              </p>
            )}

            <button
              className="mt-5 w-full bg-black text-white py-2 rounded-md text-sm sm:text-base"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
