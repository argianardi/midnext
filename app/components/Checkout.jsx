import React, { useState } from 'react';
import { product } from '../libs/product';

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    setQuantity((prevState) => (quantity > 1 ? prevState - 1 : null));
  };

  const increaseQuantity = () => {
    setQuantity((prevState) => prevState + 1);
  };

  const checkout = async () => {
    const data = {
      id: product?.id,
      productName: product?.name,
      price: product?.price,
      quantity: quantity,
    };

    const response = await fetch('/api/tokenizer', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const requestData = await response?.json();
    window.snap.pay(requestData?.token);
  };

  const generatePaymentLink = async () => {
    alert('Checkout Payment Link! 🔥');
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex sm:gap-4">
          <button
            className="transition-all hover:opacity-75"
            onClick={decreaseQuantity}
          >
            ➖
          </button>

          <p
            // type="number"
            // id="quantity"
            // value={quantity}
            className="w-16 h-10 text-center text-black border-transparent"
            // onChange={quantity}
          >
            {quantity}
          </p>
          <button
            className="transition-all hover:opacity-75"
            onClick={increaseQuantity}
          >
            ➕
          </button>
        </div>
        <button
          className="p-4 text-sm font-medium transition bg-indigo-500 rounded hover:scale-105"
          onClick={checkout}
        >
          Checkout
        </button>
      </div>
      <button
        className="py-4 text-sm font-medium text-indigo-500 transition hover:scale-105"
        onClick={generatePaymentLink}
      >
        Create Payment Link
      </button>
    </>
  );
};

export default Checkout;
