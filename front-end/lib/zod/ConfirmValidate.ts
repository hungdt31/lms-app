import { z } from "zod";

const ConfirmSchema = z
  .object({
    password: z.string().min(1, { message: "This field has to be filled." }),
    confirm_password: z
      .string()
      .min(1, { message: "This field has to be filled." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export default ConfirmSchema;
