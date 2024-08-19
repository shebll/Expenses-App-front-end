import React, { useState /* useEffect */ } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import {
  TagType,
  TagFormValues,
  addTagSchema,
  // updateTagSchema,
} from "@/types/types";
import axios from "axios";

interface TagFormProps {
  tag?: TagType;
  onClose: () => void;
}

export const TagForm: React.FC<TagFormProps> = ({ tag, onClose }) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    // reset,
  } = useForm<TagFormValues>({
    resolver: zodResolver(addTagSchema),
    defaultValues: tag
      ? { tagName: tag.tagName, tagEmoji: tag.tagEmoji }
      : { tagName: "", tagEmoji: "" },
  });

  // useEffect(() => {
  //   if (tag) {
  //     reset({ tagName: tag.tagName, tagEmoji: tag.tagEmoji });
  //   }
  // }, [tag, reset]);

  const tagMutation = useMutation({
    mutationFn: (data: TagFormValues) =>
      tag ? api.put(`tags/${tag.id}`, data) : api.post(`tags`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      onClose();
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        setError("root", {
          message: `Error: ${error.response?.data.message || error.message}`,
        });
      } else {
        setError("root", {
          message: "An unexpected error occurred",
        });
      }
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (tagId: number) => api.delete(`tags/${tagId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      onClose();
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        setError("root", {
          message: `Error: ${error.response?.data.message || error.message}`,
        });
      } else {
        setError("root", {
          message: "An unexpected error occurred",
        });
      }
    },
  });

  const onSubmit: SubmitHandler<TagFormValues> = (data) => {
    console.log(data);
    console.log("Form submitted");
    tagMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/50">
      <div className="rounded-lg shadow-lg w-96">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="mb-4 text-xl font-semibold">
            {tag ? "Update Tagsad" : "Add New Tag"}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <Input {...register("tagName")} placeholder="Tag name" />
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
            {errors.root && (
              <p className="text-sm text-red-500">{errors.root.message}</p>
            )}
            <div className="flex justify-between gap-2">
              <Button
                type="submit"
                disabled={tagMutation.isPending}
                className="w-full"
              >
                {tagMutation.isPending
                  ? tag
                    ? "Updating..."
                    : "Adding..."
                  : tag
                    ? "Update Tag"
                    : "Add Tag"}
              </Button>
              {tag && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => deleteTagMutation.mutate(tag.id)}
                  disabled={deleteTagMutation.isPending}
                >
                  {deleteTagMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              )}
              <Button type="button" onClick={onClose} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
