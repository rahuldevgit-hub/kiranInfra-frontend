"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { logout } from "@/lib/auth";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { updateUser } from "@/services/userService";
import { AdminProfile } from "@/services/admin.service";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { userSchema } from "@/schemas/userSchema";
import { User } from "@/types/user";
import Loader from '@/components/ui/loader'

type FormData = z.infer<typeof userSchema>;

export default function EditUser() {
    const router = useRouter();
      let id: string | null = null;
      if (typeof window !== "undefined") {
        // only access useSearchParams on client side
        const params = useSearchParams();
        id = params.get("id");
      }

    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(userSchema) as any,
        mode: "onSubmit",
        reValidateMode: "onChange",
        shouldFocusError: true,
    });

    const handleBack = () => {
        router.back();
    };
    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            if (!id) {
                SwalError({ title: "Error", message: "OOPS Session expired. Login again." });
                logout();
            };
            try {
                const res = await AdminProfile();
                const data: User = res.data.result;
                reset({
                    name: data.name || "",
                    email: data.email || "",
                    mobile: data.mobile ? String(data.mobile) : "",
                    phone: data.phone ? String(data.phone) : "",
                    fburl: data.fburl || "",
                    twitterurl: data.twitterurl || "",
                    yturl: data.yturl || "",
                    linkedinurl: data.linkedinurl || "",
                    googleplusurl: data.googleplusurl || "",
                    address: data.address || "",
                });
            } catch (error) {
                SwalError({ title: "Error", message: "Failed to load user data." });
                handleBack();
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, reset]);


    const onSubmit = async (data: any) => {
        try {
            const payload = {
                name: data.name,
                email: data.email,
                mobile: data.mobile.trim(),
                phone: data.phone.trim(),
                fburl: data.fburl.trim(),
                twitterurl: data.twitterurl.trim(),
                yturl: data.yturl.trim(),
                // linkedinurl: data.linkedinurl.trim(),
                googleplusurl: data.googleplusurl.trim(),
                address: data.address,
            }
            const response = await updateUser(id, payload);
            if (response?.status === true) {
                SwalSuccess("User has been updated successfully.");
                handleBack();
            } else {
                SwalError({
                    title: "Failed!",
                    message: response?.message || "Failed to update user.",
                });
            }
        } catch (error) {
            let message = "Something went wrong.";
            if (typeof error === "object" && error !== null) {
                if (
                    "response" in error &&
                    error.response &&
                    typeof error.response === "object"
                ) {
                    message = error.response.data?.message || message;
                } else if ("message" in error && typeof error.message === "string") {
                    message = error.message;
                }
            }
            SwalError({
                title: "Failed!",
                message,
            });
        }
    };

    if (!id) return <p className="text-red-600">Invalid User Id !</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-12">
                        <h1 className="text-xl font-medium text-gray-800 ml-2">Edit User</h1>
                    </div>
                </div>
            </header>
            <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {loading ? (<Loader />) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 p-6 bg-white rounded-lg shadow-md"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                            {/* Name */}
                            <div className="flex flex-col">
                                <Label htmlFor="name" className="mb-1 font-medium">
                                    Name <span className="text-red-600">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    {...register("name")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <Label htmlFor="email" className="mb-1 font-medium">
                                    Email <span className="text-red-600">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    disabled
                                    {...register("email")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Mobile */}
                            <div className="flex flex-col">
                                <Label htmlFor="mobile" className="mb-1 font-medium">
                                    Mobile No. <span className="text-red-600">*</span>
                                </Label>
                                <Input
                                    id="mobile"
                                    type="text"
                                    placeholder="Mobile number"
                                    maxLength={13} // ensure max 10 digits
                                    {...register("mobile")}
                                    onInput={(e) => {
                                        let val = e.currentTarget.value;

                                        // Remove all non-digit characters except optional + at start
                                        if (val.startsWith("+")) {
                                            val = "+" + val.slice(1).replace(/\D/g, "");
                                        } else {
                                            val = val.replace(/\D/g, "");
                                        }

                                        // Optional: limit to +91XXXXXXXXXX format
                                        if (val.startsWith("+91")) {
                                            val = "+91" + val.slice(3, 13); // max 10 digits after +91
                                        } else if (val.startsWith("91")) {
                                            val = "91" + val.slice(2, 12); // max 10 digits after 91
                                        } else {
                                            val = val.slice(0, 10); // max 10 digits
                                        }

                                        e.currentTarget.value = val;
                                    }}
                                    onPaste={(e) => {
                                        const pasteData = e.clipboardData.getData("text");

                                        // Only allow digits and optional leading +
                                        if (!/^\+?\d+$/.test(pasteData)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.mobile && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
                                )}
                            </div>

                            {/* phone */}
                            <div className="flex flex-col">
                                <Label htmlFor="phone" className="mb-1 font-medium">
                                    Phone No.
                                </Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="Phone number"
                                    {...register("phone")}
                                    onInput={(e) => {
                                        let val = e.currentTarget.value;
                                        if (val.startsWith("+")) {
                                            val = "+" + val.slice(1).replace(/\D/g, "");
                                        } else {
                                            val = val.replace(/\D/g, "");
                                        }
                                        if (val.startsWith("+91")) {
                                            // +91 + STD (2-4) + number (6-8) → max 13 digits
                                            val = "+91" + val.slice(3, 13);
                                        } else if (val.startsWith("0")) {
                                            // 0 + STD + number → max 11 digits
                                            val = "0" + val.slice(1, 11);
                                        } else {
                                            // No prefix → STD + number → max 10 digits
                                            val = val.slice(0, 10);
                                        }

                                        e.currentTarget.value = val;
                                    }}
                                    onPaste={(e) => {
                                        const pasteData = e.clipboardData.getData("text");

                                        // Only allow digits and optional leading +
                                        if (!/^\+?\d+$/.test(pasteData)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>

                            {/* Facebook */}
                            <div className="flex flex-col">
                                <Label htmlFor="fburl" className="mb-1 font-medium">
                                    Facebook
                                </Label>
                                <Input
                                    id="fburl"
                                    type="url"
                                    placeholder="Facebook url"
                                    {...register("fburl")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.fburl && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fburl.message}</p>
                                )}
                            </div>

                            {/* Twitter */}
                            <div className="flex flex-col">
                                <Label htmlFor="twitterurl" className="mb-1 font-medium">
                                    Twitter
                                </Label>
                                <Input
                                    id="twitterurl"
                                    placeholder="Twitter url"
                                    {...register("twitterurl")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.twitterurl && (
                                    <p className="text-red-500 text-sm mt-1">{errors.twitterurl.message}</p>
                                )}
                            </div>

                            {/* Instagram */}
                            <div className="flex flex-col">
                                <Label htmlFor="yturl" className="mb-1 font-medium">
                                    Youtube
                                </Label>
                                <Input
                                    id="yturl"
                                    placeholder="Youtube url"
                                    {...register("yturl")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.yturl && (
                                    <p className="text-red-500 text-sm mt-1">{errors.yturl.message}</p>
                                )}
                            </div>

                            {/* Google Plus */}
                            <div className="flex flex-col">
                                <Label htmlFor="googleplusurl" className="mb-1 font-medium">
                                    Google Plus
                                </Label>
                                <Input
                                    id="googleplusurl"
                                    type="url"
                                    placeholder="Google Plus url"
                                    {...register("googleplusurl")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.googleplusurl && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.googleplusurl.message}
                                    </p>
                                )}
                            </div>

                            {/* LinkedIn
                            <div className="flex flex-col">
                                <Label htmlFor="linkedinurl" className="mb-1 font-medium">
                                    LinkedIn
                                </Label>
                                <Input
                                    id="linkedinurl"
                                    placeholder="LinkedIn url"
                                    {...register("linkedinurl")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.linkedinurl && (
                                    <p className="text-red-500 text-sm mt-1">{errors.linkedinurl.message}</p>
                                )}
                            </div> */}

                            {/* Address */}
                            <div className="flex flex-col">
                                <Label htmlFor="address" className="mb-1 font-medium">
                                    Address <span className="text-red-600">*</span>
                                </Label>
                                <Textarea
                                    id="address"
                                    placeholder="Enter address"
                                    {...register("address")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                                )}
                            </div>


                        </div>

                        <div className="pt-4 flex justify-between">
                            <Button
                                type="button"
                                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-[5px]"
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 hover:bg-blue-700 rounded-[5px] text-white px-6 py-2 min-w-[110px] flex items-center justify-center disabled:opacity-60 "
                            >
                                {isSubmitting ? (
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}