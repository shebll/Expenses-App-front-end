import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import { TagType, updateTagSchema } from "@/types/types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const TagEditForm = ({
  tag,
  setIsUpdateTag,
}: {
  setIsUpdateTag: React.Dispatch<React.SetStateAction<boolean>>;
  tag: TagType;
}) => {
  console.log(tag);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    register,
  } = useForm<TagType>({
    resolver: zodResolver(updateTagSchema),
    defaultValues: {
      tagName: tag.tagName,
      tagEmoji: tag.tagEmoji,
      id: tag.id,
    },
  });

  const queryClient = useQueryClient();
  const updateTagMutation = useMutation({
    mutationFn: (updatedTag: TagType) =>
      api.put(`tags/${updatedTag.id}`, updatedTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (tagId: number) => api.delete(`tags/${tagId}`),
    onSuccess: () => {
      setIsUpdateTag(false);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const onSubmit: SubmitHandler<TagType> = (data) => {
    console.log("data");
    updateTagMutation.mutate(data);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/50">
      <div className="rounded-lg shadow-lg w-96">
        <form>
          <h2 className="mb-4 text-xl font-semibold">Update Tag</h2>
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
                onClick={handleSubmit(onSubmit)}
                disabled={updateTagMutation.isPending}
                className="w-full"
              >
                Update
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={() => deleteTagMutation.mutate(tag.id)}
                disabled={deleteTagMutation.isPending}
              >
                Delete
              </Button>
              <Button
                type="button"
                onClick={() => setIsUpdateTag(false)}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
