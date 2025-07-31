"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  Loader2,
  Send,
  PenSquare,
  Wand2,
  Image as ImageIcon,
  Briefcase,
  Facebook,
  Linkedin,
  ArrowRight,
  SkipForward,
  CheckCircle,
  Replace,
} from "lucide-react";
import { generateLinkedInPost } from "@/ai/flows/linkedin-post-generation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ui/image-upload";
import { TagInput } from "./ui/tag-input";
import { generateImageForPost } from "@/ai/flows/linkedin-image-generation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { reviewAndPostToLinkedIn } from "@/ai/flows/linkedin-review-and-post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { postToLinkedIn } from "@/services/linkedin";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.111 0-3.473.012-4.69.068-2.578.118-3.966 1.51-4.084 4.084-.056 1.217-.067 1.575-.067 4.69s.011 3.473.067 4.69c.118 2.577 1.506 3.966 4.084 4.084 1.217.056 1.575.067 4.69.067s3.473-.011 4.69-.067c2.578-.118 3.966-1.506 4.084-4.084.056-1.217.067-1.575-.067-4.69s-.011-3.473-.067-4.69c-.118-2.577-1.506-3.966-4.084-4.084-1.217-.056-1.575-.067-4.69-.067zm0 6.162c-2.304 0-4.173 1.869-4.173 4.173s1.869 4.173 4.173 4.173 4.173-1.869 4.173-4.173-1.869-4.173-4.173-4.173zm0 6.782c-1.442 0-2.609-1.167-2.609-2.609s1.167-2.609 2.609-2.609 2.609 1.167 2.609 2.609-1.167 2.609-2.609-2.609zm6.27-7.927c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25z" />
  </svg>
);

const imageSchema = z.object({
  name: z.string(),
  url: z.string(),
});
export type ImageObject = z.infer<typeof imageSchema>;

const postComposerSchema = z.object({
  postContent: z.string().min(1, { message: "Post content cannot be empty." }),
  keywords: z
    .array(z.string())
    .min(1, { message: "Please add at least one keyword or hashtag." }),
  images: z.array(imageSchema).optional(),
});

type PostComposerValues = z.infer<typeof postComposerSchema>;
type Platform = "all" | "linkedin" | "facebook" | "instagram" | "twitter";
const platformOrder: Exclude<Platform, "all" | "twitter">[] = [
  "linkedin",
  "facebook",
  "instagram",
];
type Vibe = "professional" | "casual" | "witty" | "inspiring";

