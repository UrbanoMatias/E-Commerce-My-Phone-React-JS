import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Select from "react-select";
import { filtersOptions } from "../../utils";
import Swal from "sweetalert2";
import { productsService } from "../../services";
import { Link, useParams } from "react-router-dom";

export const UpdateForm = (props) => {
  let params = useParams();
  console.log(props);

  useEffect(() => {
    let pid = params.pid;
    productsService.getProductById({
      pid: pid,
      callbackSuccess: callbackSuccessGetProductById,
      callbackError: callbackErrorGetProductById,
    });
  }, []);
  const defaultFilters = () => {
    let defaultValue = props.product.filters.map((element) => ({
      value: element,
      label: element,
    }));
    return defaultValue;
  };
  const defaultDescriptions = () => {
    let description = props.product.description.map((element) => ({
      description: element,
    }));
    let descriptions = { description };
    return descriptions;
  };
  const { register, control, handleSubmit } = useForm({
    defaultValues: defaultDescriptions(),
  });
  const { append, fields, remove } = useFieldArray({
    control,
    name: "description",
  });
  const onSubmit = (data) => {
    Swal.fire({
      title: "¿Actualizar producto?",
      icon: "question",
      text: "Todos los usuarios podrán ver el procuto y sus cambios",
      showConfirmButton: true,
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        let arrayDesc = Array.from(data.description).map(
          (description) => description.description
        );
        let arrayFilters = Array.from(data.filters).map(
          (filters) => filters.value
        );
        let update = {
          title: data.title,
          description: arrayDesc,
          filters: arrayFilters,
          price: data.price,
          stock: data.stock,
          code: data.code,
        };
        console.log(update);

        productsService.updateProduct({
          pid: props.product._id,
          body: update,
          callbackSuccess: callbackSuccessUpdateProduct,
          callbackError: callbackErrorUpdateProduct,
        });
      }
    });
  };

  //CALLBACKS
  const callbackSuccessGetProductById = (result) => {
    console.log(result.data.payload);
  };
  const callbackErrorGetProductById = (error) => {
    console.log(error);
  };
  const callbackSuccessUpdateProduct = (response) => {
    productsService.getProductById({
      prod: props.product._id,
      callbackSuccess: callbackSuccessGetProductById,
      callbackError: callbackErrorGetProductById,
    });
    props.setUpdatingFalse();
    Swal.fire({
      icon: "success",
      title: "Producto actualizado",
      text: "El producto se ha actualizado con éxito",
      timer: 2000,
    }).then((result) => {
      window.location.replace("/");
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

  return (
    <div>
      <p style={{ fontSize: "25px", textAlign: "center" }}>
        Actualizar producto
      </p>
      <div style={{ textAlign: "center" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Nombre del producto: </label>
          <div>
            <input
              id="title"
              {...register("title", {
                value: props.product.title,
                required: true,
              })}
            ></input>
          </div>
          <div className="w-64 font-bold h-6 mx-2 mt-3 text-gray-800">
            <div>
              <ul>
                {fields.map((item, index) => (
                  <li key={item.id}>
                    <input {...register(`description.${index}.description`)} />
                    <button type="button" onClick={() => remove(index)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => append({ description: "" })}>
                Agregar
              </button>
            </div>
          </div>
          <div>
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
          </div>
          <div>
            <label>Precio</label>
            <input
              type="number"
              {...register("price", {
                value: props.product.price,
                required: true,
              })}
            />
          </div>
          <div>
            <label>Codigo</label>
            <input
              {...register("code", {
                value: props.product.code,
              })}
            ></input>
          </div>
          <div>
            <label>Stock: </label>
            <input
              type="number"
              {...register("stock", {
                value: props.product.stock,
                required: true,
              })}
            />
          </div>
          <div>
            <button type="submit">Confirmar</button>
            <button type="button" onClick={props.setUpdatingTrue}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
