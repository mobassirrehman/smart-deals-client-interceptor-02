import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/products/${id}`)
      .then(res => {
        if (res.data.email !== user.email) {
          Swal.fire('Error', 'You can only edit your own products', 'error');
          navigate('/myProducts');
          return;
        }
        setProduct(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        Swal.fire('Error', 'Product not found', 'error');
        navigate('/myProducts');
      });
  }, [id, axiosSecure, user, navigate]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const image = e.target.image.value.trim();
    const price_min = parseFloat(e.target.price_min.value);
    const price_max = parseFloat(e.target.price_max.value);
    const category = e.target.category.value.trim();
    const condition = e.target.condition.value;
    const usage = e.target.usage.value.trim();
    const description = e.target.description.value.trim();
    const location = e.target.location.value.trim();
    const seller_contact = e.target.seller_contact.value.trim();

    if (price_min >= price_max) {
      Swal.fire('Error', 'Maximum price must be greater than minimum price', 'error');
      return;
    }

    const updatedProduct = {
      title,
      image,
      price_min,
      price_max,
      category,
      condition,
      usage,
      description,
      location,
      seller_contact,
      seller_name: user.displayName,
      seller_image: user.photoURL || "",
    };

    try {
      const res = await axiosSecure.put(`/products/${id}`, updatedProduct);
      if (res.data.modifiedCount) {
        Swal.fire({
          icon: 'success',
          title: 'Product Updated Successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => navigate('/myProducts'), 1500);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire('Error', 'Failed to update product', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-8">Edit Product</h2>

      <form onSubmit={handleUpdateProduct}>
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
                  defaultValue={product.title}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category *</span>
                </label>
                <select name="category" className="select select-bordered" defaultValue={product.category} required>
                  <option value="">Select a Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Musical Instruments">Musical Instruments</option>
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
                  defaultValue={product.price_min}
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
                  defaultValue={product.price_max}
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
                      defaultChecked={product.condition === 'fresh'}
                    />
                    <span className="label-text">Brand New</span>
                  </label>
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="condition"
                      value="used"
                      className="radio radio-primary"
                      defaultChecked={product.condition === 'used'}
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
                  defaultValue={product.usage}
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
                  defaultValue={product.location}
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
                  defaultValue={product.seller_contact}
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
                  defaultValue={product.image}
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
                  defaultValue={product.description}
                  placeholder="Describe your product in detail..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button type="submit" className="btn btn-primary flex-1">
                Update Product
              </button>
              <button
                type="button"
                onClick={() => navigate('/myProducts')}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;