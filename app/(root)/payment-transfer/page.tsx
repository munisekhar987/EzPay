'use client';

import React, { useState, useEffect } from 'react';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { transferPayment } from '@/lib/actions/user.actions'; // The method we'll create in actions

interface User {
  email: string;
  $id: string;
  // Add other properties if needed
}

const Transfer = () => {
  const [transaction_amount, setAmount] = useState('');
  const [receiver_email, setReceiverEmail] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState<User | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Track payment success
  const [showConfirmation, setShowConfirmation] = useState(false); // Track the prompt to make a new transfer

  // Fetch the logged-in user inside useEffect with async function
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await getLoggedInUser();
        setLoggedIn(user);
      } catch (err) {
        setError('Failed to fetch logged-in user.');
        console.error(err);
      }
    };

    fetchLoggedInUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!transaction_amount || !receiver_email) {
      setError('Both fields are required.');
      return;
    }

    // Check if loggedIn is not null before accessing its properties
    if (!loggedIn) {
      setError('You must be logged in to make a payment.');
      return;
    }

    // Reset error message before initiating the transfer
    setError('');

    // Call the transferPayment method
    try {
      const result = await transferPayment({
        transaction_amount,
        receiver_email,
        sender_email: loggedIn.email, // Now `email` is recognized as a property of `loggedIn`
      });

      console.log("In Page Transfesasasr",result)

      if (result.transaction_id) {
        setPaymentSuccess(true); // Set success state
        setShowConfirmation(true); // Show the confirmation message
      } else {
        setError('There was an error processing the payment.');
      }
    } catch (err) {
      setError('Failed to submit the payment.');
      console.error(err);
    }
  };

  const handleNewTransfer = () => {
    // Reset fields for a new transfer
    setAmount('');
    setReceiverEmail('');
    setError('');
    setPaymentSuccess(false);
    setShowConfirmation(false);
  };

  return (
    <section className="payment-transfer">
      <header className="flex flex-col gap-5 md:gap-8">
        <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Payment Transfer</h1>
        <p className="text-16 font-normal text-gray-600">
          Please fill in the details for the transfer.
        </p>
      </header>
  
      {paymentSuccess && showConfirmation ? (
        <div className="success-message text-center">
          <p className="text-green-500 text-xl font-semibold">Payment transfer successful!</p>
          <p className="text-gray-600">Would you like to make a new transfer?</p>
          <button onClick={handleNewTransfer} className="form-btn text-white bg-blue-500">
            Yes, make a new transfer
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="text-14 font-semibold text-gray-700">Amount</label>
              <input
                type="number"
                id="amount"
                value={transaction_amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
  
            <div className="flex flex-col gap-2">
              <label htmlFor="receiverEmail" className="text-14 font-semibold text-gray-700">Receiver Email</label>
              <input
                type="email"
                id="receiverEmail"
                value={receiver_email}
                onChange={(e) => setReceiverEmail(e.target.value)}
                required
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
  
            {error && <p className="error text-red-500 text-sm">{error}</p>}
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="form-btn"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default Transfer;
