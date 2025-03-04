import { useState } from "react";
import { UserRegistration } from "../../types";
import { registerUser } from "../../utils/api";
import { useToast } from "../../hooks/useToast";

const RegistrationForm = () => {
  const { error: showError, success } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserRegistration>({
    userName: "",
    email: "",
    password: "",
    roleType: "HUMAN_LABELER",
    ethereumAddress: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.userName ||
      !formData.email ||
      !formData.password ||
      !formData.ethereumAddress
    ) {
      showError("All fields are required");
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 8) {
      showError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerUser(formData);
      success("Registration successful!");
      // Reset form
      setFormData({
        userName: "",
        email: "",
        password: "",
        roleType: "AI_LABLER",
        ethereumAddress: "",
      });
    } catch (error) {
      showError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label
            htmlFor="roleType"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="roleType"
            name="roleType"
            value={formData.roleType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="AI_LABLER">AI Labeler</option>
            <option value="HUMAN_LABELER">Human Labeler</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="ethereumAddress"
            className="block text-sm font-medium text-gray-700"
          >
            Ethereum Address
          </label>
          <input
            type="text"
            id="ethereumAddress"
            name="ethereumAddress"
            value={formData.ethereumAddress}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter Ethereum address"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
