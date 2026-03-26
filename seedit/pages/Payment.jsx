import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import paymentService from '../services/paymentService';
import confetti from 'canvas-confetti';

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState('method');

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const data = await courseService.getCourseById(courseId);
        if (data) setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (course && step === 'method') {
      handlePaymentSubmit();
    }
  }, [course, step]);



  const handlePaymentSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!course) return;

    setStep('processing');

    try {
      // 1. Initiate order from backend
      const orderData = await paymentService.initiatePayment({
        courseId: course.id,
        amount: course.price,
      });

      if (!orderData.orderId) {
         throw new Error("Failed to create Razorpay order");
      }

      // 2. Open Razorpay Checkout
      const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!rzpKey) {
        console.warn("Razorpay Key ID is not configured in the environment.");
        alert("Payment gateway configuration is missing. Please contact support.");
        setStep('method');
        return;
      }

      const options = {
          key: rzpKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Seedit Academy",
          description: `Enrollment for ${course.title}`,
          image: "https://via.placeholder.com/150", 
          order_id: orderData.orderId,
          handler: async function (response) {
              setStep('processing');
              try {
                  // 3. Verify payment signature on backend
                  await paymentService.verifyPayment({
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_signature: response.razorpay_signature,
                      courseId: course.id
                  });

                  setStep('success');
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                  });

                  setTimeout(() => {
                    navigate(`/learn/${course.id}`);
                  }, 3000);
              } catch (verifyError) {
                  console.error("Verification failed:", verifyError);
                  alert("Payment verification failed. Please contact support.");
                  setStep('method');
              }
          },
          prefill: {
              name: "Student Name", // In a real app, autofill with user's name
              email: "student@example.com", // In a real app, autofill with user's email
          },
          theme: {
              color: "#10b981", // Emerald 500
          },
          modal: {
            ondismiss: function() {
                setStep('failed');
            }
          }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      setStep('failed');
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading payment gateway...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-[1fr_380px] bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Side: Order Summary */}
        <div className="p-8 md:p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <i className="fas fa-seedling text-[400px] -translate-x-1/2 -translate-y-1/2"></i>
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <i className="fas fa-seedling text-xl"></i>
              </div>
              <span className="text-xl font-black uppercase tracking-widest text-emerald-400">Seedit Academy</span>
            </div>

            <div className="space-y-6 flex-1">
              <p className="text-xs font-black uppercase tracking-[4px] text-slate-500">Order Summary</p>
              <div>
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <span><i className="far fa-play-circle mr-2"></i>Full Course Access</span>
                  <span><i className="far fa-certificate mr-2"></i>Verified Certificate</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                  <span className="font-bold">₹{course.price}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Tax (GST 0%)</span>
                  <span className="font-bold">₹0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total Amount</span>
                  <span className="text-3xl font-black text-emerald-400">₹{course.price}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
               <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                 <i className="fas fa-shield-alt text-xl"></i>
               </div>
               <div>
                  <p className="text-xs font-bold text-white">100% Secure Payment</p>
                  <p className="text-[10px] text-slate-400">Your transaction details are encrypted</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="p-8 md:p-12 flex flex-col">
          {step === 'method' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
               <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
               </div>
               <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">Initiating Payment</h3>
                  <p className="text-sm text-slate-500 mt-2">Connecting to secure gateway...</p>
               </div>
            </div>
          )}

          {step === 'failed' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
               <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                  <i className="fas fa-exclamation-triangle text-3xl"></i>
               </div>
               <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">Payment Interrupted</h3>
                  <p className="text-sm text-slate-500 mt-2">We couldn't complete the secure redirect.</p>
               </div>
               <div className="flex flex-col w-full gap-3">
                 <button 
                   onClick={() => handlePaymentSubmit()}
                   className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all"
                 >
                   Try Again
                 </button>
                 <button 
                   onClick={() => navigate(-1)}
                   className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                 >
                   Return to Course
                 </button>
               </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
               <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
               </div>
               <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">Verifying Payment</h3>
                  <p className="text-sm text-slate-500 mt-2">Checking transaction status with bank...</p>
               </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-scale-in">
               <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center text-white text-5xl shadow-2xl shadow-emerald-500/30 rotate-12">
                  <i className="fas fa-check"></i>
               </div>
               <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-900">Success!</h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed px-8">Your enrollment is confirmed. We're redirecting you to your course classroom...</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
