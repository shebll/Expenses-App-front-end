import { z } from "zod";

export const addTagSchema = z.object({
  tagName: z.string().min(3, "Tag name must be at least 3 characters long"),
  tagEmoji: z.string().min(1, "Please select an emoji"),
});

export const updateTagSchema = z.object({
  tagNames: z
    .string()
    .min(3, "Tag name must be at least 3 characters long")
    .optional(),
  tagEmoji: z.string().min(1, "Please select an emoji").optional(),
  tagId: z.number(),
});

export type TagFormValues = z.infer<typeof addTagSchema>;

export const CreateExpenseSchema = z.object({
  date: z.string().optional(),
  amount: z.string().refine(
    (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    },
    {
      message: "must be a positive number",
    }
  ),
  tagId: z.coerce
    .number({
      required_error: "Tag is required",
      invalid_type_error: "Expected number, received string",
    })
    .int()
    .positive({
      message: "You have Select Tag",
    }),
});
export type ExpenseFormValues = z.infer<typeof CreateExpenseSchema>;

export type ExpenseWithTagsType = ExpenseType & {
  tag: TagType;
};

// user types
export type UserResponseType = {
  user: UserType;
};
export type UserType = {
  picture: null | string;
  family_name: string;
  given_name: string;
  email: string;
  id: string;
};

// tags types
export type TagResponseType = {
  tags: TagType[];
};
export type TagType = {
  id: number;
  tagName: string;
  userId: string;
  tagEmoji: string;
  createdAt: string | null;
};

// expenses types
export type ExpenseResponseType = {
  expenses: ExpenseWithTagsType[];
};
export type ExpenseType = {
  date: string | null;
  id: number;
  userId: string;
  createdAt: string | null;
  tagId: number;
  amount: string;
};

// total expenses types
export type TotalExpenseType = {
  totalExpenses: string;
};
