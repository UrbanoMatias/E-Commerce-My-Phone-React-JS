import { useEffect, useState } from "react";
import { cartService } from "../../services";
import MainContainer from "../../components/layout/MainContainer";
import Swal from "sweetalert2";
import { Table, Row } from "react-bootstrap";
import accounting from "accounting";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";
import { ItemCount } from "../../utils";
import { ItemCountLoader } from "../../components/Loader/ItemCountSpiner";
import { Spinner } from "react-bootstrap";
import "./cart.scss";
const Cart = (props) => {
  const [cart, setCart] = useState(null);
  const [input, setInput] = useState({});
  const [ItemCountLoading, setItemCountLoading] = useState(false);

  let currentUser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    cartService.getCartById({
      cid: currentUser.cart,
      callbackSuccess: callbackSuccessGetCart,
      callbackError: callbackErrorGetCart,
    });
  }, []);
  useEffect(() => {
    if (cart) {
      let input = {};
      for (let element of cart.products) {
        input[element.product._id] = element.quantity;
      }
      setInput(input);
    }
  }, [cart]);

  const total = () => {
    return cart.products?.reduce(
      (acc, prod) => acc + prod.product.price * prod.quantity,
      0
    );
  };

  const deleteProduct = (id) => {
    let pid = cart.products.find((element) => element.product._id === id)
      .product._id;
    cartService.deleteProductFromCart({
      cid: cart._id,
      pid,
      callbackSuccess: callbackSuccessDeleteProductFromCart,
      callbackError: callbackErrorDeleteProductFromCart,
    });
  };

  const handleInputChange = async (id, quantity, stock) => {
    setItemCountLoading(true);
    if (quantity > stock) {
      setInput((prev) => ({ ...prev, [id]: (quantity = stock) }));
      setItemCountLoading(false);
    } else {
      setInput((prev) => ({ ...prev, [id]: quantity }));
      let productsToSend = [];
      Object.keys(input).forEach((key) =>
        productsToSend.push({ product: key, quantity: input[key] })
      );
      cartService.updateCart({
        cid: cart._id,
        body: { products: productsToSend },
        callbackSuccess: callbackSuccessUpdateCart,
        callbackError: callbackErrorUpdateCart,
      });
    }
  };

  const finishPurchase = async () => {
    Swal.fire({
      title: "¿Confirmar compra?",
      icon: "question",
      text: "Esta acción es irreversible, el cargo se hará al instante",
      showConfirmButton: true,
      confirmButtonText: "¡LO QUIERO YA!",
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        cartService.finishPurchase({
          cid: cart._id,
          callbackSuccess: callbackSuccessFinishPurchase,
          callbackError: callbackErrorFinishPurchase,
        });
      }
    });
  };
  //CALLBACKS
  const callbackSuccessGetCart = (response) => {
    setCart(response.data.payload);
  };

  const callbackErrorGetCart = (error) => {
    console.log(error);
  };
  const callbackSuccessDeleteProductFromCart = (response) => {
    cartService.getCartById({
      cid: currentUser.cart,
      callbackSuccess: callbackSuccessGetCart,
      callbackError: callbackErrorGetCart,
    });
  };
  const callbackErrorDeleteProductFromCart = (error) => {
    console.log(error);
  };
  const callbackSuccessUpdateCart = (response) => {
    console.log(response.data);
    cartService.getCartById({
      cid: currentUser.cart,
      callbackSuccess: callbackSuccessGetCart,
      callbackError: callbackErrorGetCart,
    });
    if (response.data.productOutStock) {
      Swal.fire({
        title: "Sin stock",
        icon: "error",
        text: `En el proceso de compra el producto ${response.data.prodTitle} se ha quedado sin stock.`,
      }).then((result) => {
        setItemCountLoading(false);
      });
    }
    if (response.data.stockLimitation) {
      Swal.fire({
        title: "Algunos productos tienen stock limitado",
        icon: "warning",
        text: `El producto ${response.data.prodTitle} tiene un stock limitado, por lo que decidimos darte la cantidad máxima disponible de este producto.`,
      }).then((result) => {
        setItemCountLoading(false);
      });
    }
    if (response.data.canBuy) {
      Swal.fire({
        title: "Carrito actualizado",
        icon: "success",
        text: "El carrito se ha actualizado con éxito",
        timer: 2000,
      }).then((result) => {
        setItemCountLoading(false);
      });
    }
  };
  const callbackErrorUpdateCart = (error) => {
    console.log(error.response.data);
  };
  const callbackSuccessFinishPurchase = (response) => {
    if (response.data.stockLimitation) {
      Swal.fire({
        title: "Algunos productos tienen stock limitado",
        icon: "warning",
        text: `El producto ${response.data.prodTitle} tiene un stock limitado, por lo que decidimos darte la cantidad máxima disponible de este producto.`,
      });
    }
    if (response.data.prodOutStock) {
      Swal.fire({
        title: "Sin stock",
        icon: "error",
        text: `En el proceso de compra el producto ${response.data.prodOutStock.title} se ha quedado sin stock.`,
      });
    }
    if (response.data.canPurchase) {
      Swal.fire({
        icon: "success",
        title: "¡Compra finalizada",
        text: `¡Felicidades! Los productos solicitados ${response.data.data} han sido procesados y están en proceso de envío`,
        timer: 3000,
      }).then((result) => {
        window.location.replace("/");
      });
    }
  };
  const callbackErrorFinishPurchase = (error) => {
    console.log(error);
  };
  return (
    <MainContainer>
      {cart ? (
        <div>
          <div className="container m-5">
            {cart && cart.products.length > 0 ? (
              <>
                <Table>
                  <thead>
                    <tr>
                      <th className="col-6">Articulo</th>
                      <th className="col-6">Cantidad</th>
                      <th className="col">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.products.map((element) => (
                      <tr className="shadow" key={element.product._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              className="w-25"
                              style={{ border: "none" }}
                              src={element.product.thumbnail[0]}
                              alt={element.product.title}
                            />
                            <div className="">{element.product.title}</div>
                          </div>
                        </td>
                        <td className="align-middle">
                          {element.product.stock === 0 ? (
                            <div>
                              <p>producto sin stock</p>
                              <button
                                className="btn border-0"
                                onClick={() =>
                                  deleteProduct(element.product._id)
                                }
                              >
                                <MdOutlineDelete />
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex align-items-center">
                              <div className="col-4 ">
                                <div className="d-flex justify-content-around shadow ">
                                  <button
                                    className="btn col-4 border-0"
                                    disabled={ItemCountLoading}
                                    onClick={() =>
                                      handleInputChange(
                                        element.product._id,
                                        --input[element.product._id],
                                        element.product.stock
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                  <div className="align-self-center">
                                    {input[element.product._id]}
                                  </div>
                                  <button
                                    className="btn col-4 border-0"
                                    disabled={ItemCountLoading}
                                    onClick={() =>
                                      handleInputChange(
                                        element.product._id,
                                        ++input[element.product._id],
                                        element.product.stock
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="col-1 m-3">
                                <button
                                  className="btn border-0"
                                  onClick={() =>
                                    deleteProduct(element.product._id)
                                  }
                                >
                                  <MdOutlineDelete />
                                </button>
                              </div>
                              <div
                                className={
                                  !ItemCountLoading ? "hidden widget" : "widget"
                                }
                              >
                                <div className="itemCountLoader text-primary col-2">
                                  <Spinner animation="border" size="sm" />
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            {accounting.formatMoney(
                              element.product.price * input[element.product._id]
                            )}
                          </div>
                          <div>{element.product.stock}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <>
                  <p>Resumen de Compra</p>
                  <div>
                    {cart.products.map((element) => (
                      <div key={element._id}>
                        {element.product.title} : {element.product.price} x{" "}
                        {input[element.product._id]} ={" "}
                        {element.product.price * input[element.product._id]}
                      </div>
                    ))}
                  </div>
                </>
                <button onClick={finishPurchase}>Comprar</button>
              </>
            ) : (
              <>
                <p>No hay productos en el carrito</p>
                <Link to="/">Ir de compras</Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </MainContainer>
  );
};

export default Cart;
