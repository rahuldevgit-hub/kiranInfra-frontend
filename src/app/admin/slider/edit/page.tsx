"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from '@/components/ui/loader'
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { editSliderSchema } from "@/schemas/slider.schema";
import { updateSlider, getSliderById } from "@/services/slider.service";
import dynamic from "next/dynamic";

const SummernoteEditor = dynamic(() => import("@/components/ui/SummernoteEditor"), {
  ssr: false,
});
type FormData = z.infer<typeof editSliderSchema>;

export default function EditSliderForm() {
  const router = useRouter();
  let id: string | null = null;
  if (typeof window !== "undefined") {
    // only access useSearchParams on client side
    const params = useSearchParams();
    id = params.get("id");
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagesPath, setImagesPath] = React.useState<File | null>(null);
  const [imagesPreview, setImagesPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(editSliderSchema),
  });

  const handleBack = () => {
    router.push("/admin/slider");
  };

  // let descriptionValue;
  const descriptionValue = watch("description");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await getSliderById(id);
        const data = (res as any).result || res;
        // console.log(">>>>><<<<<<", data);
        setValue("title", data.title || "");
        setValue("images", data.images || "");
        setValue(
          "description",
          data.description === undefined ||
            data.description === null ||
            data.description === "undefined" ||
            data.description === "null" ||
            data.description === 0
            ? ""
            : data.description,
        );

        if (data.images) {
          setImagesPreview(
            `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.images}`,
          );
        }
      } catch (error) {
        SwalError({ title: "Error", message: "Failed to load Slider data." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("images", imagesPath);

      const response: any = await updateSlider(id, formData);

      if (response?.status === true) {
        SwalSuccess("Slider has been updated successfully.");
        router.push("/admin/slider");
      } else {
        SwalError({
          title: "Failed!",
          message: response?.message || "Failed to update Slider.",
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <h1 className="text-xl font-medium text-gray-800 ml-2">Edit Slider</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (<Loader />) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6 bg-white rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black ">
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter slider title"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm">{errors.title.message}</p>
                )}
              </div>
              {/* Image */}
              <div>
                <div>
                  <Label htmlFor="images">
                    Image <span className="text-red-600">*</span>{" "}
                    <p className="inline text-xs text-gray-500 mt-1">
                      Upload only (.jpg, .jpeg, and .png)
                    </p>
                  </Label>
                  <Input
                    ref={fileInputRef}
                    id="images"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) {
                        setValue("images", null, { shouldValidate: true });
                        setImagesPath(null);
                        setImagesPreview(null);
                        return;
                      }

                      const isValidType = [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                      ].includes(file.type);

                      if (!isValidType) {
                        SwalError({
                          title: "Invalid File",
                          message: "Only JPG, JPEG, and PNG files are allowed.",
                        });
                        setValue("images", null, { shouldValidate: true });
                        setImagesPath(null);
                        setImagesPreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                        return;
                      }

                      setValue("images", file, { shouldValidate: true });
                      setImagesPath(file);
                      setImagesPreview(URL.createObjectURL(file));
                    }}
                  />
                </div>

                {errors.images && (
                  <p className="text-red-600 text-sm">
                    {errors.images.message as string}
                  </p>
                )}
              </div>
              <div>
                {imagesPreview ? (
                  <div className="w-full border rounded-lg overflow-hidden">
                    <img
                      src={imagesPreview}
                      alt="Image Preview"
                      className="h-36 object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-36 border rounded-lg flex items-center justify-center text-gray-400 bg-gray-100">
                    No image selected
                  </div>
                )}
              </div>
              {/* Description */}
              <div className="md:col-span-3">
                <Label htmlFor="description">
                  Description <span className="text-red-600">*</span>
                </Label>
                <SummernoteEditor
                  value={descriptionValue}
                  onChange={(html) => {
                    setDescription(html);
                    setValue("description", html, { shouldValidate: true });
                  }}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
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
