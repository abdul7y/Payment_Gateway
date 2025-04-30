import type { PaymentFormData } from '@shared/schema';

// Determine the API URL based on environment
const API_URL = import.meta.env.DEV 
  ? '' // Local development
  : ''; // Same domain in production (Vercel will handle routing)

export async function submitPaymentForm(data: PaymentFormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting payment form:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}