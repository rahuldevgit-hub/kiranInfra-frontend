'use client'
import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminLogin } from '@/services/admin.service';
import { setToken } from '@/lib/auth';
import { SwalConfirm, SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

import Image from 'next/image';
const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await AdminLogin(data as { email: string; password: string });
      if (response.status === true) {
        setToken('admin_token', response.access_token);
        router.push('/admin/enquiry');
      } else {
        SwalError({ title: "Failed!", message: response?.message || "Check credentials." });
      }
    } catch (error: any) {
      SwalError({ title: "Failed!", message: error || "Login failed! Try again." });

    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return <div className="min-h-screen flex">

    <div className="flex-1 flex items-center justify-center bg-background px-6 py-12 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    name="email"
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    {...register('password')}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5f9ea0] hover:bg-[#4a7d82] rounded-[5px] text-white px-6 py-2 min-w-[110px] flex items-center justify-center disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </>
                ) : (
                  'Login'
                )}
              </Button>

            </form>

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-sm text-[#5f9ea0] hover:text-[#4a7d82] font-medium transition-colors"
              >
                Forgot your password?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Right Side - Brand Section */}
    <div className="flex-1 relative bg-[#5f9ea0] flex items-center justify-center p-8 lg:p-12 min-h-[40vh] lg:min-h-screen">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-cadetblue opacity-90"></div>
      <div className="absolute top-10 lg:top-20 left-10 lg:left-20 w-24 lg:w-32 h-24 lg:h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 lg:bottom-32 right-8 lg:right-16 w-16 lg:w-24 h-16 lg:h-24 bg-white/5 rounded-full blur-lg animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 right-16 lg:right-32 w-12 lg:w-16 h-12 lg:h-16 bg-white/5 rounded-full blur-md animate-pulse" style={{ animationDelay: "2s" }}></div>

      {/* Logo and content */}
      <div className="relative z-10 text-center text-white">
        <div className="mb-6 lg:mb-8">
          <Logo className="justify-center mb-8" />
        </div>

        <h2 className="text-2xl lg:text-4xl font-bold mb-3 lg:mb-4 tracking-tight">
          Welcome to Kiran Infra
        </h2>
        {/* <p className="text-base lg:text-xl text-white/80 font-light max-w-md mx-auto leading-relaxed px-4">
          Your trusted steel partner for innovative solutions and exceptional service quality
        </p> */}

      </div>
    </div>
  </div>;
};
export default LoginScreen;