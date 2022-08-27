import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { userRequest } from "../../../requestmethod";
import StripeCheckout from "react-stripe-checkout";
import Loading from "../utils/loading/Loading";

const KEY = process.env.REACT_APP_STRIPE;
function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [total, setTotal] = useState(0);
  const [stripeToken, setStripeToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const onToken = (token) => {
    setStripeToken(token);
  };
  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      setTotal(total.toFixed(2));
    };

    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await userRequest.patch("/user/addcart", { cart });
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item.id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item.id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      cart.forEach((item, index) => {
        if (item.id === id) {
          cart.splice(index, 1);
        }
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };
  useEffect(() => {
    const makeRequest = async () => {
      try {
        setLoading(true);
        const res = await userRequest.post("/makepayment", {
          tokenId: stripeToken.id,
          amount: 500,
        });

        if (res.status === 200) {
          const payment = {
            paymentID: res.data.id,
            address: res.data.billing_details.address,
          };
          tranSuccess(payment);
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    stripeToken && makeRequest();
  }, [stripeToken, cart.total]);

  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;
    await userRequest.post("/payment", { cart, paymentID, address });
    setCart([]);
    addToCart([]);
    alert("You have successfully placed an order.");
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart Empty</h2>
    );

  return loading ? (
    <Loading />
  ) : (
    <div className="wrapper">
      {cart.map((product) => (
        <div className="detail cart" key={product.id}>
          <img src={product.image} alt="" />

          <div className="box-detail">
            <h2>{product.title}</h2>

            <h3>$ {(product.price * product.quantity).toFixed(2)}</h3>
            <p>{product.description}</p>
            <div className="amount">
              <button onClick={() => decrement(product.id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product.id)}> + </button>
            </div>

            <div className="delete" onClick={() => removeProduct(product.id)}>
              X
            </div>
          </div>
        </div>
      ))}
      <div className="total">
        <h3>Total: $ {total}</h3>
        <StripeCheckout
          name="ECOM"
          image="https://cdn.pixabay.com/photo/2013/07/12/14/53/cart-148964__340.png"
          billingAddress
          shippingAddress
          description={`Your total is $${total}`}
          amount={total * 100}
          token={onToken}
          stripeKey={KEY}
        >
          <button className="checkout_button">CHECKOUT NOW</button>
        </StripeCheckout>
      </div>
    </div>
  );
}

export default Cart;
