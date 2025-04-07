"use client";

import { useRouter } from "next/navigation"; // Import useRouter
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createUser, resetUserState } from "@/store/slices/userSlice";
import { CreateUserPayload } from "@/types/userTypes";

export default function Signup() {
  const router = useRouter(); // Initialize useRouter
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    form: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (success) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        form: ""
      });
      router.push("/dashboard");

      const timer = setTimeout(() => {
        dispatch(resetUserState());
      }, 3000);

      // Ensure cleanup of the timer
      return () => {
        clearTimeout(timer);
      };
    }
  }, [success, dispatch]);

  // Update form error when API returns an error
  useEffect(() => {
    if (error) {
      setErrors(prev => ({
        ...prev,
        form: error
      }));
      setIsSubmitting(false);
    }
  }, [error]);

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      form: ""
    };

    // Name validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      const userData: CreateUserPayload = {
        username,
        email,
        password,
      };
      dispatch(createUser(userData));
    } else {
      setIsSubmitting(false);
    }
  };

  // Handle blur events for real-time validation
  const handleBlur = (field: string) => {
    validateField(field);
  };

  // Validate a single field
  const validateField = (field: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'username':
        if (!username.trim()) {
          newErrors.username = "Username is required";
        } else if (username.trim().length < 2) {
          newErrors.username = "Username must be at least 2 characters";
        } else {
          newErrors.username = "";
        }
        break;

      case 'email':
        if (!email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          newErrors.email = "";
        }
        break;

      case 'password':
        if (!password) {
          newErrors.password = "Password is required";
        } else if (password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
          newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        } else {
          newErrors.password = "";
        }

        // Also validate confirm password when password changes
        if (confirmPassword && password !== confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else if (confirmPassword) {
          newErrors.confirmPassword = "";
        }
        break;

      case 'confirmPassword':
        if (password !== confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          newErrors.confirmPassword = "";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center">
          <Link2 className="h-12 w-12 text-blue-600" />
          <span className="ml-2 text-3xl font-bold text-gray-900">Bitly</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              Create a free account to start shortening URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                Account created successfully!.
              </div>
            )}

            {errors.form && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="flex justify-between">
                  <span>Username</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => handleBlur('username')}
                  className={`mt-1 ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.username && <span className="text-sm text-red-500">{errors.username}</span>}
              </div>

              <div>
                <Label htmlFor="email" className="flex justify-between">
                  <span>Email address</span>

                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`mt-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
              </div>

              <div>
                <Label htmlFor="password" className="flex justify-between">
                  <span>Password</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`mt-1 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="flex justify-between">
                  <span>Confirm Password</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`mt-1 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword}</span>}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loading}
              >
                {(isSubmitting || loading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                By signing up, you agree to our{" "}
                <Link href="#" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </p>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in to your account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}