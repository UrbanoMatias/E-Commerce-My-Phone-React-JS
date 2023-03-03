import { sessionService } from "../../services";
import { Link } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

const Login = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    sessionService.login({
      body: {
        email: data.email,
        password: data.password,
      },
      callbackSuccess: callbackSuccessLogin,
      callbackError: callbackErrorLogin,
    });
  };

  //CALLBACKS

  const callbackSuccessLogin = (response) => {
    if (process.env.REACT_APP_AUTHENTICATION_MODE === "LOCAL_STORAGE") {
      let user = response.data.payload.user;
      localStorage.setItem("sessionToken", response.data.payload.token);
      localStorage.setItem("user", JSON.stringify(user));
    } else if (process.env.REACT_APP_AUTHENTICATION_MODE === "COOKIE") {
      let user = response.data.payload.user;
      localStorage.setItem("user", JSON.stringify(user));
    }
    window.location.replace("/");
  };

  const callbackErrorLogin = (error) => {
    console.log(error);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            {...register("email")}
            placeholder="Email"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            {...register("password")}
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Ingresar
        </Button>
      </Form>
      <div>
        <p>
          ¿Eres nuevo?{" "}
          <Link to="/register"> Ingresa aquí para registrarte</Link>
        </p>
      </div>
    </Container>
  );
};

export default Login;
