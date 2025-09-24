"use client"

import React, { useState, useEffect, useRef } from "react";
import formatPhoneNumber from "@/components/formatNumber";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { EnquiryAttributes } from "@/types/enquiry"
import { getAllAdmins } from "@/services/userService";
import { createEnquiry, getAllCountries } from "@/services/enquiry.service";
import { enquirySchema } from "@/schemas/enquiry.schema";
import { User } from "@/types/user";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import Header from "../header/page"
import Footer from "../footer/page"
import Loading from "@/components/ui/loader"
import ReCAPTCHA from "react-google-recaptcha";
type FormData = z.infer<typeof enquirySchema>;

export default function CompanyInfoSection() {
    const router = useRouter();
    const [countries, setCountries] = useState([]);
    const [allData, setAllData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(enquirySchema) as any,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getAllAdmins();
            const result = res?.result;
            const data: any = Array.isArray(result?.data) ? result.data : [];
            setAllData(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const res = await getAllCountries();
            setCountries(res?.data?.body?.result || []);
        })();
        fetchData();
    }, []);

    const onSubmit = async (data: FormData) => {

        try {
            // ✅ Get reCAPTCHA token
            const token = await recaptchaRef.current?.getValue();
            if (!token) {
                SwalError({
                    title: "Failed!",
                    message: "Please complete reCAPTCHA",
                });
                return;
            }
            const payload: EnquiryAttributes = {
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                subject: data.subject,
                country: String(data.country).trim()
            };
            const response: any = await createEnquiry(payload);
            if (response?.status === true) {
                SwalSuccess("enquery submitted successfully.");
                router.push("/");
            } else {
                SwalError({
                    title: "Failed!",
                    message: response?.message ?? "Failed to connect.",
                });
            }
        } catch (error: any) {
            let message = "Something went wrong.";
            if (typeof error === "object" && error !== null && "response" in error) {
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            SwalError({
                title: "Error!",
                message,
            });
        }
    };

    return (
        <><Header />
            <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-24 py-10 sm:py-12 lg:py-16 text-black lg:pt-[140px] pt-[80px]">
                <Card className="w-full bg-white border-t-4 border-l-4 border-[#bc1419] shadow-lg">
                    <CardContent className="flex flex-col px-6 sm:px-10 lg:px-14 py-10">
                        {loading ? <Loading /> :
                            (
                                <>
                                    <header className="flex flex-col sm:flex-row items-center justify-start border-b border-gray-400 gap-3 pb-4 mb-10">
                                        <img
                                            className="w-12 h-12 object-contain mb-4 sm:mb-0"
                                            alt="Company logo"
                                            src="https://c.animaapp.com/mfi46rftm3XGAO/img/pixelcut-export-1-8.png"
                                        />
                                        <h1 className="font-bold text-red-700 text-3xl sm:text-4xl text-center sm:text-left">
                                            CONTACT US
                                        </h1>
                                    </header>

                                    <div className="flex flex-col gap-12">
                                        {/** Support Details */}
                                        <div>
                                            <h2 className="text-xl font-semibold text-[#e10b01] mb-6">
                                                REGISTERED OFFICE / HEAD OFFICE
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                {allData.map((contact, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex flex-col gap-6 bg-gray-100 p-5 rounded-lg shadow-lg"
                                                    >
                                                        <div className="font-bold text-[#373d4b] text-lg">
                                                            {contact.name}
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <img
                                                                className="w-8 h-8"
                                                                alt="Location icon"
                                                                src="https://c.animaapp.com/mfi46rftm3XGAO/img/smartphone-line-16.svg"
                                                            />
                                                            <div>
                                                                <p className="text-sm "><u>{contact.company_name}</u></p>
                                                                <p className="text-sm whitespace-pre-line">
                                                                    {contact.address}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-4 items-center">
                                                            <img
                                                                className="w-8 h-8"
                                                                alt="Fax icon"
                                                                src="https://c.animaapp.com/mfi46rftm3XGAO/img/smartphone-line.svg"
                                                            />
                                                            <p className="text-sm">{formatPhoneNumber(contact.phone)} / 305 / 427</p>
                                                        </div>

                                                        <div className="flex gap-4 items-center">
                                                            <img
                                                                className="w-8 h-8"
                                                                alt="Phone icon"
                                                                src="https://c.animaapp.com/mfi46rftm3XGAO/img/smartphone-line-4.svg"
                                                            />
                                                            <p className="text-sm">{formatPhoneNumber(contact.fax)}, 2260073</p>
                                                        </div>

                                                        <div className="flex gap-4 items-center">
                                                            <img
                                                                className="w-8 h-8"
                                                                alt="Email icon"
                                                                src="https://c.animaapp.com/mfi46rftm3XGAO/img/smartphone-line-1.svg"
                                                            />
                                                            <Link className="text-sm hover:text-red-600" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`} target="_blank">
                                                                {contact.email}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/** Contact Form */}
                                        <main className="bg-gray-100 p-6 sm:p-10 rounded-lg shadow-lg">
                                            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

                                                    <div>
                                                        <Input
                                                            name="name"
                                                            className="bg-white-500"
                                                            placeholder="Name"
                                                            {...register("name")}
                                                        />
                                                        {errors.name && (
                                                            <p className="text-sm text-red-500">{errors.name.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Input
                                                            name="email"
                                                            className="bg-white-500"
                                                            placeholder="Email"
                                                            {...register("email")}
                                                        />
                                                        {errors.email && (
                                                            <p className="text-sm text-red-500">{errors.email.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Input
                                                            name="phone"
                                                            type="text"
                                                            placeholder="Phone"
                                                            className="bg-white-500"
                                                            {...register("mobile")}
                                                            maxLength={13}
                                                            {...register("mobile")}
                                                            onInput={(e) => {
                                                                let val = e.currentTarget.value;

                                                                if (val.startsWith("+")) {
                                                                    val = "+" + val.slice(1).replace(/\D/g, "");
                                                                } else {
                                                                    val = val.replace(/\D/g, "");
                                                                }
                                                                if (val.startsWith("+91")) {
                                                                    val = "+91" + val.slice(3, 13);
                                                                }
                                                                else if (val.startsWith("91")) {
                                                                    val = "91" + val.slice(2, 12);
                                                                }
                                                                else if (val.startsWith("0")) {
                                                                    val = val.replace(/^0+/, "0"); // collapse multiple 0s
                                                                    val = val.slice(0, 11); // 0 + 10 digits
                                                                    // must not start with 0 followed by 1–5
                                                                    if (/^0[1-5]/.test(val)) {
                                                                        val = "0"; // reset to just "0" (invalid input beyond that)
                                                                    }
                                                                }
                                                                else if (/^[6-9]/.test(val)) {
                                                                    val = val.slice(0, 10);
                                                                }
                                                                else if (/^[1-5]/.test(val)) {
                                                                    val = "";
                                                                }
                                                                else {
                                                                    val = val.slice(0, 10);
                                                                }

                                                                e.currentTarget.value = val;
                                                            }}
                                                            onPaste={(e) => {
                                                                e.preventDefault();
                                                                let val = e.clipboardData.getData("text");
                                                                if (val.startsWith("+")) {
                                                                    val = "+" + val.slice(1).replace(/\D/g, "");
                                                                } else {
                                                                    val = val.replace(/\D/g, "");
                                                                }

                                                                if (val.startsWith("+91")) {
                                                                    val = "+91" + val.slice(3, 13);
                                                                    if (/^\+91[0-5]/.test(val)) val = "+91";
                                                                } else if (val.startsWith("91")) {
                                                                    val = "91" + val.slice(2, 12);
                                                                    if (/^91[0-5]/.test(val)) val = "91";
                                                                } else if (val.startsWith("0")) {
                                                                    val = val.replace(/^0+/, "0");
                                                                    val = val.slice(0, 11);
                                                                    if (/^0[1-5]/.test(val)) val = "0";
                                                                } else if (/^[6-9]/.test(val)) {
                                                                    val = val.slice(0, 10);
                                                                } else if (/^[1-5]/.test(val)) {
                                                                    val = "";
                                                                } else {
                                                                    val = val.slice(0, 10);
                                                                }

                                                                e.currentTarget.value = val;
                                                            }}
                                                        />
                                                        {errors.mobile && (
                                                            <p className="text-sm text-red-500">{errors.mobile.message}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <select
                                                            name="country"
                                                            id="country"
                                                            // {...register("country", { required: "Country is required" })}
                                                            onChange={(e) => {
                                                                const selectedName = e.target.value;
                                                                setValue("country", selectedName, { shouldValidate: true });
                                                            }}
                                                            className="w-full h-9 text-black text-sm border border-gray-200 hover:rounded-[5px] px-2"
                                                        >
                                                            <option value="">Select Country</option>
                                                            {countries.map((s) => (
                                                                <option key={s.id} value={s.name} data-id={s.id}>
                                                                    {s.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.country && (
                                                            <p className="text-sm text-red-500">{errors.country.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Textarea
                                                            name="message"
                                                            placeholder="Message"
                                                            {...register("subject")}
                                                            className="resize-none"
                                                        />
                                                        {errors.subject && (
                                                            <p className="text-sm text-red-500">{errors.subject.message}</p>
                                                        )}
                                                    </div>

                                                    <ReCAPTCHA
                                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                                        ref={recaptchaRef}
                                                    />

                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="bg-blue-500 hover:bg-blue-700 rounded-[5px] text-white px-6 py-2 min-w-[110px] max-w-[120px] flex items-center justify-center disabled:opacity-60 "
                                                >
                                                    {isSubmitting ? (
                                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    ) : (
                                                        "Submit"
                                                    )}
                                                </Button>
                                            </form>
                                        </main></div></>
                            )}
                    </CardContent>
                </Card>
            </section>
            <Footer /></>
    );
};