import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { MdDeleteForever } from "react-icons/md";
import { MdClear } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to place an order.');
      return;
    }

    try {
      const cleanedItems = cartItems.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image?.startsWith('data:image') ? '' : item.image
      }));

      const response = await axios.post(
        'http://localhost:5000/api/orders/place',
        {
          items: cleanedItems,
          total: subtotal,
          gst,
          grandTotal
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        setOrderSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>
      <button className="back-btn" onClick={() => navigate('/products')}>
        <TiArrowBack /> Back to Products
      </button>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-card">
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="cart-details">
                  <h4>{item.name}</h4>
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button className="remove-cart-btn" onClick={() => removeFromCart(item._id)}>
                   <MdDeleteForever /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-section">
            <h3>Checkout Summary</h3>
            <p className="checkout-summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </p>
            <p className="checkout-summary-line">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </p>
            <div className="checkout-total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
            <button className="clear-cart" onClick={clearCart}>
             <MdClear /> Clear Cart
            </button>
          </div>

          {orderSuccess && (
            <div className="order-success">
            Order placed successfully! Redirecting to Orders...
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
