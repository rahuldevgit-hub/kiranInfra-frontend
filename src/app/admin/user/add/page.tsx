"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { createUser } from "@/services/userService";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

// Zod Schema for User
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
    .min(10, 'Mobile number must be 10 digits')
    .max(10, 'Mobile number must be 10 digits'),
  status: z
    .union([
      z.literal("Y"),
      z.literal("N"),
    ])
    .optional(),
  role: z.enum(['1', '2']).optional(),
  office: z.union([z.string().regex(/^\d+$/, "Office must be a number"), z.literal("")]).optional(),
  fburl: z.union([z.string().url("Invalid Facebook URL"), z.literal("")]).optional(),
  twitterurl: z.union([z.string().url("Invalid Twitter URL"), z.literal("")]).optional(),
  linkedinurl: z.union([z.string().url("Invalid LinkedIn URL"), z.literal("")]).optional(),
  googleplusurl: z.union([z.string().url("Invalid Google Plus URL"), z.literal("")]).optional(),
  image: z.string().optional(),
});


type FormData = z.infer<typeof userSchema>;

export default function AddUserForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
  });

  const [imagePath, setImagePath] = React.useState("");

  const handleBack = () => {
    router.push("/admin/user");
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("email", data.email);
      // formDataToSend.append("password", data.password);
      if (data.mobile) formDataToSend.append("mobile", data.mobile);
      if (data.office) formDataToSend.append("office", data.office);
      if (data.status) formDataToSend.append("status", data.status);
      if (data.role) formDataToSend.append("role", data.role);
      if (data.fburl) formDataToSend.append("fburl", data.fburl);
      if (data.twitterurl) formDataToSend.append("twitterurl", data.twitterurl);
      if (data.linkedinurl) formDataToSend.append("linkedinurl", data.linkedinurl);
      // if (data.instagramurl) formDataToSend.append("instagramurl", data.instagramurl);
      if (data.googleplusurl) formDataToSend.append("googleplusurl", data.googleplusurl);
      if (imagePath) formDataToSend.append("image", imagePath);

      const response = await createUser(formDataToSend);

      if (response?.status === true) {
        SwalSuccess("User has been saved successfully.");
        router.push("/admin/user");
      } else {
        SwalError({
          title: "Failed!",
          message: response?.message || "Failed to create user.",
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      SwalError({
        title: "Error!",
        message: message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h1 className="text-xl font-medium text-gray-800">Add User</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            {/* Name */}
            <div>
              <Label htmlFor="name">
                Name <span className="text-red-600">*</span>
              </Label>
              <Input id="name" {...register("name")} placeholder="Enter name" />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
            </div>
            {/* Email */}
            <div>
              <Label htmlFor="email">
                Email <span className="text-red-600">*</span>
              </Label>
              <Input id="email" type="email" {...register("email")} placeholder="Enter email" />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>
            {/* Password
            <div>
              <Label htmlFor="password">
                Password <span className="text-red-600">*</span>
              </Label>
              <Input id="password" type="password" {...register("password")} placeholder="Enter password" />
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div> */}
            {/* Mobile */}
            <div>
              <Label htmlFor="mobile">Mobile No. <span className="text-red-600">*</span></Label>
              <Input id="mobile" {...register("mobile")} placeholder="Enter Mobile number" />
              {errors.mobile && <p className="text-red-600 text-sm">{errors.mobile.message}</p>}
            </div>
            {/* Office */}
            <div>
              <Label htmlFor="office">Office No.</Label>
              <Input id="office" {...register("office")} placeholder="Enter Office number" />
              {errors.office && <p className="text-red-600 text-sm">{errors.office.message}</p>}
            </div>
            {/* Facebook */}
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="fburl" {...register("fburl")} placeholder="Enter Facebook URL" />
              {errors.fburl && <p className="text-red-600 text-sm">{errors.fburl.message}</p>}
            </div>
            {/* Twitter */}
            <div>
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input id="twitterurl" {...register("twitterurl")} placeholder="Enter Twitter URL" />
              {errors.twitterurl && <p className="text-red-600 text-sm">{errors.twitterurl.message}</p>}
            </div>
            {/* LinkedIn */}
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedinurl" {...register("linkedinurl")} placeholder="Enter LinkedIn URL" />
              {errors.linkedinurl && <p className="text-red-600 text-sm">{errors.linkedinurl.message}</p>}
            </div>
            {/* Instagram */
            /* <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagramurl" {...register("instagramurl")} placeholder="Enter Instagram URL" />
              {errors.instagramurl && <p className="text-red-600 text-sm">{errors.instagramurl.message}</p>}
            </div> */}
            {/* Google Plus */}
            <div>
              <Label htmlFor="googleplus">Google Plus URL</Label>
              <Input id="googleplusurl" {...register("googleplusurl")} placeholder="Enter Google Plus URL" />
              {errors.googleplusurl && <p className="text-red-600 text-sm">{errors.googleplusurl.message}</p>}
            </div>
            {/* Image */}
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setImagePath(`/uploads/${e.target.files[0].name}`);
                  } else {
                    setImagePath("");
                  }
                }}
              />
              {errors.image && (
                <p className="text-red-600 text-sm">{errors.image.message}</p>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:opacity-90"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 