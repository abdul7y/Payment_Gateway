import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentFormSchema, type PaymentFormData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CardLogos from "@/components/ui/card-logos";

interface PaymentFormProps {
  onSubmitSuccess: () => void;
}

const PaymentForm = ({ onSubmitSuccess }: PaymentFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      nameOnCard: "",
      address: ""
    }
  });

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    form.setValue("expiry", value);
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/payment", data);
      toast({
        title: "Success",
        description: "Your payment information has been submitted successfully.",
      });
      onSubmitSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit payment information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md border-0 rounded-md overflow-hidden">
      <CardContent className="pt-6 px-6 bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">
          Hi there, please fill the details below to proceed
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">First Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="rounded-md border border-gray-300 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="rounded-md border border-gray-300 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center font-medium">
                    <span>Card Number</span>
                    <CardLogos />
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      maxLength={19}
                      className="rounded-md border border-gray-300 focus:border-blue-500"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Expiry</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="MM/YY"
                      maxLength={5}
                      className="rounded-md border border-gray-300 focus:border-blue-500"
                      onChange={(e) => {
                        handleExpiryChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">CVV</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      maxLength={4}
                      className="rounded-md border border-gray-300 focus:border-blue-500"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nameOnCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Name on Card</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      className="rounded-md border border-gray-300 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Address</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      className="rounded-md border border-gray-300 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 mt-4 py-6 rounded-md text-base font-medium" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
