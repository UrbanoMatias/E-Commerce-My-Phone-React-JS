import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainContainer from "../../components/layout/MainContainer";
import { productsService, cartService } from "../../services";
import { Button, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { Loader } from "../../components/Loader/Loader";
import { UpdateProductForm } from "./UpdateProductForm";
import { ItemCount } from "../../utils";
import "../Cart/cart.scss";

const ItemDetail = (props) => {
  let params = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentCart, setCurrentCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isOpenToUpdateModal, setIsOpenToUpdateModal] = useState(false);
  const openUpdateModal = () => setIsOpenToUpdateModal(true);
  const closeUpdateModal = () => setIsOpenToUpdateModal(false);
  console.log(product);
  let currentUser = JSON.parse(localStorage.getItem("user"));

  let pid = params.pid;

  useEffect(() => {
    productsService.getProductById({
      pid: pid,
      callbackSuccess: callbackSuccessGetProductById,
      callbackError: callbackErrorGetProductById,
    });
  }, [pid]);
  useEffect(() => {
    if (currentUser && currentUser.role !== "superadmin" && !currentCart) {
      cartService.getCartById({
        cid: currentUser.cart,
        callbackSuccess: callbackSuccessGetCartById,
        callbackError: callbackErrorGetCartById,
      });
    }
  }, [currentUser, currentCart]);

  const confirmChanges = (update) => {
    Swal.fire({
      title: "¿Actualizar producto?",
      icon: "question",
      text: "Todos los usuarios podrán ver el producto y sus cambios",
      showConfirmButton: true,
      confirmButtonText: "Actualizar producto",
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        productsService.updateProduct({
          pid: product._id,
          body: update,
          callbackSuccess: callbackSuccessUpdateProduct,
          callbackError: callbackErrorUpdateProduct,
        });
      }
    });
  };

  const setUpdate = () => {
    setUpdating(true);
  };

  const logForCart = () => {
    Swal.fire({
      icon: "error",
      title: "Usuario no Registrado",
      text: "¡Hola! Tienes que iniciar sesión para agregar productos a tu carrito",
    }).then((result) => {
      window.location.replace("/login");
    });
  };

  const addProduct = () => {
    productsService.getProductById({
      pid: pid,
      callbackSuccess: callbackSuccessGetProductById,
      callbackError: callbackErrorGetProductById,
    });
    if (quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "Pedido vacío",
        text: "No se puede agregar una cantidad de 0 o menor en el carrito",
        timer: 2000,
      });
      return;
    } else {
      let pid = params.pid;
      cartService.addProductToCart({
        cid: currentUser.cart,
        pid: pid,
        body: { quantity },
        callbackSuccess: callbackSuccessAddProductToCart,
        callbackError: callbackErrorAddProductToCart,
      });
    }
  };

  // const changeFromThumbnail = (product) => {
  //     window.location.replace('/products/' + product._id);
  // };

  const deleteProduct = () => {
    Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      text: "Esta acción es irreversible",
      showConfirmButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        productsService.deleteProduct({
          pid: product._id,
          callbackSuccess: callbackSuccessDeleteProduct,
          callbackError: callbackErrorDeleteProduct,
        });
      }
    });
  };
  //CALLBACKS
  const callbackSuccessGetProductById = (result) => {
    setLoading(true);
    if (result.status === 200) {
      setProduct(result.data.payload);
      setLoading(false);
    }
  };
  const callbackErrorGetProductById = (error) => {
    console.log(error);
  };
  const callbackSuccessGetCartById = (result) => {
    setCurrentCart(result.data.payload.products);
  };
  const callbackErrorGetCartById = (error) => {
    console.log(error);
  };
  const callbackSuccessAddProductToCart = (result) => {
    if (result.data.quantityChanged) {
      Swal.fire({
        icon: "success",
        title: "Hubo un cambio en el número de ejemplares",
        text: `El stock del producto cambió durante el proceso, sólo se han podido añadir ${result.data.newQuantity} ejemplares del producto`,
        timer: 4000,
      }).then((result) => {
        window.location.replace("/cart");
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "¡Producto añadido con éxito!",
        text: `Se han añadido ${result.data.newQuantity}`,
        timer: 2000,
      }).then((result) => {
        window.location.replace("/cart");
      });
    }
  };
  const callbackSuccessUpdateProduct = (response) => {
    productsService.getProductById({
      pid: product._id,
      callbackSuccess: callbackSuccessGetProductById,
      callbackError: callbackErrorGetProductById,
    });
    setUpdating(false);
    Swal.fire({
      icon: "success",
      title: "Producto actualizado",
      text: "El producto se ha actualizado con éxito",
      timer: 2000,
    });
  };
  const callbackErrorUpdateProduct = (error) => {
    Swal.fire({
      icon: "error",
      title: "Error al actualziar el producto",
      text: "Ha habido un error al actualizar el producto",
      timer: 2000,
    });
  };
  const callbackErrorAddProductToCart = (error) => {
    console.log(error);
  };
  const callbackSuccessDeleteProduct = (response) => {
    Swal.fire({
      icon: "success",
      title: "Producto eliminado",
      text: "El producto se elimino correctamente",
      timer: 2000,
    }).then((result) => {
      window.location.replace("/");
    });
  };
  const callbackErrorDeleteProduct = (error) => {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "No eliminado",
      text: "El producto no pudo eliminarse, revisar cambios",
      timer: 1000,
    });
  };

  return (
    <MainContainer>
      <Container className="mt-5">
        {loading ? (
          <Loader />
        ) : (
          <Row>
            <div className="col-6 ">
              <div
                id="carouselExampleControls"
                className="carousel slide carousel-dark"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={product && product.thumbnail[0]}
                      className="d-block w-75"
                      alt={product && product.title}
                    />
                  </div>
                  {product &&
                    product.thumbnail.map((img) => (
                      <div className="carousel-item" key={img}>
                        <img
                          src={img}
                          className="d-block w-75"
                          alt={product && product.title}
                        />
                      </div>
                    ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div className="col-6 d-flex justify-content-center ">
              <Row>
                <div>
                  <h2 className="fs-2 text-secondary fw-bolder border-bottom">
                    {product && product.title}
                  </h2>
                </div>
                <div className="">
                  <h2 className="fs-5">Caracteristicas</h2>
                  <ul>
                    {product &&
                      product.description.map((desc) => (
                        <li key={desc}>{desc}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <p>{product && product.status}</p>
                  <p>
                    $ {product && product.price}
                    <span
                      style={{
                        fontSize: "8px",
                        position: "relative",
                        bottom: "8px",
                      }}
                    >
                      00
                    </span>
                  </p>
                  <p>
                    {product ? (
                      product.status ? (
                        product.status === "available" || product.stock > 0 ? (
                          <span style={{ color: "green" }}>
                            Aún con disponibilidad
                          </span>
                        ) : (
                          <span style={{ color: "red" }}>
                            Sin disponibilidad
                          </span>
                        )
                      ) : null
                    ) : null}
                  </p>
                  {product && <p>Disponibles: {product.stock} piezas</p>}
                </div>
                {!currentUser ? (
                  <div onClick={logForCart}>Carrito</div>
                ) : (
                  <>
                    {currentUser.role !== "superadmin" ? (
                      <>
                        <div className="customColumn3">
                          <div className="pricingPanel">
                            {currentCart ? (
                              currentCart.some(
                                (prod) => prod.product._id === product._id
                              ) ? (
                                <>
                                  <p>El producto ya está en el carrito</p>
                                  <Link
                                    to="/cart"
                                    className="btn btn-success text-center"
                                  >
                                    Terminar compra
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <br />
                                  {product ? (
                                    product.stock > 0 ? (
                                      <>
                                        <Row className="container d-flex">
                                          <ItemCount
                                            max={product.stock}
                                            quantity={quantity}
                                            setQuantity={setQuantity}
                                          />
                                          <button
                                            className="btn col-8 text-center shadow"
                                            onClick={addProduct}
                                          >
                                            Agregar al carrito
                                          </button>
                                        </Row>
                                      </>
                                    ) : (
                                      <p>
                                        Producto fuera de stock, pronto
                                        volveremos con más piezas
                                      </p>
                                    )
                                  ) : null}
                                </>
                              )
                            ) : null}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="adminColumn">
                          {!updating ? (
                            <>
                              <div>
                                <div>
                                  <p>
                                    Precio:{" "}
                                    {product ? product.price : "Indefinido"}
                                  </p>
                                </div>
                                <div>
                                  <ul>
                                    <li>
                                      Código:
                                      {product ? product.code : "Indefinido"}
                                    </li>
                                    <li>
                                      Stock:{" "}
                                      {product ? product.stock : "Indefinido"}
                                    </li>
                                  </ul>
                                </div>
                                <div
                                  style={{
                                    textAlign: "center",
                                    marginTop: "40px",
                                  }}
                                >
                                  <Button variant="primary" onClick={setUpdate}>
                                    Hacer cambios en el producto
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <Button onClick={openUpdateModal}>
                                Actualizar Producto
                              </Button>
                              <Button
                                className="addToCartButton"
                                variant="danger"
                                onClick={deleteProduct}
                              >
                                Eliminar producto
                              </Button>
                              <Button
                                onClick={() => setUpdating(false)}
                                variant="warning"
                              >
                                Cancelar
                              </Button>
                              <UpdateProductForm
                                isOpen={isOpenToUpdateModal}
                                close={closeUpdateModal}
                                product={product}
                                confirmChanges={confirmChanges}
                              />
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </Row>
            </div>
          </Row>
        )}
      </Container>
    </MainContainer>
  );
};

export default ItemDetail;
