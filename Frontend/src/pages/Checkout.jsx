import React, { useEffect, useState } from 'react'
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useLocation } from 'react-router-dom';

const CARD_OPTIONS = {
    style: {
        base: {
        iconColor: "#666",
        color: "#333",
        fontSize: "16px",
        '::placeholder': {
            color: "#999"
        }
        },
        invalid: {
        color: "#e5424d",
        }
    }
}

const Payment = () => {
    const { state } = useLocation()
    const { cartItem, totalPrice } = state || {}
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    

    const [clientSecret, setClientSecret] = useState('')
    const [loading, setLoading] = useState(false)
    const total = cartItem.reduce((sum, item) => sum + item.price * item.quantity, 0)

    useEffect(() => {
        axios.post('http://localhost:3001/api/create-payment-intent', { amount: total })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error(err))
    }, [total])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardNumberElement),
        },
        })

        setLoading(false)

        if (result.error) {
        alert(result.error.message)
        } else {
        if (result.paymentIntent.status === 'succeeded') {
  try {
    const user_id = 1; // Replace with actual logged-in user ID if using auth
    await axios.post('http://localhost:3001/api/orders', {
      user_id,
      total_amount: total,
      cart: cartItem,
    });

    navigate('/success');
  } catch (orderError) {
    console.error('Order creation failed:', orderError);
    alert('Payment succeeded but failed to save order!');
  }
}

        }
    }

    return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Complete Your Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <div className="border p-2 rounded">
                    <CardNumberElement options={{CARD_OPTIONS,disableLink: false}} />
                </div>
            </div>

        <div className="flex gap-4">
                <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Expiry</label>
                <div className="border p-2 rounded">
                    <CardExpiryElement options={CARD_OPTIONS} />
                </div>
                </div>

            <div className="flex-1">
                <label className="block text-sm font-medium mb-1">CVC</label>
                <div className="border p-2 rounded">
                    <CardCvcElement options={CARD_OPTIONS} />
                </div>
            </div>
        </div>

        <button
            type="submit"
            disabled={!stripe || !elements || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>
        </form>
    </div>
    )
}

export default Payment
