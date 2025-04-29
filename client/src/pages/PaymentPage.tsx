import { useState } from "react";
import PaymentForm from "@/components/PaymentForm";
import SuccessMessage from "@/components/SuccessMessage";
import { Card, CardContent } from "@/components/ui/card";

const PaymentPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 p-4 text-white shadow-md">
        <div className="container mx-auto">
          <h1 className="text-xl font-semibold">Payment Information Form</h1>
          <p className="text-sm opacity-80">Preview</p>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-lg mx-auto">
          {!formSubmitted ? (
            <PaymentForm onSubmitSuccess={() => setFormSubmitted(true)} />
          ) : (
            <SuccessMessage />
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
