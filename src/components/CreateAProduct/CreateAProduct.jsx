import React from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
// import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CreateAProduct = () => {
  const { user } = useAuth();
  // const axiosInstances = useAxios();
  const axiosSecure = useAxiosSecure();

  const handleCreateAProduct = (e) => {
    e.preventDefault();
    const title = e.target.name.value.trim();
    const image = e.target.image.value.trim();
    const price_min = e.target.price_min.value.trim();
    const price_max = e.target.price_max.value.trim();

    // Validate all fields are filled
    if (!title || !image || !price_min || !price_max) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all fields",
      });
      return;
    }

    console.log(title, image, price_min, price_max);

    const newProduct = {
      title,
      image,
      price_max: parseFloat(price_max),
      price_min: parseFloat(price_min),
      email: user.email,
      seller_name: user.displayName,
    };

    // user.getIdToken().then((token) => {
    //   axios
    //     .post("http://localhost:3000/products", newProduct, {
    //       headers: { authorization: `Bearer ${token}` },
    //     })
    //     .then((data) => {
    //       console.log(data.data);
    //       if (data.data.insertedId) {
    //         Swal.fire({
    //           position: "top-end",
    //           icon: "success",
    //           title: "Your Product has been Created.",
    //           showConfirmButton: false,
    //           timer: 1500,
    //         });
    //         e.target.reset();
    //       }
    //     })
    //     .catch((error) => {
    //       console.log("Error creating product:", error);
    //     });
    // });

    //---------------------------//

    // user.getIdToken().then((token) => {
    //   axiosInstances
    //     .post("/products", newProduct, {
    //       headers: { authorization: `Bearer ${token}` },
    //     })
    //     .then((data) => {
    //       console.log(data.data);
    //       if (data.data.insertedId) {
    //         Swal.fire({
    //           position: "top-end",
    //           icon: "success",
    //           title: "Your Product has been Created.",
    //           showConfirmButton: false,
    //           timer: 1500,
    //         });
    //         e.target.reset();
    //       }
    //     })
    //     .catch((error) => {
    //       console.log("Error creating product:", error);
    //       Swal.fire({
    //         icon: "error",
    //         title: "Error",
    //         text: "Failed to create product",
    //       });
    //     });
    // });
    axiosSecure.post("/products", newProduct).then((data) => {
      console.log("after secure call", data.data);
    });
  };
  return (
    <div>
      <form onSubmit={handleCreateAProduct}>
        <fieldset className="fieldset">
          <label className="label">Name</label>
          <input type="text" name="name" className="input" required />
          <label className="label">Image URL</label>
          <input type="text" className="input" name="image" required />
          <label className="label">Min Price</label>
          <input
            type="number"
            name="price_min"
            className="input"
            placeholder="Minimum Price"
            required
            min="0"
            step="0.01"
          />
          <label className="label">Max Price</label>
          <input
            type="number"
            name="price_max"
            className="input"
            placeholder="Maximum Price"
            required
            min="0"
            step="0.01"
          />
          <button className="btn btn-neutral mt-4">Add a Product</button>
        </fieldset>
      </form>
    </div>
  );
};

export default CreateAProduct;
