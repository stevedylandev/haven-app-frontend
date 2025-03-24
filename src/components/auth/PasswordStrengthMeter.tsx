import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthMeterProps {
  password: string;
}

const calculateStrength = (password: string): number => {
  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 20;

  // Contains number
  if (/\d/.test(password)) strength += 20;

  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 20;

  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 20;

  // Contains special char
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;

  return strength;
};

const getStrengthLabel = (strength: number): string => {
  if (strength <= 20) return "Very Weak";
  if (strength <= 40) return "Weak";
  if (strength <= 60) return "Medium";
  if (strength <= 80) return "Strong";
  return "Very Strong";
};

const getStrengthColor = (strength: number): string => {
  if (strength <= 20) return "text-destructive";
  if (strength <= 40) return "text-orange-500";
  if (strength <= 60) return "text-yellow-500";
  if (strength <= 80) return "text-lime-500";
  return "text-green-500";
};

export const PasswordStrengthMeter = ({
  password,
}: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  return (
    <div className="space-y-2">
      <Progress value={strength} className="h-2" />
      <p className={`text-xs ${getStrengthColor(strength)}`}>
        Password Strength: {getStrengthLabel(strength)}
      </p>
    </div>
  );
};
