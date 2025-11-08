import React, { useContext, useRef } from "react";
import { useLoaderData } from "react-router";
import { AuthContexts } from "../../contexts/AuthContexts";

const ProductDetails = () => {
  const { _id } = useLoaderData();
  const bidModalRef = useRef(null);
  const { user } = useContext(AuthContexts);
  console.log(_id);

  const handleBidModalOpen = () => {
    bidModalRef.current.showModal();
  };
  const handleBidSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.name.value;
    const bid = event.target.bid_price.value;
    console.log(_id, name, email, bid);
  };
  return (
    <div>
      {
        <div>
          <div></div>
          <div>
            <button onClick={handleBidModalOpen} className="btn btn-primary">
              I want to buy this Product
            </button>
            <dialog
              ref={bidModalRef}
              id="my_modal_5"
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box">
                <h3 className="font-bold text-lg">Give the best offer!</h3>
                <p className="py-4">offer something seller can not refuse.</p>
                <form onSubmit={handleBidSubmit}>
                  <fieldset className="fieldset">
                    <label className="label">Name</label>
                    <input
                      type="text"
                      className="input"
                      readOnly
                      defaultValue={user?.displayName}
                    />
                    <label className="label">Email</label>
                    <input
                      type="text"
                      className="input"
                      readOnly
                      defaultValue={user?.email}
                    />
                    <label className="label">Your Offer</label>
                    <input
                      type="number"
                      name="bid_price"
                      className="input"
                      placeholder="Enter your bid amount"
                      required
                    />
                    <button className="btn btn-neutral mt-4">
                      Submit Offer
                    </button>
                  </fieldset>
                </form>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      }
    </div>
  );
};

export default ProductDetails;
