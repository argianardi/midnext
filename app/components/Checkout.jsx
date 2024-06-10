import React, { useState } from 'react';
import { product } from '../libs/product';
import Link from 'next/link';

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [disableCheckoutButton, setDisableCheckoutButton] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const decreaseQuantity = () => {
    setQuantity((prevState) => (quantity > 1 ? prevState - 1 : null));
  };

  const increaseQuantity = () => {
    setQuantity((prevState) => prevState + 1);
  };

  // const checkout = async () => {
  //   setDisableCheckoutButton(true);
  //   const data = {
  //     id: product?.id,
  //     productName: product?.name,
  //     price: product?.price,
  //     quantity: quantity,
  //   };

  //   const response = await fetch('/api/tokenizer', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   });

  //   const requestData = await response?.json();
  //   if (requestData && requestData.token) {
  //     window.snap.pay(requestData.token);
  //     setDisableCheckoutButton(false);
  //   } else {
  //     console.error('Invalid token');
  //     setDisableCheckoutButton(false);
  //   }
  // };

  const checkout = async () => {
    setDisableCheckoutButton(true);
    const data = {
      id: product?.id,
      productName: product?.name,
      price: product?.price,
      quantity: quantity,
    };

    fetch('/api/tokenizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data?.token) {
          // Pastikan Anda telah menginisialisasi Snap API dengan benar sebelum memanggil fungsi snap.pay
          if (window.snap) {
            window.snap.pay(data?.token);
            setDisableCheckoutButton(false);
          } else {
            console.error('Snap API not initialized');
            setDisableCheckoutButton(false);
          }
        } else {
          console.error('Invalid token');
          setDisableCheckoutButton(false);
        }
      })
      .catch((error) => {
        console.error('Error during checkout error disini', error);
        setDisableCheckoutButton(false);
      });
  };

  const generatePaymentLink = async () => {
    const serverKey = process.env.NEXT_PUBLIC_SERVER_KEY;
    const encodedSecret = Buffer.from(serverKey).toString('base64');
    const basicAuth = `Basic ${encodedSecret}`;
    let data = {
      item_details: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
        },
      ],
      transaction_details: {
        order_id: product.id,
        gross_amount: product.price * quantity,
      },
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/v1/payment-links`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: basicAuth,
        },
        body: JSON.stringify(data),
      }
    );

    const paymentLink = await response.json();
    setPaymentUrl(paymentLink?.payment_url);
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

          <p className="w-16 h-10 text-center text-black border-transparent">
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
          className={`p-4 text-sm font-medium transition  rounded hover:scale-105 ${
            disableCheckoutButton ? 'bg-black' : 'bg-indigo-500'
          }`}
          disabled={disableCheckoutButton}
          onClick={checkout}
        >
          Checkout
        </button>
      </div>
      <button
        className={`py-4 text-sm font-medium text-indigo-500 transition hover:scale-105 `}
        onClick={generatePaymentLink}
      >
        Create Payment Link
      </button>
      <div className="italic text-black underline">
        <Link href={paymentUrl} target="_blank">
          {paymentUrl}
        </Link>
      </div>
    </>
  );
};

export default Checkout;
