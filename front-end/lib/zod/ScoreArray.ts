import { z } from "zod";

const formSchema = z.object({
  score_array: z.array(
    z.object({
      score: z.number().min(0, { message: "Score must be between 0 and 10"}).max(10, {message: "Score must be between 0 and 10"}),
    })
  ),
});

export default formSchema;