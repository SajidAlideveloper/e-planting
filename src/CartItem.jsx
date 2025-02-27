import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateQuantity } from "./CartSlice.jsx";
import "./CartItem.css";
import "./ToastContainer.css";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./Checkout";

const CartItem = ({ onContinueShopping }) => {
    const cart = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();

    // Calculate total amount
    const calculateTotalAmount = (cart) => {
        return cart.reduce((total, item) => {
            const cost = parseFloat(item.cost.toString().replace(/[^0-9.]/g, ""));
            return total + item.quantity * cost;
        }, 0);
    };

    const handleContinueShopping = (e) => {
        onContinueShopping(e);
    };

    const handleIncrement = (item) => {
        dispatch(updateQuantity({ ...item, quantity: item.quantity + 1 }));
    };

    const handleDecrement = (item) => {
        if (item.quantity > 1) {
            dispatch(updateQuantity({ ...item, quantity: item.quantity - 1 }));
        } else {
            dispatch(removeItem(item.id));
        }
    };

    const handleRemove = (item) => {
        dispatch(removeItem(item));
    };

    const calculateTotalCost = (item) => {
        const cost = item.cost.replace(/[^0-9.]/g, "");
        return item.quantity * cost;
    };

    // Setting up Stripe
    const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

    const [showCheckout, setShowCheckout] = useState(false);

    const [showReceipt, setShowReceipt] = useState(false);

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error("You don't have any items yet.");
        } else {
            toast.success("Opening checkout...");
            setShowReceipt(true);
        }
    };

    const closeModal = () => {
        setShowCheckout(false);
    };

    return (
        <div className="cart-container">
            <h2 style={{ color: "black" }}>
                Total Cart Amount: ${calculateTotalAmount(cart)}
            </h2>
            <div>
                {cart.map((item) => (
                    <div className="cart-item" key={item.name}>
                        <img className="cart-item-image" src={item.image} alt={item.name} />
                        <div className="cart-item-details">
                            <div className="cart-item-name">{item.name}</div>
                            <div className="cart-item-cost">{item.cost}</div>
                            <div className="cart-item-quantity">
                                <button
                                    className="cart-item-button cart-item-button-dec"
                                    onClick={() => handleDecrement(item)}
                                >
                                    -
                                </button>
                                <span className="cart-item-quantity-value">
                  {item.quantity}
                </span>
                                <button
                                    className="cart-item-button cart-item-button-inc"
                                    onClick={() => handleIncrement(item)}
                                >
                                    +
                                </button>
                            </div>
                            <div className="cart-item-total">
                                Total: ${calculateTotalCost(item)}
                            </div>
                            <button
                                className="cart-item-delete"
                                onClick={() => handleRemove(item.name)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: "20px", color: "black" }} className="total_cart_amount"></div>
            <div className="continue_shopping_btn">
                <button className="get-started-button" onClick={(e) => handleContinueShopping(e)}>
                    Continue Shopping
                </button>
                <br />
                <button className="get-started-button1" onClick={handleCheckout}>
                    Checkout
                </button>
                <ToastContainer className="toast-container" />
            </div>

            {/*Model to view reciept*/}
            <Modal
                isOpen={showReceipt} // Show this first
                onRequestClose={() => setShowReceipt(false)}
                contentLabel="Order Summary"
                className="receipt-modal"
                overlayClassName="checkout-overlay"
            >
                <h2>Order Summary</h2>
                <div className="receipt-items">
                    {cart.map(item => (
                        <div key={item.name} className="receipt-item">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>${calculateTotalCost(item).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <h3>Total Amount: ${calculateTotalAmount(cart).toFixed(2)}</h3>
                <button className={"modal-btn"} onClick={() => { setShowReceipt(false); setShowCheckout(true); }}>
                    Proceed to Payment
                </button>
                <button className={'modal-btn'} onClick={() => setShowReceipt(false)}>Cancel</button>
            </Modal>

            {/* Modal for Checkout */}
            <Modal
                isOpen={showCheckout}
                onRequestClose={closeModal}
                contentLabel="Checkout"
                className="checkout-modal"
                overlayClassName="checkout-overlay"
            >
                <button className="close-button" onClick={closeModal}>
                    ✖
                </button>
                <Elements stripe={stripePromise}>
                    <Checkout />
                </Elements>
            </Modal>
        </div>
    );
};

export default CartItem;