function AIPromptDialog({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
  topic,
  setTopic,
  vibe,
  setVibe,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (topic: string, vibe: Vibe) => Promise<void>;
  isGenerating: boolean;
  topic: string;
  setTopic: (topic: string) => void;
  vibe: Vibe;
  setVibe: (vibe: Vibe) => void;
}) {
  const handleSubmit = async () => {
    await onGenerate(topic, vibe);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="size-5" /> AI Post Generator
          </DialogTitle>
          <DialogDescription>
            Describe the post you want to create. The AI will draft the content
            and suggest relevant keywords.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Textarea
            id="ai-prompt-dialog-topic"
            placeholder="e.g., 'The future of remote work and its impact on productivity and company culture...'"
            className="min-h-[150px] resize-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
          />
          <Select
            onValueChange={(value: Vibe) => setVibe(value)}
            value={vibe}
            disabled={isGenerating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a vibe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="witty">Witty</SelectItem>
              <SelectItem value="inspiring">Inspiring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ComposerFields({
  form,
  onGeneratePost,
  onGenerateImage,
  isGeneratingText,
  isGeneratingImage,
  isAiImage,
  onImagesChange,
  generatedImageHistory,
  onSelectFromHistory,
  platform,
}: {
  form: UseFormReturn<PostComposerValues>;
  onGeneratePost: () => void;
  onGenerateImage: (
    fieldOnChange: (value: { name: string; url: string }[] | null) => void
  ) => void;
  isGeneratingText: boolean;
  isGeneratingImage: boolean;
  isAiImage: boolean;
  onImagesChange: (
    fieldOnChange: (value: { name: string; url: string }[] | null) => void,
    images: { name: string; url: string }[] | null
  ) => void;
  generatedImageHistory: ImageObject[];
  onSelectFromHistory: (
    image: ImageObject,
    index: number,
    fieldOnChange: (value: { name: string; url: string }[] | null) => void
  ) => void;
  platform: Platform;
}) {
  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="postContent"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Post Content</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onGeneratePost}
                    disabled={isGeneratingText}
                  >
                    {isGeneratingText ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2" />
                    )}
                    {isGeneratingText ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind? Write your next engaging post here..."
                    className="min-h-[300px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywords"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Keywords / Hashtags</FormLabel>
                <FormControl>
                  <TagInput
                    id="keywords"
                    placeholder="Add hashtags and press Enter..."
                    tags={field.value || []}
                    onTagsChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </FormControl>
                <FormDescription>
                  Add relevant keywords or hashtags for your post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Attach Image</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onGenerateImage(field.onChange)}
                    disabled={isGeneratingImage || isGeneratingText}
                  >
                    {isGeneratingImage ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2" />
                    )}
                    {isGeneratingImage ? "Generating..." : "Generate AI Image"}
                  </Button>
                </div>

                <FormDescription>
                  Upload an image, or generate one with AI.
                </FormDescription>
                <FormControl>
                  <ImageUpload
                    value={field.value || null}
                    onFilesChange={(images) =>
                      onImagesChange(field.onChange, images)
                    }
                    className="w-full"
                    contentClassName="w-full"
                    loading={isGeneratingImage}
                    multiple={false}
                    isAiGenerated={isAiImage}
                    generatedImageHistory={generatedImageHistory}
                    onSelectFromHistory={(image, index) =>
                      onSelectFromHistory(image, index, field.onChange)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
}

export function SocialMediaPostComposer() {
  const [activePlatform, setActivePlatform] = useState<Platform>("all");
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const [postedPlatforms, setPostedPlatforms] = useState<
    Partial<Record<Platform, { status: "posted" | "skipped" }>>
  >({});

  const [isAiImage, setIsAiImage] = useState<Record<Platform, boolean>>({
    all: false,
    linkedin: false,
    facebook: false,
    instagram: false,
    twitter: false,
  });

  const [imageHistories, setImageHistories] = useState<
    Record<Platform, ImageObject[]>
  >({
    all: [],
    linkedin: [],
    facebook: [],
    instagram: [],
    twitter: [],
  });

  const [aiDialogTopic, setAiDialogTopic] = useState("");
  const [aiDialogVibe, setAiDialogVibe] = useState<Vibe>("professional");

  useEffect(() => {
    // Reset AI dialog state when the active platform changes
    setAiDialogTopic("");
    setAiDialogVibe("professional");
  }, [activePlatform]);

  const { toast } = useToast();

  const usePlatformForm = () =>
    useForm<PostComposerValues>({
      resolver: zodResolver(postComposerSchema),
      mode: "onChange",
      defaultValues: {
        postContent: "",
        keywords: [],
        images: [],
      },
    });

  const allPlatformsForm = usePlatformForm();
  const linkedinForm = usePlatformForm();
  const facebookForm = usePlatformForm();
  const instagramForm = usePlatformForm();
  const twitterForm = usePlatformForm();

  const platformForms: Record<Platform, UseFormReturn<PostComposerValues>> = {
    all: allPlatformsForm,
    linkedin: linkedinForm,
    facebook: facebookForm,
    instagram: instagramForm,
    twitter: twitterForm,
  };

  const activeForm = platformForms[activePlatform];

  const handleImagesChange = (
    fieldOnChange: (value: { name: string; url: string }[] | null) => void,
    images: { name: string; url: string }[] | null
  ) => {
    fieldOnChange(images);

    const platformsToUpdate: Platform[] =
      activePlatform === "all"
        ? ["all", "linkedin", "facebook", "instagram", "twitter"]
        : [activePlatform];

    platformsToUpdate.forEach((p) => {
      setIsAiImage((prev) => ({ ...prev, [p]: false }));
      setImageHistories((prev) => ({ ...prev, [p]: [] }));
      if (p !== activePlatform && images) {
        platformForms[p].setValue("images", images, { shouldValidate: true });
      }
    });
  };

  const handleGeneratePost = async (topic: string, vibe: Vibe) => {
    setIsGeneratingText(true);
    try {
      const result = await generateLinkedInPost({
        topic,
        vibe,
        postType: "image_post", // Always generate an image for versatility
      });

      const newImage = {
        name: `ai-generated-image-${Date.now()}.png`,
        url: result.imageUrl,
      };

      const platformsToUpdate: Platform[] =
        activePlatform === "all"
          ? ["all", "linkedin", "facebook", "instagram", "twitter"]
          : [activePlatform];

      platformsToUpdate.forEach((p) => {
        const form = platformForms[p];
        form.setValue("postContent", result.post, { shouldValidate: true });
        form.setValue("keywords", result.keywords, { shouldValidate: true });
        form.setValue("images", [newImage], { shouldValidate: true });
        setIsAiImage((prev) => ({ ...prev, [p]: true }));
        setImageHistories((prev) => ({ ...prev, [p]: [] }));
      });

      toast({
        variant: "success",
        title: "Content Generated",
        description:
          activePlatform === "all"
            ? "AI content and a relevant image have been populated across all tabs."
            : `AI content has been generated for the ${activePlatform} tab.`,
      });
    } catch (error) {
      console.error("Error generating post:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate post. Please try again.",
      });
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleGenerateImage = async (
    fieldOnChange: (value: ImageObject[] | null) => void
  ) => {
    const postContent = activeForm.getValues("postContent");

    if (!postContent || postContent.length < 20) {
      activeForm.setError("postContent", {
        type: "manual",
        message:
          "Please write or generate post content of at least 20 characters before creating an image.",
      });
      toast({
        variant: "warning",
        title: "Content Too Short",
        description:
          "Please provide more content to generate a relevant image.",
      });
      return;
    }

    setIsGeneratingImage(true);

    try {
      const result = await generateImageForPost({
        postContent,
        platform: activePlatform === "all" ? "linkedin" : activePlatform,
      });

      const newImage = {
        name: `ai-generated-image-${Date.now()}.png`,
        url: result.imageUrl,
      };

      const platformsToUpdate: Platform[] =
        activePlatform === "all"
          ? ["all", "linkedin", "facebook", "instagram", "twitter"]
          : [activePlatform];

      platformsToUpdate.forEach((p) => {
        const form = platformForms[p];
        const currentImgForPlatform = form.getValues("images");

        if (
          currentImgForPlatform &&
          currentImgForPlatform.length > 0 &&
          isAiImage[p]
        ) {
          setImageHistories((prev) => ({
            ...prev,
            [p]: [currentImgForPlatform[0], ...prev[p]].slice(0, 3),
          }));
        }

        form.setValue("images", [newImage], { shouldValidate: true });
        setIsAiImage((prev) => ({ ...prev, [p]: true }));
      });

      toast({
        variant: "success",
        title: "Image Generated",
        description: "The AI-generated image has been added.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        variant: "destructive",
        title: "Image Generation Failed",
        description: "An error occurred while creating the image.",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSelectFromHistory = (
    imageToPromote: ImageObject,
    indexToPromote: number,
    fieldOnChange: (value: ImageObject[] | null) => void
  ) => {
    const currentMainImage = activeForm.getValues("images");
    if (!currentMainImage || currentMainImage.length === 0) return;

    const currentHistory = imageHistories[activePlatform];
    const newHistory = currentHistory.filter((_, i) => i !== indexToPromote);
    newHistory.unshift(currentMainImage[0]);

    const platformsToUpdate: Platform[] =
      activePlatform === "all"
        ? ["all", "linkedin", "facebook", "instagram", "twitter"]
        : [activePlatform];

    platformsToUpdate.forEach((p) => {
      setImageHistories((prev) => ({ ...prev, [p]: newHistory.slice(0, 3) }));
      platformForms[p].setValue("images", [imageToPromote], {
        shouldValidate: true,
      });
    });
  };

  const handlePostSubmit = async (values: PostComposerValues) => {
    setIsPosting(true);
    try {
      const reviewResult = await reviewAndPostToLinkedIn({
        postContent: values.postContent,
        keywords: values.keywords,
        imageUrl: values.images?.[0]?.url,
        platform: activePlatform,
      });

      toast({
        variant: "info",
        title: "AI Review Complete",
        description: reviewResult.reviewNotes,
      });

      if (reviewResult.success) {
        const postResult = await postToLinkedIn({
          postBody: reviewResult.postBody,
          imageUrl: values.images?.[0]?.url,
          platform: activePlatform,
        });

        if (postResult.success) {
          toast({
            variant: "success",
            title: `Post to ${activePlatform} Successful!`,
            description: "Check your social media to see your post live!",
          });
          setPostedPlatforms((prev) => ({
            ...prev,
            [activePlatform]: { status: "posted" },
          }));
          activeForm.reset();
          setImageHistories((prev) => ({ ...prev, [activePlatform]: [] }));
          setIsAiImage((prev) => ({ ...prev, [activePlatform]: false }));
        } else {
          toast({
            variant: "destructive",
            title: "Post Failed",
            description: "The post could not be sent. Please try again.",
          });
        }
      } else {
        toast({
          variant: "warning",
          title: "Post Not Published",
          description:
            "The AI reviewer suggested changes. Please review the feedback and try again.",
        });
      }
    } catch (error) {
      console.error("Error during posting process:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description:
          "There was a problem during the review or posting process. Please try again.",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleNext = (skipped: boolean = false) => {
    const currentPlatform = activePlatform as Exclude<
      Platform,
      "all" | "twitter"
    >;
    if (skipped) {
      setPostedPlatforms((prev) => ({
        ...prev,
        [currentPlatform]: { status: "skipped" },
      }));
    }

    const currentIndex = platformOrder.indexOf(currentPlatform);
    const isLastPlatform = currentIndex === platformOrder.length - 1;

    if (!isLastPlatform) {
      const nextPlatform = platformOrder[currentIndex + 1];
      setActivePlatform(nextPlatform);
    } else {
      // This is the "Done" case
      [
        allPlatformsForm,
        linkedinForm,
        facebookForm,
        instagramForm,
        twitterForm,
      ].forEach((form) => form.reset());
      setPostedPlatforms({});
      setActivePlatform("all");
      setImageHistories({
        all: [],
        linkedin: [],
        facebook: [],
        instagram: [],
        twitter: [],
      });
      setIsAiImage({
        all: false,
        linkedin: false,
        facebook: false,
        instagram: false,
        twitter: false,
      });
      toast({
        title: "All Posts Submitted!",
        description: "You have successfully posted to all selected platforms.",
        variant: "success",
      });
    }
  };

  const platformTabContent = (platform: Platform) => {
    const formInstance = platformForms[platform];
    const platformStatus = postedPlatforms[platform]?.status;
    const currentPlatformIndex = platformOrder.indexOf(platform as any);
    const isLastPlatform = currentPlatformIndex === platformOrder.length - 1;

    const getButtons = () => {
      if (platformStatus === "posted") {
        if (isLastPlatform) {
          return (
            <Button type="button" onClick={() => handleNext(false)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Done
            </Button>
          );
        }
        return (
          <Button type="button" onClick={() => handleNext(false)}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        );
      }

      return (
        <div className="flex gap-2">
          {!isLastPlatform && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleNext(true)}
            >
              Skip
              <SkipForward className="mr-2 h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              isPosting ||
              isGeneratingText ||
              isGeneratingImage ||
              !formInstance.formState.isValid
            }
          >
            {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="mr-2 h-4 w-4" />
            {isPosting ? "Posting..." : "Review & Post"}
          </Button>
        </div>
      );
    };

    return (
      <form onSubmit={formInstance.handleSubmit(handlePostSubmit)}>
        <CardContent className="p-6">
          <ComposerFields
            form={formInstance}
            onGeneratePost={() => setIsAiDialogOpen(true)}
            onGenerateImage={handleGenerateImage}
            isGeneratingText={isGeneratingText}
            isGeneratingImage={isGeneratingImage}
            isAiImage={isAiImage[platform]}
            onImagesChange={handleImagesChange}
            generatedImageHistory={imageHistories[platform]}
            onSelectFromHistory={handleSelectFromHistory}
            platform={platform}
          />
        </CardContent>
        {platform !== "all" && (
          <CardFooter className="px-6 pb-6 pt-0 justify-end">
            {getButtons()}
          </CardFooter>
        )}
        {platform === "all" && (
          <CardFooter className="px-6 pb-6 pt-0 justify-end">
            <Button
              type="button"
              onClick={() => setActivePlatform("linkedin")}
              disabled={isGeneratingText || isGeneratingImage}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </form>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <PenSquare className="size-8" />
            Social Media Post Composer
          </CardTitle>
          <CardDescription>
            Use the "All Platforms" tab to generate a base post, then customize
            and publish it for each platform.
          </CardDescription>
          <Tabs
            defaultValue="all"
            value={activePlatform}
            onValueChange={(value) => setActivePlatform(value as Platform)}
            className="pt-4"
          >
            <TabsList>
              <TabsTrigger value="all">
                <Briefcase className="mr-2" />
                All Platforms
              </TabsTrigger>
              <TabsTrigger value="linkedin">
                <Linkedin className="mr-2" />
                LinkedIn
              </TabsTrigger>
              <TabsTrigger value="facebook">
                <Facebook className="mr-2" />
                Facebook
              </TabsTrigger>
              <TabsTrigger value="instagram">
                <InstagramIcon className="mr-2 size-4" />
                Instagram
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <Tabs
          defaultValue="all"
          value={activePlatform}
          onValueChange={(value) => setActivePlatform(value as Platform)}
        >
          <TabsContent value="all" className="p-0 m-0">
            {platformTabContent("all")}
          </TabsContent>
          <TabsContent value="linkedin" className="p-0 m-0">
            {platformTabContent("linkedin")}
          </TabsContent>
          <TabsContent value="facebook" className="p-0 m-0">
            {platformTabContent("facebook")}
          </TabsContent>
          <TabsContent value="instagram" className="p-0 m-0">
            {platformTabContent("instagram")}
          </TabsContent>
        </Tabs>
      </Card>
      <AIPromptDialog
        open={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        onGenerate={handleGeneratePost}
        isGenerating={isGeneratingText}
        topic={aiDialogTopic}
        setTopic={setAiDialogTopic}
        vibe={aiDialogVibe}
        setVibe={setAiDialogVibe}
      />
    </>
  );
}
