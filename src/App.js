import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { sessionService } from "./services";
import { isLogin } from "./utils";
import { Loader } from "./components/Loader/Loader";
const Home = React.lazy(() => import("./Routes/Home"));
const ItemDetail = React.lazy(() => import("./Routes/ItemDetail"));
const Register = React.lazy(() => import("./Routes/Register"));
const Login = React.lazy(() => import("./Routes/Login"));
const Cart = React.lazy(() => import("./Routes/Cart"));
const NewProduct = React.lazy(() => import("./Routes/NewProduct"));

function App() {
  const callbackSuccessCurrent = (response) => {
    if (response.data.error) {
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("user");
    } else {
      localStorage.setItem("user", JSON.stringify(response.data.payload));
    }
  };
  const callbackErrorCurrent = (response) => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  if (isLogin()) {
    sessionService.current({
      callbackSuccess: callbackSuccessCurrent,
      callbackError: callbackErrorCurrent,
    });
  }

  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <Routes>
          <Route>
            <Route element={<PrivateRoute isLogged={isLogin()} />}>
              <Route path="/NewProduct" element={<NewProduct />} />
              <Route path="/cart" element={<Cart />} />
            </Route>
            <Route element={<PublicRoute isLogged={isLogin()} />} />
            <Route path="/" element={<Home />} />
            <Route path="/products/:pid" element={<ItemDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
