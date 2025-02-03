import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {removeItem, updateQuantity} from './CartSlice.jsx';
import './CartItem.css';

const CartItem = ({ onContinueShopping}) => {
    const cart = useSelector(state => state.cart.items);
    const dispatch = useDispatch();


  // Calculate total amount for all products in the cart
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
          dispatch(updateQuantity({ ...item,quantity: item.quantity + 1 }));
    };

    const handleDecrement = (item) => {
      if (item.quantity > 1) {
          dispatch(updateQuantity({ ...item,quantity: item.quantity - 1 }));
      }else {
          dispatch(removeItem(item.id));
      }
    };

  const handleRemove = (item) => {
      dispatch(removeItem(item));
  };

    const calculateTotalCost = (item) => {
        const cost = (item.cost.replace(/[^0-9.]/g, "")); //Remove all non numeric characters like $
        return item.quantity * cost;
    };




    return (
    <div className="cart-container">
      <h2 style={{ color: 'black' }}>Total Cart Amount: ${calculateTotalAmount(cart)}</h2>
      <div>
        {cart.map(item => (
          <div className="cart-item" key={item.name}>
            <img className="cart-item-image" src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">{item.cost}</div>
              <div className="cart-item-quantity">
                <button className="cart-item-button cart-item-button-dec" onClick={() => handleDecrement(item)}>-</button>
                <span className="cart-item-quantity-value">{item.quantity}</span>
                <button className="cart-item-button cart-item-button-inc" onClick={() => handleIncrement(item)}>+</button>
              </div>
              <div className="cart-item-total">Total: ${calculateTotalCost(item)}</div>
              <button className="cart-item-delete" onClick={() => handleRemove(item.name)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', color: 'black' }} className='total_cart_amount'></div>
      <div className="continue_shopping_btn">
        <button className="get-started-button" onClick={(e) => handleContinueShopping(e)}>Continue Shopping</button>
        <br />
        <button className="get-started-button1">Checkout</button>
      </div>
    </div>
  );
};

export default CartItem;

