"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateGoogleAdsText } from "@/ai/flows/google-ads-generation";
import { generateGoogleAdsImage } from "@/ai/flows/google-ads-image-generation";
import { generateGoogleAdsTags } from "@/ai/flows/google-ads-tag-generation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Bot,
  Loader2,
  Megaphone,
  Wand2,
  Copy,
  Image as ImageIcon,
  Video,
  Search,
  X,
  Download,
  Tags,
  Clipboard,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { TagInput } from "./ui/tag-input";

const tagFormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

function GoogleAdsTagGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: TagFormValues) => {
    setIsLoading(true);
    setTags([]);
    try {
      const result = await generateGoogleAdsTags({
        prompt: values.prompt,
        numberOfTags: 20,
      });
      setTags(result.tags);
      toast({
        variant: "success",
        title: "Tags Generated",
        description: `Successfully generated ${result.tags.length} new tags.`,
      });
    } catch (error) {
      console.error("Error generating tags:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate tags. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Tags className="size-6" />
          AI Keyword/Tag Generator
        </CardTitle>
        <CardDescription>
          Describe your product, service, or campaign goal to generate relevant
          keywords and tags for your Google Ads.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product/Service Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'A modern, all-in-one toolkit for digital marketers to generate leads through AI-powered content for LinkedIn, Google Ads, and email campaigns.'"
                          className="min-h-[200px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isLoading ? "Generating Tags..." : "Generate Tags"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium font-headline">
                Generated Keywords
              </h3>
              {tags.length > 0 && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(tags.join("\n"), "All keywords")
                  }
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              )}
            </div>

            <div className="relative h-96">
              <ScrollArea className="h-full w-full rounded-md border">
                <div className="p-4 space-y-2">
                  {isLoading && (
                    <>
                      {[...Array(10)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-2/3" />
                      ))}
                    </>
                  )}
                  {!isLoading &&
                    tags.length > 0 &&
                    tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 p-2 rounded-md bg-accent/50 group"
                      >
                        <span className="text-sm">{tag}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 opacity-50 group-hover:opacity-100"
                          onClick={() => copyToClipboard(tag, `'${tag}'`)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy tag</span>
                        </Button>
                      </div>
                    ))}
                  {!isLoading && tags.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground p-8">
                        <Tags className="mx-auto size-12" />
                        <p className="mt-4 text-sm">
                          Your generated tags will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const searchFormSchema = z.object({
  productDescription: z.string().min(20, {
    message: "Product description must be at least 20 characters.",
  }),
  targetAudience: z.string().min(10, {
    message: "Target audience must be at least 10 characters.",
  }),
  keywords: z.array(z.string()).min(1, {
    message: "Please provide at least one keyword.",
  }),
  brandName: z.string().optional(),
  callToAction: z.string().optional(),
  promotions: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface AdVariation {
  headlines: string[];
  descriptions: string[];
}

function SearchCampaignGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [adVariations, setAdVariations] = useState<AdVariation[]>([
    {
      headlines: [
        "AI-Powered Social Media",
        "Automate Your Content",
        "Boost Your Online Presence",
      ],
      descriptions: [
        "Our AI platform automates content creation, scheduling, and analytics. Save time & grow faster.",
        "Get stunning visuals and engaging copy in minutes. Perfect for small businesses. Try it free!",
      ],
    },
    {
      headlines: [
        "Effortless Content Creation",
        "Your Social Media on Autopilot",
        "Smart AI for Social Media",
      ],
      descriptions: [
        "From post ideas to final publication, our AI handles it all. Focus on what you do best.",
        "Attract more followers and customers with consistently great content. Sign up today!",
      ],
    },
  ]);
  const { toast } = useToast();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      productDescription: "",
      targetAudience: "",
      keywords: [],
      brandName: "",
      callToAction: "",
      promotions: "",
    },
  });

  const onSubmit = async (values: SearchFormValues) => {
    setIsLoading(true);
    setAdVariations([]);
    try {
      const result = await generateGoogleAdsText({
        ...values,
        keywords: values.keywords.join(", "),
      });
      setAdVariations(result.adVariations);
    } catch (error) {
      console.error("Error generating ads:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate ad copy. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied.`,
    });
  };

  const removeAdVariation = (indexToRemove: number) => {
    setAdVariations(adVariations.filter((_, index) => index !== indexToRemove));
    toast({
      title: "Ad Variation Removed",
      description: `Variation ${indexToRemove + 1} has been removed.`,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mt-6">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product/Service Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'An AI-powered platform that automates social media content creation for small businesses.'"
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Marketing managers at startups, small business owners, social media influencers.'"
                      className="min-h-[80px] resize-none"
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
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <TagInput
                      id="keywords"
                      placeholder="Add keywords and press Enter..."
                      tags={field.value}
                      onTagsChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your main keywords. You can also paste comma-separated
                    values.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand/Product Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SocialAutoPost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="callToAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call to Action (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Try for Free" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="promotions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotions/Offers (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 20% off for new users"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Wand2 className="mr-2 h-4 w-4" />
              {isLoading ? "Generating Ads..." : "Generate Ad Copy"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium font-headline">
          Generated Ad Variations
        </h3>
        {isLoading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border space-y-3">
                <div className="w-1/3 h-5 rounded-md bg-muted animate-pulse" />
                <div className="w-full h-4 rounded-md bg-muted animate-pulse" />
                <div className="w-5/6 h-4 rounded-md bg-muted animate-pulse" />
                <Separator className="my-2" />
                <div className="w-1/4 h-5 rounded-md bg-muted animate-pulse" />
                <div className="w-full h-4 rounded-md bg-muted animate-pulse" />
                <div className="w-full h-4 rounded-md bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        )}
        {!isLoading && adVariations.length === 0 && (
          <div className="flex items-center justify-center h-full rounded-lg border border-dashed">
            <div className="text-center text-muted-foreground p-8">
              <Megaphone className="mx-auto size-12" />
              <p className="mt-4 text-sm">
                Your generated ad copy will appear here.
              </p>
            </div>
          </div>
        )}
        {!isLoading && adVariations.length > 0 && (
          <ScrollArea className="h-[600px] w-full pr-4">
            <div className="space-y-6">
              {adVariations.map((ad, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-base">
                      Ad Variation {index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeAdVariation(index)}
                    >
                      <X className="size-4" />
                      <span className="sr-only">Delete variation</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 space-y-6">
                    <div className="p-4 rounded-lg border bg-background shadow-sm">
                      <h4 className="text-blue-700 text-lg font-medium hover:underline cursor-pointer">
                        {ad.headlines[0]} | {ad.headlines[1]}
                      </h4>
                      <p className="text-sm text-green-700">yourwebsite.com</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {ad.descriptions[0]}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Headlines</h4>
                      <div className="space-y-2">
                        {ad.headlines.map((h, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-sm p-2 rounded-md bg-accent/50 group"
                          >
                            <span className="text-muted-foreground">
                              {i + 1}.
                            </span>
                            <span className="flex-1 px-2">{h}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-50 group-hover:opacity-100"
                              onClick={() => copyToClipboard(h, "Headline")}
                            >
                              <Copy className="size-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">
                        Descriptions
                      </h4>
                      <div className="space-y-2">
                        {ad.descriptions.map((d, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-sm p-2 rounded-md bg-accent/50 group"
                          >
                            <span className="text-muted-foreground">
                              {i + 1}.
                            </span>
                            <span className="flex-1 px-2">{d}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-50 group-hover:opacity-100"
                              onClick={() => copyToClipboard(d, "Description")}
                            >
                              <Copy className="size-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

const displayFormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

type DisplayFormValues = z.infer<typeof displayFormSchema>;

function DisplayCampaignGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: DisplayFormValues) => {
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const result = await generateGoogleAdsImage(values);
      setGeneratedImage(result.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "generated-ad-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Image Downloaded",
      description: "The ad image has been saved to your computer.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
      <div className="flex flex-col space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 space-y-6"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col">
                  <FormLabel>Image Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'A vibrant and colorful illustration of a person joyfully using a new mobile app on their phone, with abstract shapes in the background.'"
                      className="resize-none flex-1"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the image you want to create for your display ad.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-fit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Wand2 className="mr-2 h-4 w-4" />
              {isLoading ? "Generating Image..." : "Generate Image"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium font-headline">Generated Image</h3>
        <div className="relative aspect-video w-full rounded-lg border border-dashed flex items-center justify-center bg-muted/50 overflow-hidden">
          {isLoading && (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Skeleton className="h-full w-full" />
              <p className="absolute text-sm">
                Generating your image, please wait...
              </p>
            </div>
          )}
          {!isLoading && !generatedImage && (
            <div className="text-center text-muted-foreground p-8">
              <ImageIcon className="mx-auto size-12" />
              <p className="mt-4 text-sm">
                Your generated image will appear here.
              </p>
            </div>
          )}
          {!isLoading && generatedImage && (
            <>
              <Image
                src={generatedImage}
                alt="Generated display ad image"
                layout="fill"
                objectFit="contain"
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button onClick={downloadImage} size="sm">
                  <Download className="mr-2" />
                  Download
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaceholderContent({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-center h-96 rounded-lg border border-dashed mt-6">
      <div className="text-center text-muted-foreground p-8">
        <Icon className="mx-auto size-12" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm">{description}</p>
      </div>
    </div>
  );
}

export function GoogleAdsGenerator() {
  return (
    <div className="space-y-8">
      <GoogleAdsTagGenerator />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <Megaphone className="size-8" />
            Google Ads Campaign Asset Generator
          </CardTitle>
          <CardDescription>
            Create compelling ad copy and assets for your Google Ads campaigns.
            Choose a campaign type to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search">
            <TabsList>
              <TabsTrigger value="search">
                <Search className="mr-2" />
                Search
              </TabsTrigger>
              <TabsTrigger value="display">
                <ImageIcon className="mr-2" />
                Display
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video className="mr-2" />
                Video (YouTube)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="search">
              <Alert className="mt-4">
                <AlertTitle className="font-semibold">
                  Search Campaign Ads
                </AlertTitle>
                <AlertDescription>
                  Generate compelling text ads for Google Search. Provide
                  details about your product, audience, and keywords to create
                  effective ad copy that drives clicks.
                </AlertDescription>
              </Alert>
              <SearchCampaignGenerator />
            </TabsContent>
            <TabsContent value="display">
              <Alert className="mt-4">
                <AlertTitle className="font-semibold">
                  Display Ad Image Generator
                </AlertTitle>
                <AlertDescription>
                  Create eye-catching images for your Google Display Network
                  campaigns. Describe the visual you have in mind and let the AI
                  bring it to life.
                </AlertDescription>
              </Alert>
              <DisplayCampaignGenerator />
            </TabsContent>
            <TabsContent value="video">
              <PlaceholderContent
                icon={Video}
                title="Video Ad (YouTube) Generator Coming Soon"
                description="This feature will help you script and conceptualize engaging video ads for YouTube."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
