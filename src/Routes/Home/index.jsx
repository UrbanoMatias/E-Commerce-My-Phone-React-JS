import React, { useEffect, useState } from "react";
import MainContainer from "../../components/layout/MainContainer";
import Product from "../../components/Product";
import { productsService } from "../../services";

const Home = () => {
  let [products, setProducts] = useState([]);

  useEffect(() => {
    productsService.getProducts(
      callbackSuccessGetProducts,
      callbackErrorGetProducts
    );
  }, []);

  //CALLBACKS
  const callbackSuccessGetProducts = (result) => {
    setProducts(result.data.payload);
  };

  const callbackErrorGetProducts = (error) => {
    console.log(error);
  };

  return (
    <MainContainer>
      <div>
        <p className="homeTitle">Nuestros Últimos productos</p>
        <div className="productPanel">
          {products
            ? products.map((product, id) => (
                <Product element={product} key={id} />
              ))
            : null}
        </div>
      </div>
    </MainContainer>
  );
};
export default Home;
