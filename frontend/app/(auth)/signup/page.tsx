"use client";

import { Logo } from "@/components/logo";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import DottedMap from "dotted-map";
import React from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button";
import { PasswordInput } from "@/components/ui/password-input";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  rememberMe: z.boolean().optional().default(false)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      console.log(values);
      // Add your signup logic here
    } catch (error) {
      console.error(error);
      form.setError("root", {
        type: "manual",
        message: "Something went wrong. Please try again."
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Marketing Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-12 flex-col items-start">
        <div className="mb-8">
          <Logo />
        </div>
        
        <div className="py-10">
          <h1 className="text-4xl leading-tight font-semibold">
            May your{" "}
            <span className="text-orange-500">Network</span>
            <br />
            From{" "}
            <span className="text-orange-500">Email</span>
            {" "}and{" "}
            <span className="text-orange-500">Calendar</span>
          </h1>
          
          <p className="mt-6 text-gray-600 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porttitor massa vel ult  varius risus scelerisque, accumsan felis vel, sodales erat. Donec tristi
          </p>
          <div className="h-[400px] py-10 relative">
            <MapView />
          </div>
        </div>
      </div>

      {/* Right Signup Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Logo (only show on mobile) */}
        <div className="lg:hidden mb-8">
          <Logo />
        </div>

        {/* Signup Container */}
        <div className="w-full max-w-md space-y-6">
          {/* Welcome Text */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Create your account</h1>
          </div>

          {/* Signup Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Create password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sign Up Button */}
              <Button
                type="submit"
                as="button"
                className="w-full bg-[linear-gradient(195deg,_#FFA756_17.78%,_#EE602C_75.71%)] hover:opacity-90 transition-opacity"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>

              <hr className="border-gray-200" />

              {/* Google Sign Up */}
              <Button
                type="button"
                as="button"
                className="w-full gap-2 rounded-[6px] bg-[linear-gradient(181deg,_#5E5E5E_18.12%,_#000_99.57%)] hover:opacity-90 transition-opacity"
              >
                <GoogleIcon />
                <span>Or sign up with Google</span>
              </Button>
            </form>
          </Form>

          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-600">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const MapView = () => {
  const svgMap = useMemo(() => {
    const map = new DottedMap({
      height: 40,
      grid: "diagonal",
    });

    return map.getSVG({
      radius: 0.15,
      color: "#000000",
      shape: "circle",
    });
  }, []);

  const people = [
    { 
      name: "Kishore", 
      x: "10%", 
      y: "4%",
      photo: "/images/kishore_gunnam.jpg"
    },
    { 
      name: "John", 
      x: "65%", 
      y: "35%",
      photo: "/images/person3.png"
    },
    { 
      name: "Manu", 
      x: "50%", 
      y: "20%",
      photo: "/images/manu_arora.jpg"
    },
    { 
      name: "James", 
      x: "80%", 
      y: "25%",
      photo: "/images/person4.png"
    },
    { 
      name: "Emily", 
      x: "30%", 
      y: "45%",
      photo: "/images/person5.png"
    }
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-300">
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full object-cover absolute top-0 -right-2 -mt-14 
            [mask-image:linear-gradient(to_bottom,transparent,white_15%,white_85%,transparent)]
            pointer-events-none select-none opacity-50"
          alt="Interactive world map visualization"
          height={695}
          width={556}
          priority={true}
          draggable={false}
        />
      </div>

      <div className="absolute inset-0">
        {people.map((person, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: person.x,
              top: person.y
            }}
          >
            <Image
              src={person.photo}
              alt={person.name}
              width={40}
              height={40}
              className="rounded-full border-2 border-white shadow-lg"
            />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white rounded-lg border-[1.5px] border-white/40 bg-[#103685] mix-blend-luminosity shadow-[0px_10px_15px_-6px_#000,0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] backdrop-blur-[6px]">
              {person.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M19.8684 10.2281C19.8693 9.54663 19.8113 8.8664 19.695 8.19482H10.1992V12.046H15.638C15.5267 12.6611 15.2911 13.2475 14.9455 13.7697C14.5999 14.292 14.1513 14.7393 13.6269 15.0848V17.5846H16.8728C18.7734 15.8444 19.8684 13.271 19.8684 10.2281Z" fill="#4285F4"/>
        <path d="M10.1997 19.9998C12.9169 19.9998 15.2049 19.1137 16.8733 17.586L13.6274 15.0861C12.7239 15.6944 11.5604 16.0416 10.1997 16.0416C7.57328 16.0416 5.34408 14.2834 4.54693 11.9141H1.20312V14.4903C2.0412 16.1465 3.32629 17.5387 4.91494 18.5116C6.50358 19.4844 8.33324 19.9997 10.1997 19.9998Z" fill="#34A853"/>
        <path d="M4.54686 11.9141C4.12543 10.6726 4.12543 9.32806 4.54686 8.08651V5.51025H1.20305C0.498032 6.90345 0.130859 8.44108 0.130859 10.0003C0.130859 11.5595 0.498032 13.0972 1.20305 14.4904L4.54686 11.9141Z" fill="#FBBC04"/>
        <path d="M10.1997 3.95879C11.6356 3.93549 13.0231 4.47429 14.0623 5.45872L16.9362 2.60469C15.1139 0.904883 12.6996 -0.0283412 10.1997 0.000656061C8.33324 0.000740536 6.50358 0.515984 4.91494 1.48886C3.32629 2.46174 2.0412 3.85397 1.20312 5.5101L4.54693 8.08636C5.34408 5.71704 7.57328 3.95879 10.1997 3.95879Z" fill="#EA4335"/>
    </svg>
)