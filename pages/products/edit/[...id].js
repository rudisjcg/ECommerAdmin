import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { set } from "mongoose";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
      setIsLoading(false);
    });
  }, [id]);
  return (
    <Layout>
        <h1>Edit Product</h1>
    {isLoading && <Spinner/>}
        {productInfo && !isLoading && (
            <ProductForm {...productInfo} />
        )}
      
    </Layout>
  );
}
