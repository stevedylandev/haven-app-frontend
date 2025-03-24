import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/useToast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Dialog, DialogContent } from "../ui/dialog";
import { z } from "zod";
import { registerUser } from "@/utils/api";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { cn } from "@/lib/utils";
import { RoleType, UserRegistration } from "@/types";

const registrationSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roleType: z.enum(["HUMAN_LABELER", "AI_LABLER", "ADMIN"] as const),
  ethereumAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms"),
});

type RegistrationFormData = Omit<
  z.infer<typeof registrationSchema>,
  "roleType"
> & {
  roleType: RoleType;
  acceptedTerms: boolean;
};

interface RegistrationFormProps {
  isDialog?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: UserRegistration) => Promise<void>;
  defaultRole?: RoleType;
}

const RegistrationForm = ({
  isDialog = false,
  isOpen = false,
  onClose,
  onSubmit,
  defaultRole = "HUMAN_LABELER",
}: RegistrationFormProps) => {
  const { success, error } = useToast();
  const { isConnected, publicKey, login } = useWalletConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationFormData, string>>
  >({});

  const [formData, setFormData] = useState<RegistrationFormData>({
    userName: "",
    email: "",
    password: "",
    roleType: defaultRole,
    ethereumAddress: "",
    acceptedTerms: false,
  });

  // Update Ethereum address when wallet is connected
  useEffect(() => {
    if (isConnected && publicKey) {
      setFormData((prev) => ({
        ...prev,
        ethereumAddress: publicKey,
      }));
    }
  }, [isConnected, publicKey]);

  const handleChange = (
    field: keyof RegistrationFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    try {
      registrationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: typeof errors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof RegistrationFormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const registrationData: UserRegistration = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        roleType: formData.roleType,
        ethereumAddress: formData.ethereumAddress,
      };

      if (onSubmit) {
        await onSubmit(registrationData);
      } else {
        await registerUser(registrationData);
      }

      success("Registration completed successfully!");

      if (onClose) {
        onClose();
      }

      // Reset form
      setFormData({
        userName: "",
        email: "",
        password: "",
        roleType: defaultRole,
        ethereumAddress: "",
        acceptedTerms: false,
      });
    } catch (err) {
      error(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = useMemo(
    () => (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Registration</h2>
          <Badge variant="secondary" className="text-sm">
            {defaultRole === "HUMAN_LABELER" ? "Human Labeler" : "AI Labeler"}
          </Badge>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userName">Username</Label>
          <Input
            id="userName"
            type="text"
            value={formData.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
            placeholder="Enter username"
            className={cn(errors.userName && "border-red-500")}
          />
          {errors.userName && (
            <p className="text-sm text-red-500">{errors.userName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email"
            className={cn(errors.email && "border-red-500")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Enter password"
            className={cn(errors.password && "border-red-500")}
          />
          <PasswordStrengthMeter password={formData.password} />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ethereumAddress">Ethereum Address</Label>
          {isConnected ? (
            <Input
              id="ethereumAddress"
              type="text"
              value={formData.ethereumAddress}
              disabled
              className="bg-gray-50"
            />
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={login}
            >
              Connect Wallet
            </Button>
          )}
          {errors.ethereumAddress && (
            <p className="text-sm text-red-500">{errors.ethereumAddress}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.acceptedTerms}
            onCheckedChange={(checked: boolean) =>
              handleChange("acceptedTerms", checked)
            }
          />
          <Label htmlFor="terms" className="text-sm">
            I accept the{" "}
            <a
              href="/terms"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms of service
            </a>
          </Label>
        </div>
        {errors.acceptedTerms && (
          <p className="text-sm text-red-500">{errors.acceptedTerms}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !isConnected}
        >
          {isLoading ? "Registering..." : "Complete Registration"}
        </Button>

        {!isConnected && (
          <p className="text-sm text-center text-gray-500">
            Please connect your wallet to complete registration
          </p>
        )}
      </form>
    ),
    [
      formData,
      errors,
      isLoading,
      isConnected,
      defaultRole,
      handleSubmit,
      handleChange,
      login,
    ]
  );

  if (isDialog) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>{formContent}</DialogContent>
      </Dialog>
    );
  }

  return <Card className="w-full max-w-md mx-auto p-6">{formContent}</Card>;
};

export default RegistrationForm;
