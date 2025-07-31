"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  validate?: (tag: string) => boolean;
  validationMessage?: string;
  maxTags?: number;
  error?: string;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      id,
      placeholder,
      className,
      tags,
      onTagsChange,
      validate,
      validationMessage = "Invalid input",
      maxTags,
      error,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const [localError, setLocalError] = React.useState<string | null>(null);

    const addTag = (tagToAdd: string) => {
      const newTag = tagToAdd.trim();

      if (!newTag) return;

      if (tags.includes(newTag)) return;

      if (validate && !validate(newTag)) {
        setLocalError(validationMessage);
        return;
      }

      if (maxTags && tags.length >= maxTags) {
        setLocalError(`You can add a maximum of ${maxTags} tags.`);
        return;
      }

      onTagsChange([...tags, newTag]);
      setInputValue("");
      setLocalError(null);
    };

    const removeTag = (tagToRemove: string) => {
      onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(inputValue);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text");
      const newTags = pasteData
        .split(/[,;\n]+/)
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (newTags.length > 0) {
        const allTags = [...tags];
        newTags.forEach((tag) => {
          if (!allTags.includes(tag)) {
            if (validate && !validate(tag)) {
              // Skip invalid tags on paste
            } else {
              allTags.push(tag);
            }
          }
        });
        onTagsChange(allTags);
        setInputValue("");
      }
    };

    return (
      <div>
        <div
          className={cn(
            "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            (error || localError) &&
              "border-destructive focus-within:ring-destructive",
            className
          )}
        >
          <div className="flex flex-wrap items-center gap-1 p-2 w-full">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm font-normal gap-1 pl-2 pr-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full hover:bg-background/50 p-0.5"
                >
                  <X className="size-3" />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </Badge>
            ))}
            <input
              id={id}
              ref={ref}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setLocalError(null);
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onBlur={() => addTag(inputValue)}
              className="bg-transparent outline-none flex-1 min-w-[100px] px-1 placeholder:text-muted-foreground"
              {...props}
            />
          </div>
        </div>
        {(error || localError) && (
          <p className="mt-2 text-sm font-medium text-destructive">
            {error || localError}
          </p>
        )}
      </div>
    );
  }
);
TagInput.displayName = "TagInput";
