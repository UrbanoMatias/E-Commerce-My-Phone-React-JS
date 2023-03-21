import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { filtersOptions } from "../../utils";
import Select from "react-select";

export const UpdateProductForm = ({
  isOpen,
  close,
  product,
  confirmChanges,
}) => {
  const defaultFilters = () => {
    let defaultValue = product.filters.map((element) => ({
      value: element,
      label: element,
    }));
    return defaultValue;
  };

  const defaultDescriptions = () => {
    let description = product.description.map((element) => ({
      description: element,
    }));
    let descriptions = { description };
    return descriptions;
  };

  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: defaultDescriptions(),
  });
  const { append, fields, remove } = useFieldArray({
    control,
    name: "description",
  });
  const onSubmit = (data) => {
    let arrayDesc = Array.from(data.description).map(
      (description) => description.description
    );
    let arrayFilters = Array.from(data.filters).map((filters) => filters.value);
    let update = {
      title: data.title,
      description: arrayDesc,
      filters: arrayFilters,
      price: data.price,
      stock: data.stock,
      code: data.code,
      status: data.status,
    };
    confirmChanges(update);
  };

  return (
    <Modal
      show={isOpen}
      onHide={close}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Actualizar producto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Nombre del producto:</Form.Label>
            <Form.Control
              id="title"
              {...register("title", {
                value: product.title,
                required: true,
              })}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Caracteristicas</Form.Label>
            <div className="w-64 font-bold h-6 mx-2 mt-3 text-gray-800">
              <div>
                <ul>
                  {fields.map((item, index) => (
                    <li key={item.id}>
                      <Controller
                        render={({ field }) => <input {...field} />}
                        name={`description.${index}.description`}
                        control={control}
                      />
                      <button type="button" onClick={() => remove(index)}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => append({ description: "" })}
                >
                  Agregar
                </button>
              </div>
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Filtros</Form.Label>
            <Controller
              name="filters"
              control={control}
              defaultValue={defaultFilters()}
              render={({ field }) => {
                return (
                  <Select
                    closeMenuOnSelect={false}
                    placeholder="Filtros"
                    options={filtersOptions}
                    isMulti
                    {...field}
                  />
                );
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              {...register("price", {
                value: product.price,
                required: true,
              })}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Codigo</Form.Label>
            <Form.Control
              {...register("code", {
                value: product.code,
                required: true,
              })}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              {...register("stock", {
                value: product.stock,
              })}
            ></Form.Control>
          </Form.Group>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              {...register("status", {})}
              value="available"
            />
            <label className="form-check-label" for="flexRadioDefault1">
              Disponible
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              {...register("status", {})}
              value="unavailable"
            />
            <label className="form-check-label" for="flexRadioDefault2">
              Sin disponiblidad
            </label>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setValue("stock", 1);
            setValue("status", "available");
          }}
        >
          Set Values Positivos
        </Button>
        <Button
          onClick={() => {
            setValue("stock", 0);
            setValue("status", "unavailable");
          }}
        >
          Set Values Negativos
        </Button>
        <Button onClick={handleSubmit(onSubmit)}>Confirmar</Button>
        <Button onClick={close} variant="danger">
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
