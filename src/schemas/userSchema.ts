import { z } from "zod";

const indianMobileRegex = /^(\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/;
const indianLandlineRegex = /^(\+91[\-\s]?|0)?\d{2,4}[\-\s]?\d{6,8}$/;

export const userSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().nonempty("Mobile is required").regex(indianMobileRegex, "Invalid mobile number"),
    phone: z.string().regex(indianLandlineRegex, "Invalid landline number")
        .optional().nullable().or(z.literal("")),
    status: z.union([z.literal("Y"), z.literal("N")]).optional(),
    role: z.enum(["1", "2"]).optional(),
    image: z.string().nullable().optional(),
    fburl: z.string().url("Invalid Facebook URL").nullable().optional().or(z.literal("")),
    twitterurl: z.string().url("Invalid Twitter URL").nullable().optional().or(z.literal("")),
    linkedinurl: z.string().url("Invalid LinkedIn URL").nullable().optional().or(z.literal("")),
    yturl: z.string().url("Invalid Youtube URL").nullable().optional().or(z.literal("")),
    googleplusurl: z.string().url("Invalid Google+ URL").nullable().optional().or(z.literal("")),
    address: z.string({ required_error: "Address is required" }).nonempty("Address is required")
        .min(10, "Address is too short"), // handles short input
    // company_name: z.string({ required_error: "Company name is required" }).nonempty("Company is required"),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
