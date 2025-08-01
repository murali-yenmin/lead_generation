
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Copy, Bot, Loader2, Clipboard, Tags } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { generateSocialMediaKeywords, SocialMediaKeywordGenerationOutput } from '@/ai/flows/social-media-keyword-generation';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
  numberOfKeywords: z.coerce.number().min(1).max(25),
});

type FormValues = z.infer<typeof formSchema>;
type Platform = keyof SocialMediaKeywordGenerationOutput & string;

export function SocialMediaKeywordGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<SocialMediaKeywordGenerationOutput | null>(null);
  const [activeTab, setActiveTab] = useState<Platform>('linkedin');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      numberOfKeywords: 10,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setKeywords(null);
    try {
      const result = await generateSocialMediaKeywords(values);
      setKeywords(result);
      toast({
        variant: 'success',
        title: 'Keywords Generated',
        description: `Successfully generated keywords for all platforms.`,
      });
    } catch (error: any) {
      console.error('Error generating keywords:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate keywords. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: `${type} has been copied.`,
    });
  };

  const handleCopyAll = () => {
    if (!keywords || !keywords[activeTab]) return;
    
    const keywordsToCopy = keywords[activeTab].join(', ');
    const platformName = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    copyToClipboard(keywordsToCopy, `All ${platformName} keywords`);
  };

  const KeywordDisplay = ({ platform }: { platform: Platform }) => {
    const platformKeywords = keywords ? keywords[platform] : [];
    
    if (isLoading) {
      return (
        <div className="p-1 space-y-2 ">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-2 p-2 rounded-md bg-accent/50">
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          ))}
        </div>
      );
    }

      if (!keywords || platformKeywords.length === 0) {
      return (
        <div className="flex w-full items-center justify-center h-[390px]">
            <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                <Tags className="size-10" />
                <p>Your keywords for {platform.charAt(0).toUpperCase() + platform.slice(1)} will appear here.</p>
            </div>
        </div>
      );
    }

    return (
      <div className="p-1 space-y-2">
        {platformKeywords.map((keyword: string, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 p-2 rounded-md bg-accent/50 group"
          >
            <Badge variant="secondary" className="text-sm font-normal">
              {keyword}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => copyToClipboard(keyword, `'${keyword}'`)}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy keyword</span>
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="p-0 mb-6">
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Bot className="size-6" />
                  AI Keyword Generator
                </CardTitle>
                <CardDescription>
                  Generate relevant keywords and hashtags for LinkedIn, Instagram and  Facebook based on your audience or content.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Audience or Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'B2B SaaS founders in the fintech industry looking for scaling strategies'"
                          className="min-h-[200px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords per Platform</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Generating...' : 'Generate Keywords'}
                </Button>
              </CardContent>
            </form>
          </Form>
        </div>
        <div className="border-t lg:border-l lg:border-t-0 p-6">
            <CardTitle className="font-headline mb-4">
                Generated Keywords
              </CardTitle>
          <Tabs defaultValue="linkedin" onValueChange={(value) => setActiveTab(value as Platform)}>
            <div className="flex justify-between items-center mb-4">
                 <TabsList>
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="instagram">Instagram</TabsTrigger>
                    <TabsTrigger value="facebook">Facebook</TabsTrigger>
                    {/* <TabsTrigger value="twitter">Twitter</TabsTrigger> */}
                </TabsList>
                {keywords && !isLoading && (
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAll}
                    >
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy All
                    </Button>
                )}
            </div>
            <ScrollArea className="h-[390px] w-full">
                <TabsContent value="linkedin"><KeywordDisplay platform="linkedin" /></TabsContent>
                <TabsContent value="instagram"><KeywordDisplay platform="instagram" /></TabsContent>
                <TabsContent value="facebook"><KeywordDisplay platform="facebook" /></TabsContent>
                <TabsContent value="twitter"><KeywordDisplay platform="twitter" /></TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </Card>
  );
}
