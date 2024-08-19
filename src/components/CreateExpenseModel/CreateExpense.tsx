import { useEffect, useState } from "react";

import axios from "axios";
import { api } from "@/lib/api";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";

import TagsSelection from "./components/Tag/TagsSelection";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import {
  CreateExpenseSchema,
  ExpenseFormValues,
  ExpenseType,
  TagType,
} from "@/types/types";
import { TagForm } from "./components/Tag/TagForm";

interface CreateExpenseProps {
  expense?: ExpenseType | null;
  onClose: () => void;
  openModel: boolean;
}

const CreateExpense = ({ expense, onClose, openModel }: CreateExpenseProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isUpdateTag, setIsUpdateTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagType>();

  const [showCalendar, setShowCalendar] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(CreateExpenseSchema),
  });
  useEffect(() => {
    if (expense) {
      reset({
        amount: expense.amount,
        tagId: expense.tagId,
        date: expense.date!,
      });
    } else {
      reset({ amount: "", tagId: 0, date: new Date().toISOString() });
    }
  }, [expense, reset]);

  const selectedTagId = watch("tagId");

  const expenseMutation = useMutation({
    mutationFn: async (data: ExpenseFormValues) => {
      if (expense) {
        console.log(data.date);
        return await api.patch(`expenses/${expense.id}`, {
          ...{
            amount: data.amount,
            tagId: data.tagId,
            date: data.date,
          },
        });
      } else {
        return await api.post(`expenses`, {
          ...data,
        });
      }
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["total-expenses"] });
      reset();
      onClose();
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        // if api provider given error
        if (error.response) {
          if (error.response.data.message) {
            setError("root", {
              message: `Error fetching data: ${error.response.data.message}`,
            });
          } else {
            setError("root", {
              message: `Error fetching data: ${error.response.data}`,
            });
          }
        } else {
          setError("root", {
            message: `Error fetching data: ${error.message}`,
          });
        }
      } else if (error instanceof Error) {
        setError("root", {
          message: `${error.message}`,
        });
      } else {
        setError("root", {
          message: `Something went wrong try again`,
        });
      }
    },
  });

  const onSubmit: SubmitHandler<ExpenseFormValues> = (data) => {
    expenseMutation.mutate(data);
  };

  return (
    <section
      className={`absolute ${
        openModel ? "bottom-0 " : "bottom-[-100%]"
      } transition-all duration-500 ease-in-out left-0 flex flex-col items-center justify-center w-full h-full gap-20 p-6 bg-transparent backdrop-blur-xl z-[1]`}
    >
      <form
        className={`flex flex-col items-center justify-center w-full gap-6 transition-all duration-700 ease-in-out relative left-0`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <h2 className="mb-4 text-2xl font-bold">
            {expense ? "Edit Expense" : "Create Expense"}
          </h2>
          <input
            {...register("amount", { valueAsNumber: false })}
            placeholder="0"
            type="number"
            step="0.001"
            className="text-5xl font-bold text-center bg-transparent border-b outline-none border-zinc-200 w-52"
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-sm text-center text-gray-400">Select The Tag</h1>
          <TagsSelection
            setIsAddingTag={setIsAddingTag}
            setIsUpdateTag={setIsUpdateTag}
            setSelectedTag={setSelectedTag}
            register={register}
            error={errors.tagId}
            value={selectedTagId}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p
            className="text-sm text-center text-gray-400"
            onClick={() => setShowCalendar(true)}
          >
            Select specific date !
          </p>
          {showCalendar && (
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Calendar
                  mode="single"
                  selected={new Date(field.value!)}
                  onSelect={(selectedDate) => {
                    field.onChange((selectedDate ?? new Date()).toISOString());
                  }}
                  className="border rounded-md"
                />
              )}
            />
          )}
        </div>
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
        <div className="flex w-full gap-2">
          <Button
            className="w-[30%]"
            variant={"ghost"}
            onClick={() => onClose()}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="w-[70%]"
            variant={"default"}
            type="submit"
            disabled={expenseMutation.isPending}
          >
            {expenseMutation.isPending
              ? "Submitting..."
              : expense
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </form>

      {isUpdateTag && selectedTag && (
        <TagForm tag={selectedTag} onClose={() => setIsUpdateTag(false)} />
      )}
      {isAddingTag && <TagForm onClose={() => setIsAddingTag(false)} />}
    </section>
  );
};

export default CreateExpense;
