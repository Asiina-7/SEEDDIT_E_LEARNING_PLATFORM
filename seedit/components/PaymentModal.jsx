import React, { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';
import authService from '../services/authService';

const PaymentModal = ({ course, onSuccess, onCancel }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        setErrorMsg('');

        try {
            const user = authService.getStoredUser();
            if (!user) {
                setErrorMsg('Please login to continue');
                setIsProcessing(false);
                return;
            }

            const res = await loadRazorpay();

            if (!res) {
                setErrorMsg('Razorpay SDK failed to load. Are you online?');
                setIsProcessing(false);
                return;
            }

            // 1. Create order on server
            const orderRes = await paymentService.initiatePayment({
                courseId: course.id,
                amount: course.price
            });

            if (!orderRes || !orderRes.orderId) {
                throw new Error("Server failed to create order.");
            }

            // 2. Initialize Razorpay Checkout
            // Provide the test key ONLY here on the frontend part. 
            // In a real app we can load this dynamically, but since we are working with Test keys we can set it.
            const options = {
                key: "rzp_test_SR6U78CegiJKbB", 
                amount: orderRes.amount, 
                currency: orderRes.currency,
                name: "SEEDIT EDU",
                description: `Purchase of ${course.title}`,
                image: "/assets/logo.png",
                order_id: orderRes.orderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: course.id
                        });
                        
                        if (verifyRes.message === 'Payment verified successfully') {
                            onSuccess();
                        } else {
                            setErrorMsg("Payment verification failed on server.");
                        }
                    } catch (err) {
                        setErrorMsg("Error verifying payment: " + err.message);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || "9999999999"
                },
                theme: {
                    color: "#10b981" // Emerald 500
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            // Handle payment modal close by user
            paymentObject.on('payment.failed', function (response) {
                setErrorMsg("Payment Cancelled or Failed: " + response.error.description);
                setIsProcessing(false);
            });

        } catch (error) {
            console.error("Payment Error", error);
            setErrorMsg(error.message || "An error occurred during payment.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full animate-in zoom-in duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Checkout</h2>
                </div>
                <button onClick={onCancel} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                    <i className="fas fa-times text-sm"></i>
                </button>
            </div>

            <div className="p-6 space-y-6">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-emerald-900">{course.title}</span>
                        <span className="text-lg font-black text-emerald-600">₹{course.price}</span>
                    </div>
                </div>

                {errorMsg && (
                    <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm border border-rose-100">
                        {errorMsg}
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full py-4 text-white font-bold rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                        isProcessing ? 'bg-emerald-400 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <i className="fas fa-circle-notch fa-spin"></i> Processing...
                        </>
                    ) : (
                        <>
                           Pay ₹{course.price} Securely
                        </>
                    )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                    <i className="fas fa-shield-alt text-emerald-500"></i>
                    Secured by Razorpay
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
