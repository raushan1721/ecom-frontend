import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import Loading from "../utils/loading/Loading";
import Filters from "./Filters";
import LoadMore from "./LoadMore";
import { publicRequest } from "../../../requestmethod";
import axios from "axios";
function Products() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [loading] = useState(false);
  const [category] = state.productsAPI.category;
  const [sort] = state.productsAPI.sort;

  useEffect(() => {
    const filter = async () => {
      if (!category) {
        const res = await publicRequest.get(
          "https://fakestoreapi.com/products"
        );
        setProducts(res.data);
      } else {
        const res = await axios.get(
          "https://fakestoreapi.com/products/" + category
        );
        setProducts(res.data);
      }
      if (sort) {
        var p = products;
        p.sort((a, b) => {
          return sort === 0 ? b.price - a.price : a.price - b.price;
        });
        setProducts(p);
      }
    };
    filter();
  }, [category, sort]);
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <>
      <Filters />

      <div className="products">
        {products.map((product) => {
          return <ProductItem key={product.id} product={product} />;
        })}
      </div>

      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
}

export default Products;
