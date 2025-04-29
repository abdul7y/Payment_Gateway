import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const SuccessMessage = () => {
  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6 pb-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-6">
          Thanks for submitting the details. We will get back to you shortly!
        </h2>
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </CardContent>
    </Card>
  );
};

export default SuccessMessage;
