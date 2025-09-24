"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from '@/components/ui/loader'
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { getUserById, updateUser } from "@/services/userService";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { userSchema } from '../../../../schemas/userSchema'
type FormData = z.infer<typeof userSchema>;

export default function EditUserForm() {
  const router = useRouter();
  let id: string | null = null;
  if (typeof window !== "undefined") {
    const params = useSearchParams();
    id = params.get("id");
  }

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
  });

  const [imagePath, setImagePath] = useState(null);
  console.log(imagePath);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const response = await getUserById(id);
          if (response?.result) {
            setValue("name", response.result.name);
            setValue("email", response.result.email);
            setValue("mobile", response.result.mobile ? String(response.result.mobile) : "");
            setValue("phone", response.result.phone ? String(response.result.phone) : "");
            setValue("fburl", response.result.fburl || "");
            setValue("twitterurl", response.result.twitterurl || "");
            setValue("linkedinurl", response.result.linkedinurl || "");
            // setValue("instagramurl", response.result.instagramurl || "");
            setValue("googleplusurl", response.result.googleplusurl || "");
            setValue("image", response.result.image || "");
            setImagePath(response.result.image || null);
          }
        } catch {
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("email", data.email);
      // formDataToSend.append("password", data.password);
      if (data.mobile) formDataToSend.append("mobile", data.mobile);
      if (data.phone) formDataToSend.append("phone", data.phone);
      if (data.status) formDataToSend.append("status", data.status);
      if (data.role) formDataToSend.append("role", data.role);
      if (data.fburl) formDataToSend.append("fburl", data.fburl);
      if (data.twitterurl) formDataToSend.append("twitterurl", data.twitterurl);
      if (data.linkedinurl) formDataToSend.append("linkedinurl", data.linkedinurl);
      // if (data.instagramurl) formDataToSend.append("instagramurl", data.instagramurl);
      if (data.googleplusurl) formDataToSend.append("googleplusurl", data.googleplusurl);
      if (imagePath) formDataToSend.append("image", imagePath);

      const response = await updateUser(id!, formDataToSend);

      if (response?.status === true) {
        SwalSuccess('User has been updated successfully.');
        router.push("/admin/user");
      } else {
        SwalError({
          title: "Failed!",
          message: response?.message || "Failed to update user."
        });
      }
    } catch (error: any) {
      SwalError({
        title: "Failed!",
        message: error?.response?.data?.message || "Failed to update user."
      });
    }
  };

  const handleBack = () => {
    router.push("/admin/user");
  };

  if (!id) return <p className="text-red-600">Invalid user ID.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <h1 className="text-xl font-medium text-gray-800">Edit User</h1>
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
              <div>
                <Label htmlFor="mobile">Mobile No.</Label>
                <Input id="mobile" {...register("mobile")} placeholder="Enter mobile number" />
                {errors.mobile && <p className="text-red-600 text-sm">{errors.mobile.message}</p>}
              </div>
              {/* phone */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register("phone")} placeholder="Enter phone number" />
                {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
              </div>
              {/* Facebook */}
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="fburl" {...register("fburl")} placeholder="Enter Facebook URL" />
                {errors.fburl && <p className="text-red-600 text-sm">{errors.fburl.message}</p>}
              </div>
              {/* Twitter */}
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitterurl" {...register("twitterurl")} placeholder="Enter Twitter URL" />
                {errors.twitterurl && <p className="text-red-600 text-sm">{errors.twitterurl.message}</p>}
              </div>
              {/* LinkedIn */}
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedinurl" {...register("linkedinurl")} placeholder="Enter LinkedIn URL" />
                {errors.linkedinurl && <p className="text-red-600 text-sm">{errors.linkedinurl.message}</p>}
              </div>
              {/* Instagram
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagramurl" {...register("instagramurl")} placeholder="Enter Instagram URL" />
              {errors.instagramurl && <p className="text-red-600 text-sm">{errors.instagramurl.message}</p>}
            </div> */}
              {/* Google Plus */}
              <div>
                <Label htmlFor="googleplus">Google Plus</Label>
                <Input id="googleplusurl" {...register("googleplusurl")} placeholder="Enter Google Plus URL" />
                {errors.googleplusurl && <p className="text-red-600 text-sm">{errors.googleplusurl.message}</p>}
              </div>
              {/* Image */}
              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    setImagePath(e.target.files?.[0]);
                  }}
                />
                {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}
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
        )}
      </main>
    </div>
  );
}
