import Swal from "sweetalert2";
import Cookies from "js-cookie";

export const isLogin = () => {
  if (process.env.REACT_APP_AUTHENTICATION_MODE === "COOKIE") {
    let cookies = Cookies.get(process.env.REACT_APP_COOKIE_NAME);
    if (!cookies) {
      localStorage.clear();
      return false;
    } else {
      return cookies;
    }
  } else if (process.env.REACT_APP_AUTHENTICATION_MODE === "LOCAL_STORAGE") {
    const token = localStorage.getItem("sessionToken");
    return token !== null;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("sessionToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  };
};

//ITEM COUNT

export const ItemCount = ({ max, setQuantity, quantity }) => {
  const deleteItem = () => {
    quantity > 0 && setQuantity(quantity - 1);
  };

  const addOn = () => {
    quantity < max && setQuantity(quantity + 1);
  };

  return (
    <div className="col d-flex justify-content-around shadow ">
      <button
        onClick={deleteItem}
        className="btn col-3"
        style={{ border: "none" }}
        disabled={quantity === 1}
      >
        -
      </button>
      <div className="align-self-center">{quantity}</div>
      <button
        onClick={addOn}
        style={{ border: "none" }}
        className="btn col-3"
        disabled={quantity === max}
      >
        +
      </button>
    </div>
  );
};

//SweetAlert2

export const showToast = ({ type, text }) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: type,
    title: text,
  });
};

//NAVBAR OPTIONS

export const options = [
  { path: "/cart", label: "Carrito", showWhen: "user" },
  { path: "/newproduct", label: "Nuevo Producto", showWhen: "superadmin" },
];

//FILTERS OPTIONS

export const filtersOptions = [
  { value: "Motorola", label: "Motorola" },
  { value: "Samsung", label: "Samsung" },
  { value: "LG", label: "LG" },
  { value: "Recomendado", label: "Recomendado" },
];
