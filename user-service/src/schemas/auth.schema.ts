import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => {
      // local auth
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }

      // google auth
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type RegisterSchemaDTO = z.infer<typeof registerSchema>;
export type CreateUserDTO = Omit<RegisterSchemaDTO, "confirmPassword">;
