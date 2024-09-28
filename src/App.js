import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
const { getData } = require("./db/db");
const foods = getData();

const tele = window.Telegram.WebApp;

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    tele.ready();
  });

  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  // const onCheckout = () => {
  //   tele.MainButton.text = "Pay :)";
  //   tele.MainButton.show();
  // };
  const onCheckout = async () => {
    if (!tele.initDataUnsafe || !tele.initDataUnsafe.user) {
      console.error("Telegram user data is not available");
      return;
    }
  
    const chatId = tele.initDataUnsafe.user.id; // Get chat_id from Telegram WebApp
    const totalAmount = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  
    try {
      // Send chat_id and total_amount to your backend for invoice processing
      const response = await fetch('/send_invoice', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId, // Send chat_id to the backend
          total_amount: totalAmount, // Send total amount to the backend
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Invoice sent successfully:', result);
        tele.MainButton.text = "Pay Now";
        tele.MainButton.show();
        tele.MainButton.onClick(() => {
          tele.sendData(JSON.stringify(result));
        });
      } else {
        console.error("Error creating invoice:", result.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  
  

  return (
    <>
      <h1 className="heading">Order Food</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout}/>
      <div className="cards__container">
        {foods.map((food) => {
          return (
            <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
          );
        })}
      </div>
    </>
  );
}

export default App;
