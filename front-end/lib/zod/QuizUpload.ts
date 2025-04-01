import { z } from "zod";
const formSchema = z.object({
  quizData: z.object({
    title: z.string().min(1, { message: "This field has to be filled." }),
    description: z.string(),
    time_limit: z.number().nullable(),
    factor: z.number(),
    start_date: z.date(),
    end_date: z.date(),
    typePoint: z.string().min(1, { message: "This field has to be filled." }),
    documentSectionId: z
      .string()
      .min(1, { message: "This field has to be filled." }),
  }),
  questions: z.array(
    z.object({
      content: z.string().min(1, { message: "This field has to be filled." }),
      options: z
        .array(
          z.string().min(1, {
            message: "This field has to be filled.",
          }),
        )
        .nonempty()
        .length(4, {
          message: "There must be 4 options.",
        }),
      explain: z.string(),
      answer: z.string().min(1, {
        message:
          "The answer is invalid because input is empty or radio isn't checked.",
      }),
    }),
  ),
});
export default formSchema;
