import React, { useState } from "react";

import { getTagsQueryOption } from "@/lib/api";

import { TagAddForm } from "./TagAddForm";
import { TagEditForm } from "./TagEditForm";

import { useQuery } from "@tanstack/react-query";
import { FieldError, UseFormRegister } from "react-hook-form";

import { TagType } from "@/types/types";

import { Button } from "@/components/ui/button";

import { Edit2 } from "lucide-react";

type TagsSelectionProps = {
  register: UseFormRegister<{
    tagId: number;
    amount: string;
    date?: string | undefined;
  }>;
  error: FieldError | undefined;
  value: number | undefined;
};

const TagsSelection: React.FC<TagsSelectionProps> = ({
  register,
  error,
  value,
}) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isUpdateTag, setIsUpdateTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagType>();

  const { data, isLoading } = useQuery(getTagsQueryOption);

  if (isLoading) return <div>Loading tags...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.tags.map((tag: TagType) => (
        <div
          key={tag.id}
          className={`relative group flex items-center justify-center w-20 h-20 border rounded-lg transition-colors ${
            Number(value) === tag.id
              ? "border-primary bg-primary/10"
              : "hover:border-primary"
          }`}
        >
          <input
            type="radio"
            id={String(tag.id)}
            value={String(tag.id)}
            className="hidden"
            {...register("tagId")}
          />
          <label
            htmlFor={String(tag.id)}
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            <span className="mb-2 text-3xl">{tag.tagEmoji}</span>
            <span className="max-w-full px-1 overflow-hidden text-sm text-nowrap text-ellipsis">
              {tag.tagName}
            </span>
          </label>
          <div className="absolute transition-opacity opacity-0 top-2 right-2 group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => {
                setSelectedTag(tag);
                setIsUpdateTag(true);
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      {isUpdateTag && selectedTag && (
        <TagEditForm tag={selectedTag} setIsUpdateTag={setIsUpdateTag} />
      )}
      {isAddingTag ? (
        <TagAddForm setIsAddingTag={setIsAddingTag} />
      ) : (
        <Button
          onClick={() => setIsAddingTag(true)}
          className="h-20 max-h-full col-span-1 "
          variant="outline"
        >
          Add +
        </Button>
      )}
      {error && (
        <p className="col-span-3 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default TagsSelection;
