import React, { use, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { AuthContexts } from "../../contexts/AuthContexts";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ProductDetails = () => {
  const product = useLoaderData();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const bidModalRef = useRef(null);
  const { user } = use(AuthContexts);
  const axiosSecure = useAxiosSecure();

  const isOwner = user?.email === product?.email;

  useEffect(() => {
    if (product?._id) {
      axiosSecure
        .get(`/products/bids/${product._id}`)
        .then((res) => {
          setBids(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching bids:", error);
          setLoading(false);
        });
    }
  }, [product, axiosSecure]);

  const handleBidModalOpen = () => {
    if (isOwner) {
      Swal.fire("Error", "You cannot bid on your own product", "error");
      return;
    }
    if (product.status === "sold") {
      Swal.fire("Error", "This product is already sold", "error");
      return;
    }
    bidModalRef.current.showModal();
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const bid_price = parseFloat(e.target.bid.value);

    if (bid_price < product.price_min || bid_price > product.price_max) {
      Swal.fire(
        "Invalid Bid",
        `Bid must be between $${product.price_min} and $${product.price_max}`,
        "error"
      );
      return;
    }

    const newBid = {
      product: product._id,
      buyer_name: user.displayName,
      buyer_email: user.email,
      buyer_image: user.photoURL || "",
      buyer_contact: user.phoneNumber || "N/A",
      bid_price,
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("/bids", newBid);
      if (res.data.insertedId) {
        bidModalRef.current.close();
        Swal.fire({
          icon: "success",
          title: "Bid Placed Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        newBid._id = res.data.insertedId;
        setBids([newBid, ...bids].sort((a, b) => b.bid_price - a.bid_price));
        e.target.reset();
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to place bid",
        "error"
      );
    }
  };

  const handleAcceptBid = async (bidId) => {
    Swal.fire({
      title: "Accept this bid?",
      text: "This will mark the product as sold and delete other bids",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/bids/status/${bidId}`, {
            status: "confirmed",
          });
          if (res.data.modifiedCount || res.data.message) {
            Swal.fire(
              "Success!",
              "Bid accepted. Product marked as sold!",
              "success"
            );
            setBids(
              bids
                .filter((bid) => bid._id === bidId)
                .map((bid) => ({ ...bid, status: "confirmed" }))
            );
          }
        } catch (error) {
          console.error("Error accepting bid:", error);
          Swal.fire("Error", "Failed to accept bid", "error");
        }
      }
    });
  };

  const handleRejectBid = async (bidId) => {
    try {
      const res = await axiosSecure.patch(`/bids/status/${bidId}`, {
        status: "rejected",
      });
      if (res.data.modifiedCount) {
        Swal.fire({
          icon: "success",
          title: "Bid Rejected",
          showConfirmButton: false,
          timer: 1500,
        });
        setBids(
          bids.map((bid) =>
            bid._id === bidId ? { ...bid, status: "rejected" } : bid
          )
        );
      }
    } catch (error) {
      console.error("Error rejecting bid:", error);
      Swal.fire("Error", "Failed to reject bid", "error");
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            onError={handleImageError}
          />
        </div>

        <div>
          <div className="badge badge-primary mb-2">{product.category}</div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

          <div className="text-3xl font-bold text-primary mb-4">
            ${product.price_min} - ${product.price_max}
          </div>

          <div className="space-y-3 mb-6">
            <p className="flex items-center gap-2">
              <span className="font-semibold">Condition:</span>
              <span className="badge badge-outline">{product.condition}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Usage:</span> {product.usage}
            </p>
            <p className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              {product.location}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Posted:</span>
              {new Date(product.created_at).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              {product.status === "pending" ? (
                <span className="badge badge-warning">Available</span>
              ) : (
                <span className="badge badge-success">Sold</span>
              )}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-6 p-4 bg-base-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Seller Information</h3>
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img
                    src={product.seller_image}
                    alt={product.seller_name}
                    onError={handleImageError}
                  />
                </div>
              </div>
              <div>
                <p className="font-semibold">{product.seller_name}</p>
                <p className="text-sm text-gray-600">
                  {product.seller_contact}
                </p>
              </div>
            </div>
          </div>

          {!isOwner && product.status === "pending" && (
            <button
              onClick={handleBidModalOpen}
              className="btn btn-primary btn-lg w-full"
            >
              Place Your Bid
            </button>
          )}
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <h3 className="text-3xl font-bold mb-6">
          Bids for this Product:{" "}
          <span className="text-primary">{bids.length}</span>
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-20 w-full"></div>
            ))}
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No bids yet. Be the first to bid!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>SL No.</th>
                  <th>Buyer</th>
                  <th>Bid Price</th>
                  <th>Status</th>
                  {isOwner && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, index) => (
                  <tr key={bid._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={
                                bid.buyer_image ||
                                "https://via.placeholder.com/50"
                              }
                              alt={bid.buyer_name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{bid.buyer_name}</div>
                          <div className="text-sm opacity-50">
                            {bid.buyer_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-lg font-semibold text-primary">
                      ${bid.bid_price}
                    </td>
                    <td>
                      {bid.status === "pending" && (
                        <span className="badge badge-warning">Pending</span>
                      )}
                      {bid.status === "confirmed" && (
                        <span className="badge badge-success">Accepted</span>
                      )}
                      {bid.status === "rejected" && (
                        <span className="badge badge-error">Rejected</span>
                      )}
                    </td>
                    {isOwner && bid.status === "pending" && (
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptBid(bid._id)}
                            className="btn btn-success btn-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid._id)}
                            className="btn btn-error btn-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <dialog ref={bidModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Place Your Bid</h3>
          <p className="text-sm text-gray-600 mb-4">
            Bid range: ${product.price_min} - ${product.price_max}
          </p>

          <form onSubmit={handleBidSubmit}>
            <div className="form-control mb-4">
              <label className="label">Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={user?.displayName || ""}
                readOnly
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered"
                value={user?.email || ""}
                readOnly
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">Your Bid Amount ($)</label>
              <input
                type="number"
                name="bid"
                className="input input-bordered"
                placeholder={`Between ${product.price_min} and ${product.price_max}`}
                required
                min={product.price_min}
                max={product.price_max}
                step="0.01"
              />
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Place Bid
              </button>
              <button
                type="button"
                onClick={() => bidModalRef.current.close()}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ProductDetails;
