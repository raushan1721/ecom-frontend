import { useState, useEffect } from "react";
import { userRequest } from "../requestmethod";

function UserAPI() {
  const [isLogged, setIsLogged] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const token=window.localStorage.getItem('accessToken');
  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await userRequest("/user/infor");
          setIsLogged(true);
          setCart(res.data.cart);
        } catch (err) {
          alert(err.response.data.msg);
        }
      };

      getUser();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged) return alert("Please login to continue buying");
    const check = cart.every((item) => {
      return item.id !== product.id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await userRequest.patch("/user/addcart", {
        cart: [...cart, { ...product, quantity: 1 }],
      });
    } else {
      alert("This product has been added to cart.");
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
  };
}

export default UserAPI;
