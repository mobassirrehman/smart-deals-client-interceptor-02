import React from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CreateAProduct = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const handleCreateAProduct = async (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const image = e.target.image.value.trim();
    const price_min = e.target.price_min.value.trim();
    const price_max = e.target.price_max.value.trim();
    const category = e.target.category.value.trim();
    const condition = e.target.condition.value;
    const usage = e.target.usage.value.trim();
    const description = e.target.description.value.trim();
    const location = e.target.location.value.trim();
    const seller_contact = e.target.seller_contact.value.trim();

    if (
      !title ||
      !image ||
      !price_min ||
      !price_max ||
      !category ||
      !description ||
      !location ||
      !seller_contact
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields",
      });
      return;
    }

    const newProduct = {
      title,
      image,
      price_min: parseFloat(price_min),
      price_max: parseFloat(price_max),
      email: user.email,
      seller_name: user.displayName,
      seller_image: user.photoURL || "",
      category,
      condition,
      usage,
      description,
      location,
      seller_contact,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      const response = await axiosSecure.post("/products", newProduct);

      if (response.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Product Created Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        e.target.reset();
      }
    } catch (error) {
      console.error("Error creating product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create product",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-center mb-8">Create A Product</h2>

      <form onSubmit={handleCreateAProduct}>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="input input-bordered"
                  placeholder="e.g., Yamaha Fz Guitar for Sale"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category *</span>
                </label>
                <select
                  name="category"
                  className="select select-bordered"
                  required
                >
                  <option value="">Select a Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Minimum Price ($) *</span>
                </label>
                <input
                  type="number"
                  name="price_min"
                  className="input input-bordered"
                  placeholder="e.g., 18.5"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Maximum Price ($) *</span>
                </label>
                <input
                  type="number"
                  name="price_max"
                  className="input input-bordered"
                  placeholder="e.g., 30"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product Condition *</span>
                </label>
                <div className="flex gap-4">
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="condition"
                      value="fresh"
                      className="radio radio-primary"
                      defaultChecked
                    />
                    <span className="label-text">Brand New</span>
                  </label>
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="condition"
                      value="used"
                      className="radio radio-primary"
                    />
                    <span className="label-text">Used</span>
                  </label>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Usage Time *</span>
                </label>
                <input
                  type="text"
                  name="usage"
                  className="input input-bordered"
                  placeholder="e.g., 1 year 3 months"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location *</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="input input-bordered"
                  placeholder="City, Country"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contact Number *</span>
                </label>
                <input
                  type="text"
                  name="seller_contact"
                  className="input input-bordered"
                  placeholder="e.g., +1-555-1234"
                  required
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Product Image URL *</span>
                </label>
                <input
                  type="url"
                  name="image"
                  className="input input-bordered"
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Product Description *</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered h-32"
                  placeholder="Describe your product in detail..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Create Product
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateAProduct;
