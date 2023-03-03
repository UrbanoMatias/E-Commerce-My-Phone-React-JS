import { sessionService } from "../../services";
import { useForm } from "react-hook-form";
import { Button, Container, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Register = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    let form = new FormData();
    form.append("first_name", data.first_name);
    form.append("last_name", data.last_name);
    form.append("phone", data.phone);
    form.append("email", data.email);
    form.append("password", data.password);
    form.append("profile_picture", data.profile_picture[0]);
    sessionService.register({
      body: form,
      callbackSuccess: callbackSuccessRegister,
      callbackError: callbackErrorRegister,
    });
  };

  //CALLBACKS

  const callbackSuccessRegister = (response) => {
    Swal.fire({
      icon: "success",
      title: "Usuario Registrado",
      text: "Ahora puede identificarse",
      timer: 2000,
    }).then((result) => {
      window.location.replace("/login");
    });
  };

  const callbackErrorRegister = (response) => {
    console.log(response.data);
  };

  return (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            {...register("first_name")}
            placeholder="Escriba su nombre"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            {...register("last_name")}
            placeholder="Escriba su apellido"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Telefono</Form.Label>
          <Form.Control
            type="number"
            {...register("phone")}
            placeholder="Escriba su telefono"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            {...register("email")}
            placeholder="Email"
          />
          <Form.Text className="text-muted">
            Nunca Compartas tu email con ninguna persona.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            {...register("password")}
            placeholder="Contraseña"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Imagen de perfil</Form.Label>
          <Form.Control type="file" {...register("profile_picture")} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Registrarse
        </Button>
      </Form>
      <div>
        <p>
          ¿Ya tiene cuenta?{" "}
          <Link to="/login"> Has click aquí para ingresar</Link>
        </p>
      </div>
    </Container>
  );
};

export default Register;
