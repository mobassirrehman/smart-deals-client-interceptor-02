import React, { useContext, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { AuthContexts } from "../../contexts/AuthContexts";
import Swal from "sweetalert2";
import axios from "axios";

const ProductDetails = () => {
  const loaderData = useLoaderData();
  console.log("Loader data:", loaderData);
  const productId = loaderData?._id;
  const [bids, setBids] = useState([]);
  const bidModalRef = useRef(null);
  const { user } = useContext(AuthContexts);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => {
        axios
          .get(`http://localhost:3000/products/bids/${productId}`, {
            headers: { authorization: `Bearer ${token}` },
          })
          .then((response) => {
            console.log("after axios get", response.data);
            if (Array.isArray(response.data)) {
              setBids(response.data);
            } else {
              setBids([]);
            }
          })
          .catch((error) => {
            console.log("axios error:", error);
            setBids([]);
          });
      });
    }
  }, [productId, user]);

  // useEffect(() => {
  //   const headers = {};
  //   if (user?.accessToken) {
  //     headers.authorization = `Bearer ${user.accessToken}`;
  //   }

  //   fetch(`http://localhost:3000/products/bids/${productId}`, { headers })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (Array.isArray(data)) {
  //         setBids(data);
  //       } else {
  //         setBids([]);
  //       }
  //     })
  //     .catch(() => {
  //       setBids([]);
  //     });
  // }, [productId, user?.accessToken]);

  const handleBidModalOpen = () => {
    bidModalRef.current.showModal();
  };
  const handleBidSubmit = (event) => {
    event.preventDefault();
    console.log("handleBidSubmit called");
    const name = event.target.name.value;
    const email = event.target.email.value;
    const bid = event.target.bid.value;

    const newBid = {
      product: productId,
      buyer_name: name,
      buyer_email: email,
      buyer_image: user?.photoURL,
      bid_price: bid,
      status: "pending",
    };
    console.log("Submitting bid:", newBid);

    user.getIdToken().then((token) => {
      fetch("http://localhost:3000/bids", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBid),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Response data:", data);
          if (data.insertedId) {
            bidModalRef.current.close();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your bid has been placed.",
              showConfirmButton: false,
              timer: 1500,
            });
            // add the new bid to the state
            newBid._id = data.insertedId;
            const newBids = [...bids, newBid];
            newBids.sort((a, b) => b.bid_price - a.bid_price);
            setBids(newBids);
          }
        })
        .catch((error) => {
          console.log("Bid submit error:", error);
        });
    });
  };
  return (
    <div>
      <div>
        <div></div>
        <div>
          <button onClick={handleBidModalOpen} className="btn btn-primary">
            I want to Buy this Product
          </button>

          <dialog
            ref={bidModalRef}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Give the best offer!</h3>
              <p className="py-4">Offer something seller can not resist</p>
              <form onSubmit={handleBidSubmit}>
                <fieldset className="fieldset">
                  <label className="label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    readOnly
                    defaultValue={user?.displayName}
                  />
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    name="email"
                    readOnly
                    defaultValue={user?.email}
                  />
                  <label className="label">Bid</label>
                  <input
                    type="text"
                    name="bid"
                    className="input"
                    placeholder="Your Bid"
                  />
                  <button className="btn btn-neutral mt-4">
                    Place your bid
                  </button>
                </fieldset>
              </form>

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Cancel</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      <div>
        <h3 className="text-3xl">
          Bids for this Product:{" "}
          <span className="text-primary">{bids.length}</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>SL No.</th>
                <th>Buyer Name</th>
                <th>Buyer Email</th>
                <th>Bid Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, index) => (
                <tr key={bid._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{bid.buyer_name}</div>
                        <div className="text-sm opacity-50">United States</div>
                      </div>
                    </div>
                  </td>
                  <td>{bid.buyer_email}</td>
                  <td>{bid.bid_price}</td>
                  <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
