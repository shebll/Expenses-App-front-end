import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { Smile } from "lucide-react";

import { TagFormValues, addTagSchema } from "@/types/types";

export const TagAddForm = ({
  setIsAddingTag,
}: {
  setIsAddingTag: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<TagFormValues>({
    resolver: zodResolver(addTagSchema),
    defaultValues: {
      tagName: "",
      tagEmoji: "",
    },
  });

  const createTagMutation = useMutation({
    mutationFn: (newTag: TagFormValues) => api.post(`tags`, newTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setIsAddingTag(false);
    },
    onError: (error) => {
      console.error("Error creating tag:", error);
    },
  });

  const onSubmit: SubmitHandler<TagFormValues> = (data) => {
    console.log(data);
    createTagMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black bg-opacity-90">
      <div className="rounded-lg shadow-lg w-96">
        <form>
          <h2 className="mb-4 text-xl font-semibold">Add New Tag</h2>
          <div className="flex flex-col gap-4">
            <div>
              <Input {...register("tagName")} placeholder="New tag name" />
              {errors.tagName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.tagName.message}
                </p>
              )}
            </div>
            <div className="relative">
              <Controller
                name="tagEmoji"
                control={control}
                render={({ field }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    className="justify-start w-full"
                  >
                    <Smile className="w-4 h-4 mr-2" />
                    {field.value || "Select emoji"}
                  </Button>
                )}
              />
              {errors.tagEmoji && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.tagEmoji.message}
                </p>
              )}
              {isEmojiPickerOpen && (
                <div className="absolute z-50 mt-2">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: { native: string }) => {
                      setValue("tagEmoji", emoji.native);
                      setIsEmojiPickerOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-between gap-2">
              <Button
                type="button"
                onClick={() => setIsAddingTag(false)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={createTagMutation.isPending}
                className="w-full"
              >
                {createTagMutation.isPending ? "Adding..." : "Add Tag"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
