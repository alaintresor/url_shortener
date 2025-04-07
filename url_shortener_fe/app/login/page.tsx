"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authenticateUser, resetUserState } from "@/store/slices/userSlice";
import { LoginUserPayload } from "@/types/userTypes";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.user);

  // Check for lockout status on component mount
  useEffect(() => {
    const storedLockoutEnd = localStorage.getItem('loginLockoutEnd');
    if (storedLockoutEnd) {
      const lockoutEnd = new Date(storedLockoutEnd);
      if (lockoutEnd > new Date()) {
        setIsLocked(true);
        setLockoutEndTime(lockoutEnd);
      } else {
        localStorage.removeItem('loginLockoutEnd');
      }
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (isLocked && lockoutEndTime) {
      const timer = setInterval(() => {
        if (new Date() >= lockoutEndTime) {
          setIsLocked(false);
          setLockoutEndTime(null);
          localStorage.removeItem('loginLockoutEnd');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutEndTime]);

  useEffect(() => {
    if (success) {
      setEmail("");
      setPassword("");
      setErrors({
        email: "",
        password: "",
        form: ""
      });
      setLoginAttempts(0);
      router.push("/dashboard");

      const timer = setTimeout(() => {
        dispatch(resetUserState());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch, router]);

  useEffect(() => {
    if (error) {
      setErrors(prev => ({
        ...prev,
        form: error
      }));
      setIsSubmitting(false);
      
      // Increment login attempts and check for lockout
      setLoginAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          const lockoutEnd = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
          setIsLocked(true);
          setLockoutEndTime(lockoutEnd);
          localStorage.setItem('loginLockoutEnd', lockoutEnd.toISOString());
        }
        return newAttempts;
      });
    }
  }, [error]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      form: ""
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setErrors(prev => ({
        ...prev,
        form: `Too many login attempts. Please try again after ${Math.ceil((lockoutEndTime!.getTime() - Date.now()) / 60000)} minutes.`
      }));
      return;
    }

    setIsSubmitting(true);

    if (validateForm()) {
      const userData: LoginUserPayload = {
        email,
        password,
        rememberMe
      };
      dispatch(authenticateUser(userData));
    } else {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: string) => {
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };

    switch (field) {
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
        } else {
          newErrors.password = "";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const getRemainingLockoutTime = () => {
    if (!lockoutEndTime) return '';
    const remainingMinutes = Math.ceil((lockoutEndTime.getTime() - Date.now()) / 60000);
    return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center">
          <Link2 className="h-12 w-12 text-blue-600" />
          <span className="ml-2 text-3xl font-bold text-gray-900">Bitly</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                Login successful! Redirecting to your dashboard...
              </div>
            )}

            {errors.form && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`mt-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLocked}
                />
                {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`mt-1 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loading || isLocked}
              >
                {(isSubmitting || loading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : isLocked ? (
                  `Try again in ${getRemainingLockoutTime()}`
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don&apos;t have an account?
                  </span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}