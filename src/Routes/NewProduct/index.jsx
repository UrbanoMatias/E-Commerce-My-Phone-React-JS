import { Container, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import MainContainer from "../../components/layout/MainContainer";
import { productsService } from "../../services";
import Select from "react-select";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { filtersOptions } from "../../utils";

const NewProduct = () => {
  const { register, handleSubmit, control } = useForm();

  const { append, fields, remove } = useFieldArray({
    control,
    name: "description",
  });

  const onSubmit = (data) => {
    let form = new FormData();
    form.append("title", data.title);
    let descriptions = Array.from(data.description).map(
      (description) => description.description
    );
    descriptions.forEach((description) => {
      form.append("description", description);
    });
    let filters = Array.from(data.filters).map((filters) => filters.value);
    filters.forEach((filters) => {
      form.append("filters", filters);
    });
    form.append("code", data.code);
    form.append("stock", data.stock);
    form.append("price", data.price);
    let files = Array.from(data.thumbnail);
    files.forEach((img) => {
      form.append("thumbnail", img);
    });
    productsService.createProduct({
      body: form,
      callbackSuccess: callbackSuccessCreateProduct,
      callbackError: callbackErrorCreateProduct,
    });
  };

  /*CALLBACKS*/
  const callbackSuccessCreateProduct = (response) => {
    Swal.fire({
      title: "Producto agregado",
      icon: "success",
      text: "El producto se ha agregado con éxito",
      timer: 3000,
    }).then((result) => {
      window.location.replace("/");
    });
  };
  const callbackErrorCreateProduct = (error) => {
    Swal.fire({
      title: "Error de agregación",
      icon: "error",
      text: "El producto no pudo agregarse correctamente, revisar conexión o formato",
      timer: 3000,
    });
  };

  return (
    <>
      <MainContainer>
        <Container className="mt-5">
          <h2 className="mt-5 mb-5 text-center">Nuevo producto</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group mb-3">
              <label className="input-group-text" id="basic-addon1">
                Nombre del producto
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del producto"
                aria-label="Producto"
                aria-describedby="basic-addon1"
                {...register("title")}
              />
            </div>

            <div className="w-64 font-bold h-6 mx-2 mt-3 text-gray-800">
              <h3>Caracteristicas</h3>
              <ul>
                {fields.map((item, index) => (
                  <li key={item.id}>
                    <input
                      {...register(`description.${index}.description`, {
                        required: true,
                      })}
                    />
                    <button type="button" onClick={() => remove(index)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => append({ description: "" })}>
                append
              </button>
            </div>

            <Controller
              name="filters"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    className="reactSelect"
                    name="filters"
                    placeholder="Filtros"
                    options={filtersOptions}
                    isMulti
                    {...field}
                  />
                );
              }}
            />

            <div className="input-group mb-3">
              <label className="input-group-text" id="basic-addon1">
                Código
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Código"
                aria-label="code"
                aria-describedby="basic-addon1"
                {...register("code")}
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                aria-label="Precio"
                placeholder="Precio"
                {...register("price")}
              />
            </div>

            <div className="input-group mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Stock"
                aria-label="stock"
                aria-describedby="basic-addon1"
                {...register("stock")}
              />
              <label className="input-group-text" id="basic-addon1">
                Stock
              </label>
            </div>

            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Selecciona las imagenes</Form.Label>
              <Form.Control type="file" {...register("thumbnail")} multiple />
            </Form.Group>

            <div className="input-group">
              <button className="btn btn-primary">Confirmar</button>
            </div>
          </form>
        </Container>
      </MainContainer>
    </>
  );
};

export default NewProduct;
