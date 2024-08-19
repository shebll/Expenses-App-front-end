import { ExpenseType } from "@/types/types";
import { create } from "zustand";

type UseCreateExpenseType = {
  openModel: boolean;
  expense: ExpenseType | null;
  setExpense: (expense: ExpenseType | null) => void;
};

export const useCreateExpense = create<UseCreateExpenseType>((set) => ({
  openModel: false,
  expense: null,
  setExpense: (expense) =>
    set((state) => ({ expense: expense, openModel: !state.openModel })),
}));
