<tbody>
  {cart.products.map((element) => (
    <tr className="shadow" key={element.product._id}>
      <td className="col-4 align-middle align-self-center w-25">
        <div className="row">
          <img
            className="w-25 col"
            style={{ border: "none" }}
            src={element.product.thumbnail[0]}
            alt={element.product.title}
          />
          <div className="col">{element.product.title}</div>
        </div>
      </td>
      <td className="col-2 align-middle ">
        <Row>
          <div className="col">
            <Row className="container d-flex">
              <div className="d-flex justify-content-around shadow ">
                <button
                  className="btn col-4"
                  disabled={element.quantity === 1}
                  style={{ border: "none" }}
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
                  className="btn col-4"
                  disabled={element.quantity === element.product.stock}
                  style={{ border: "none" }}
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
            </Row>
          </div>
          <button
            className="btn col-1"
            onClick={() => deleteProduct(element.product._id)}
          >
            <MdOutlineDelete />
          </button>
        </Row>
      </td>
      <td className="col-2 align-middle text-center">
        {accounting.formatMoney(
          element.product.price * input[element.product._id]
        )}
      </td>
    </tr>
  ))}
</tbody>;
