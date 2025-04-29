import { z } from "zod";
import { paymentFormSchema } from "@shared/schema";

export const isValidCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and non-numeric characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Check if length is valid (13-19 digits per most card standards)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  // Luhn algorithm for validating card numbers
  let sum = 0;
  let double = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    // Double every second digit
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    double = !double;
  }
  
  // If sum is multiple of 10, card number is valid
  return sum % 10 === 0;
};

export const formatCardNumber = (value: string): string => {
  // Remove non-numeric characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format with spaces every 4 digits
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  
  return formatted;
};

export const formatExpiryDate = (value: string): string => {
  // Remove non-numeric characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as MM/YY
  if (cleaned.length > 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  
  return cleaned;
};

export const validateExpiryDate = (value: string): boolean => {
  // Check format
  if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
    return false;
  }
  
  const [month, year] = value.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
  
  const expiryMonth = parseInt(month, 10);
  const expiryYear = parseInt(year, 10);
  
  // Check if expiry date is in the past
  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    return false;
  }
  
  return true;
};
