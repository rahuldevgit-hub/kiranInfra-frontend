"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { EnquiryAttributes } from "@/types/enquiry"
import { createEnquiry } from "@/services/enquiry.service";
import { enquiryFooter } from "@/schemas/enquiry.schema";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
type FormData = z.infer<typeof enquiryFooter>;

export default function Footer() {
  const router = useRouter();
  const year = new Date().getFullYear();
  const ourLinksItems = [{ text: "TPPL", link: "/tppl" }, { text: "KCPL", link: "/kcpl" }];
  const companyItems = [{ text: "Company profile", link: "/company-profile" },
  { text: "Our Associates", link: "/our-associates" }];
  const navigationItems = [
    { text: "Home", link: "/" },
    { text: "About Us", link: "/company-profile" },
    { text: "Awards & Credits", link: "/award-credits" },
    { text: "Financials", link: "/financials" },
    { text: "Work Executed", link: "/completed-projects" },
    { text: "Contact Us", link: "/contact-us" },
  ]; const socialIcons = [
    { src: "https://c.animaapp.com/mfi46rftm3XGAO/img/facebook-fill-1.svg", link: "https://www.facebook.com/" },
    { src: "https://c.animaapp.com/mfi46rftm3XGAO/img/facebook-fill.svg", link: "https://x.com/" },
    { src: null, isGooglePlus: true, link: "https://workspaceupdates.googleblog.com/2023/04/new-community-features-for-google-chat-and-an-update-currents%20.html" },
    { src: "https://c.animaapp.com/mfi46rftm3XGAO/img/youtube-fill.svg", link: "https://www.youtube.com/" },
    { src: "https://c.animaapp.com/mfi46rftm3XGAO/img/linkedin-fill.svg", link: "https://in.linkedin.com/" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(enquiryFooter) as any,
  });
  const onSubmit = async (data: FormData) => {
    try {
      const payload: EnquiryAttributes = {
        name: data.name,
        email: data.email,
        subject: data.subject,
      };
      const response: any = await createEnquiry(payload);
      if (response?.status === true) {
        SwalSuccess("enquery submitted successfully.");
        // router.push("/");
        reset({
          name: "",
          email: "",
          subject: "",
        });
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
    <div className="flex justify-center bg-[url('https://c.animaapp.com/mfi46rftm3XGAO/img/footer-section-9.png')] bg-cover bg-center">
      <footer className="w-full flex flex-col mt-12 gap-2 px-4 sm:px-8 lg:px-20 py-6">
        {/* nav */}
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-white text-sm sm:text-base">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="relative font-medium transition-colors hover:text-gray-300
                 after:content-[''] after:absolute after:left-0 after:bottom-[-2px]
                 after:w-0 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300 
                 hover:after:w-full"
            >
              {item.text}
            </Link>
          ))}
        </nav>
        {/* content box */}
        <div className="bg-black/70 px-4 sm:px-8 lg:px-12 py-6 lg:py-8 flex flex-col gap-6 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* links */}
            <div className="flex flex-col sm:flex-row justify-around gap-6">
              <div>
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-1">OUR LINKS</h3>
                <hr className="border-red-600 border-2 mb-2" />
                <ul className="space-y-1">
                  {ourLinksItems.map((item, i) => (
                    <li key={i}>
                      <Link href={item.link} className="text-white/90 text-sm sm:text-base hover:text-red-600">
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-1">COMPANY</h3>
                <hr className="border-red-600 border-2 mb-2" />
                <ul className="space-y-1">
                  {companyItems.map((item, i) => (
                    <li key={i}>
                      <Link href={item.link} className="text-white/90 text-sm sm:text-base hover:text-red-600">
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>





            {/* 
          {/* form 
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Name" className="bg-white text-black w-full" />
              <Input placeholder="Email" type="email" className="bg-white text-black w-full" />
            </div>
            <Textarea placeholder="Message" className="bg-white text-black h-20 resize-none" />
            <div className="max-w-[300px]">
              <Button className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
                SEND
              </Button>
            </div>
          </div> */}


            <main>
              <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-black">

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

                </div>
                <div className="grid grid-cols-1 gap-6 text-black">
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Message"
                      {...register("subject", { required: "Message is required" })}
                      className="resize-none max-h-28 w-full border border-gray-300 px-2 py-1 text-sm"
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-500">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 min-w-[90px] max-w-[100px] flex items-center justify-center disabled:opacity-60 "
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </main>


          </div>

          {/* social icons */}
          <div className="flex justify-center items-center gap-4">
            {socialIcons.map((social, i) => (
              <div key={i}>
                {social.isGooglePlus ? (
                  <Link
                    key={i}
                    href={social.link}
                    target="_blank">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full cursor-pointer 
                hover:bg-gray-200 group">
                      <span className="font-bold text-lg text-gray-800">
                        g+
                      </span>
                    </div>
                  </Link>

                ) : (
                  <Link
                    key={i}
                    href={social.link}
                    target="_blank">
                    <img
                      src={social.src!}
                      alt="Social icon"
                      className="w-8 h-8 cursor-pointer hover:opacity-80"
                    />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* copyright */}
          <div className="text-center text-xs sm:text-sm text-white">
            <p>Copyright {year}. Kiraninfra.com. All Rights Reserved.</p>
            <p className="mt-1">
              Designed By -{" "}
              <Link
                href="https://www.doomshell.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 underline hover:text-red-700"
              >
                Doomshell.com
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// import { Facebook, Twitter, Youtube, Linkedin, } from "lucide-react";
//   const socialIcons = [
//     { src: Facebook, link: "https://www.facebook.com/" },
//     { src: Twitter, link: "https://x.com/" },
//     { src: null, isGooglePlus: true, link: "https://workspaceupdates.googleblog.com/" },
//     { src: Youtube, link: "https://www.youtube.com/" },
//     { src: Linkedin, link: "https://in.linkedin.com/" },
//   ];

//    {/* social icons */}
//           <div className="flex justify-center items-center gap-4">
//             {socialIcons.map((social, i) => (
//               <div key={i}>
//                 {social.isGooglePlus ? (
//                   <Link href={social.link} target="_blank">
//                     <div
//                       className="w-8 h-8 flex items-center justify-center bg-white rounded-full cursor-pointer hover:bg-red-600 group"
//                     >
//                       <span className="font-md text-gray-800 hover:text-white pb-1">g+</span>
//                     </div>
//                   </Link>
//                 ) : (
//                   <Link href={social.link} target="_blank">
//                     <div
//                       className="group w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-red-600 cursor-pointer transition-colors"
//                     >
//                       <social.src className="w-4 h-4 font-bold text-gray-800 group-hover:text-white" />
//                     </div>
//                   </Link>
//                 )}
//               </div>
//             ))}

// </div>