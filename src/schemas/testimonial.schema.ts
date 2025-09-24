import { z } from "zod";

export const TestimonialSchema = z.object({
  name: z.string().min(1, "Name is reqired."),
  company_logo: z
    .custom<File | undefined>()
    .optional()
    .refine((file) => !file || (file instanceof File && file.size > 0), {
      message: "Please upload a valid company logo image",
    }),
  cat_id: z.number().int().optional(),
  subcat_id: z.number().int().optional(),
  desig: z.string().optional(),
  description: z.string().optional(),
  image: z
    .custom<File | undefined>()
    .optional()
    .refine((file) => !file || (file instanceof File && file.size > 0), {
      message: "Please upload a valid testimonial image",
    }),
  url: z.string().url().optional(),
  status: z.enum(["Y", "N"]).optional(),
});

export const TestimonialEditSchema = z.object({
  name: z.string().max(255).optional(),
  company_logo: z.any().optional(),
  cat_id: z.number().int().optional(),
  subcat_id: z.number().int().optional(),
  desig: z.string().max(255).optional(),
  description: z.string().optional(),
  image: z.any().optional(),
  url: z.string().url().optional(),
  status: z.enum(["Y", "N"]).optional(),
});
