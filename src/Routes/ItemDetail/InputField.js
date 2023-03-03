import React from "react";

import { useForm, useFieldArray, Controller } from "react-hook-form";
export const InputField = (description) => {
  //   const defaultDescriptions = () => {

  //         let productdesc = description.description.map(element => element)

  //         let defaultss = {
  //             description: productdesc[0]
  //             }
  //             console.log(productdesc)
  //         return defaultss
  //     }

  const defaultDescriptions = () => {
    let productdesc = description.description.map((element) => ({
      description: element,
    }));
    return productdesc;
  };

  const { control, register } = useForm({
    defaultValues: { description: defaultDescriptions() },
  });
  const { append, fields, remove } = useFieldArray({
    control,
    name: "description",
  });

  return (
    <div>
      <ul>
        {fields.map((item, index) => (
          <div>
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
          </div>
        ))}
      </ul>
      <button type="button" onClick={() => append({ description: "" })}>
        Agregar
      </button>
    </div>
  );
};
