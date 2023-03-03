import React from "react";
import { Spinner } from "react-bootstrap";

export const ItemCountLoader = () => {
  return (
    <div className="itemCountLoader text-primary col-2">
      <Spinner animation="border" size="sm" />
    </div>
  );
};
