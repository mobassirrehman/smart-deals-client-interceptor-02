import React from "react";
import { Link } from "react-router";

const Product = () => {
  const { _id, title, price_min, price_max, image } = Product;
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure className="px-10 pt-10">
        <img src={image} alt="Shoes" className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title"> {title}</h2>
        <p>
          {price_min} - {price_max}
        </p>
        <div className="card-actions">
          <Link to={"/productDetails/${_id}"} className="btn btn-primary">
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
