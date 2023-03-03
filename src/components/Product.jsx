import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

const Product = ({ element }) => {
  return (
    <div>
      <Card style={{ width: "18rem" }} key={element.id}>
        <Card.Img
          variant="top"
          src={element.thumbnail[0]}
          alt={element.title}
        />
        <Card.Body>
          <Card.Title>{element.title}</Card.Title>
          <Card.Text>
            <span>$ {element.price}</span>
          </Card.Text>
          <Link to={`/products/${element._id}`} className=" btn btn-success">
            Ver mas
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Product;
