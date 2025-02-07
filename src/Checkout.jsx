import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import './Checkout.css';
const Checkout = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        const card = elements.getElement(CardElement);
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card,
            billing_details: { name: formData.name, address: { line1: formData.address } },
        });

        if (error) {
            console.error("Payment Error:", error);
            alert(error.message);
            setIsProcessing(false);
            return;
        }

        console.log("PaymentMethod:", paymentMethod);
        alert("Payment successful!");
        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
            <CardElement className="card-element" />
            <button type="submit" disabled={!stripe || isProcessing}>
                {isProcessing ? "Processing..." : "Place Order"}
            </button>
        </form>
    );
};

export default Checkout;
