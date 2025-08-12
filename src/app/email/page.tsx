"use client";

import { useState, useRef, ChangeEvent, useReducer, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Send,
  Upload,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Bot,
  Loader2,
  Paperclip,
  Wand2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { generateEmailContent } from "@/ai/flows/email-generation";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; 
import { emailSenderAll } from "@/services/email";

const RecipientInput = ({
  id,
  label,
  placeholder,
  recipients,
  onRecipientsChange,
  allowCsvUpload = false,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  recipients: string[];
  onRecipientsChange: (recipients: string[]) => void;
  allowCsvUpload?: boolean;
  error?: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const addRecipient = () => {
    const newRecipient = inputValue.trim();
    if (newRecipient && !recipients.includes(newRecipient)) {
      if (validateEmail(newRecipient)) {
        onRecipientsChange([...recipients, newRecipient]);
        setInputValue("");
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: `"${newRecipient}" is not a valid email address.`,
        });
      }
    }
  };

  const removeRecipient = (index: number) => {
    onRecipientsChange(recipients.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addRecipient();
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const csvEmails = text
          .split("\n")
          .filter((line) => line.trim() !== "")
          .flatMap((line) =>
            line
              .split(",")
              .map((email) => email.trim())
              .filter(Boolean)
          );

        const validEmails = csvEmails.filter(validateEmail);
        const invalidEmails = csvEmails.filter(
          (email) => !validateEmail(email)
        );

        const newEmails = validEmails.filter(
          (email) => !recipients.includes(email)
        );

        onRecipientsChange([...recipients, ...newEmails]);

        if (invalidEmails.length > 0) {
          toast({
            variant: "warning",
            title: "Some emails were invalid",
            description: `Could not import: ${invalidEmails.join(", ")}`,
          });
        }
        if (newEmails.length > 0) {
          toast({
            variant: "success",
            title: "Import Successful",
            description: `${newEmails.length} new email(s) added to ${label}.`,
          });
        } else {
          toast({
            variant: "info",
            title: "No new emails",
            description: `All emails from the file were already in the list or invalid.`,
          });
        }
      };
      reader.readAsText(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a .csv file.",
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={cn(error && "text-destructive")}>
        {label}
      </Label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            id={id}
            type="email"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={addRecipient}
            className={cn(error && "border-destructive")}
          />
          {allowCsvUpload && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="sr-only"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </>
          )}
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {recipients.length > 0 && (
          <ScrollArea className="h-20 w-full rounded-md border">
            <div className="p-2 space-x-1 space-y-1">
              {recipients.map((email, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm font-normal gap-1 pl-2 pr-1"
                >
                  {email}
                  <button
                    onClick={() => removeRecipient(index)}
                    className="rounded-full hover:bg-background/50 p-0.5"
                  >
                    <X className="size-3" />
                    <span className="sr-only">Remove {email}</span>
                  </button>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

function AIPromptDialog({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async () => {
    await onGenerate(prompt);
    onOpenChange(false);
    setPrompt("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="size-5" /> AI Email Generator
          </DialogTitle>
          <DialogDescription>Describe the email you want.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            id="ai-prompt-dialog"
            placeholder="e.g., 'An email to our beta users announcing a new feature that allows them to export their data. The tone should be excited and thankful.'"
            className="min-h-[150px] resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
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
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating..." : "Generate Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  toRecipients: z
    .array(z.string().email())
    .min(1, { message: "Please add at least one recipient." }),
  ccRecipients: z.array(z.string().email()).optional(),
  bccRecipients: z.array(z.string().email()).optional(),
  replyToRecipients: z.array(z.string().email()).optional(),
  subject: z.string().min(1, { message: "Subject is required." }),
  senderName: z.string().optional(),
  replyToSenderOnly: z.boolean().optional(),
  attachments: z.any().optional(),
  emailContent: z
    .string()
    .min(1, { message: "Email content cannot be empty." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EmailPage() {
  const [attachments, setAttachments] = useState<File[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      toRecipients: [],
      ccRecipients: [],
      bccRecipients: [],
      replyToRecipients: [],
      subject: "",
      senderName: "",
      replyToSenderOnly: false,
      emailContent: "",
    },
  });

  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const [activeBlockStyle, setActiveBlockStyle] = useState("p");

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    form.setValue(
      "emailContent",
      content === "<p><br></p>" || content === "<br>" ? "" : content,
      { shouldValidate: true }
    );
    setIsTyping(true);
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      const event = new Event("input", { bubbles: true });
      editorRef.current.dispatchEvent(event);
      forceUpdate();
    }
  };

  const isCommandActive = (command: string) => {
    if (typeof window !== "undefined" && document.queryCommandState) {
      try {
        return document.queryCommandState(command);
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  const checkActiveBlockStyle = () => {
    if (typeof window !== "undefined" && document) {
      let block = document.queryCommandValue("formatBlock").toLowerCase();
      if (["h1", "h2", "h3", "h4", "h5", "h6", "p"].includes(block)) {
        setActiveBlockStyle(block);
      } else {
        setActiveBlockStyle("p");
      }
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleSelectionChange = () => {
      checkActiveBlockStyle();
      forceUpdate(); // To re-render buttons
    };
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const handleSendEmail = async (values: FormValues) => {
    // const currentContent = editorRef.current?.innerHTML || "";
    setIsSending(true);
    try {
      const result: any = await emailSenderAll(values);
      console.log(result, "result");
      if (result)
        toast({
          variant: "success",
          title: "Email Sent!",
          description: "Your email has been successfully sent.",
        });
      setIsSending(false);
    } catch (error) {
      console.error("Error generating post:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate post. Please try again.",
      });
      setIsSending(false);
    }
    // form.reset();
    // if (editorRef.current) {
    //   editorRef.current.innerHTML = "";
    // }
    // setAttachments([]);
  };

  const handleGenerateEmail = async (prompt: string) => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Prompt",
        description: "Please provide a prompt for the AI to generate an email.",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateEmailContent({ prompt });
      form.setValue("emailContent", result.emailContent, {
        shouldValidate: true,
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = result.emailContent;
      }
      setIsTyping(false);
      toast({
        variant: "success",
        title: "Email Content Generated",
        description: "The AI has drafted an email for you.",
      });
    } catch (error) {
      console.error("Error generating email:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error generating the email content.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const emailContentValue = form.watch("emailContent");

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSendEmail)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                <Mail className="size-8" />
                Email Composer
              </CardTitle>
              <CardDescription>
                Craft and send emails to your audience. Use the AI generator or
                write your own.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="toRecipients"
                    render={({ field, fieldState }) => (
                      <RecipientInput
                        id="to-recipients"
                        label="To"
                        placeholder="Add 'To' recipients..."
                        recipients={field.value || []}
                        onRecipientsChange={field.onChange}
                        allowCsvUpload
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            id="subject"
                            placeholder="Your email subject"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ccRecipients"
                    render={({ field }) => (
                      <RecipientInput
                        id="cc-recipients"
                        label="CC"
                        placeholder="Add 'CC' recipients..."
                        recipients={field.value || []}
                        onRecipientsChange={field.onChange}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bccRecipients"
                    render={({ field }) => (
                      <RecipientInput
                        id="bcc-recipients"
                        label="BCC"
                        placeholder="Add 'BCC' recipients..."
                        recipients={field.value || []}
                        onRecipientsChange={field.onChange}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Name (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            id="sender-name"
                            placeholder="e.g., John Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="replyToRecipients"
                    render={({ field }) => (
                      <RecipientInput
                        id="reply-to-recipients"
                        label="Send Replies To (Optional)"
                        placeholder="Add reply-to addresses..."
                        recipients={field.value || []}
                        onRecipientsChange={field.onChange}
                      />
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="replyToSenderOnly"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Reply to Sender Only</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Force replies to only go to the sender.
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  /> */}
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emailContent"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Email Content</FormLabel>
                        <div
                          className={cn(
                            "rounded-md border border-input",
                            fieldState.error && "border-destructive"
                          )}
                        >
                          <div className="p-2 flex items-center space-x-1 border-b flex-wrap">
                            <Select
                              value={activeBlockStyle}
                              onValueChange={(value) =>
                                executeCommand("formatBlock", value)
                              }
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="p">
                                  <Pilcrow className="inline-block mr-2 h-4 w-4" />{" "}
                                  Paragraph
                                </SelectItem>
                                <SelectItem value="h1">
                                  <Heading1 className="inline-block mr-2 h-4 w-4" />{" "}
                                  Heading 1
                                </SelectItem>
                                <SelectItem value="h2">
                                  <Heading2 className="inline-block mr-2 h-4 w-4" />{" "}
                                  Heading 2
                                </SelectItem>
                                <SelectItem value="h3">
                                  <Heading3 className="inline-block mr-2 h-4 w-4" />{" "}
                                  Heading 3
                                </SelectItem>
                                <SelectItem value="h4">
                                  <Heading4 className="inline-block mr-2 h-4 w-4" />{" "}
                                  Heading 4
                                </SelectItem>
                                <SelectItem value="h5">
                                  <Heading5 className="inline-block mr-2 h-4 w-4" />{" "}
                                  Heading 5
                                </SelectItem>
                                <SelectItem value="h6">
                                  <Heading6 className="inline-block mr-2 h-4 w-4" />{" "}
                                  Heading 6
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Separator
                              orientation="vertical"
                              className="h-6 mx-2"
                            />
                            <Button
                              type="button"
                              variant={
                                isCommandActive("bold") ? "secondary" : "ghost"
                              }
                              size="icon"
                              onClick={() => executeCommand("bold")}
                            >
                              <Bold />
                            </Button>
                            <Button
                              type="button"
                              variant={
                                isCommandActive("italic")
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="icon"
                              onClick={() => executeCommand("italic")}
                            >
                              <Italic />
                            </Button>
                            <Button
                              type="button"
                              variant={
                                isCommandActive("underline")
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="icon"
                              onClick={() => executeCommand("underline")}
                            >
                              <Underline />
                            </Button>
                            <Separator
                              orientation="vertical"
                              className="h-6 mx-2"
                            />
                            <Button
                              type="button"
                              variant={
                                isCommandActive("insertUnorderedList")
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="icon"
                              onClick={() =>
                                executeCommand("insertUnorderedList")
                              }
                            >
                              <List />
                            </Button>
                            <Button
                              type="button"
                              variant={
                                isCommandActive("insertOrderedList")
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="icon"
                              onClick={() =>
                                executeCommand("insertOrderedList")
                              }
                            >
                              <ListOrdered />
                            </Button>
                            <Separator
                              orientation="vertical"
                              className="h-6 mx-2"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setIsAiDialogOpen(true)}
                            >
                              <Wand2 className="mr-2 h-4 w-4" />
                              Generate with AI
                            </Button>
                          </div>
                          <FormControl>
                            <div
                              ref={editorRef}
                              id="email-content"
                              contentEditable
                              onInput={handleContentChange}
                              onFocus={() => {
                                checkActiveBlockStyle();
                                setIsTyping(true);
                              }}
                              onBlur={() => setIsTyping(false)}
                              onKeyUp={checkActiveBlockStyle}
                              onMouseUp={checkActiveBlockStyle}
                              className={cn(
                                "prose dark:prose-invert prose-sm max-w-none h-[400px] overflow-y-auto w-full rounded-b-md bg-background px-4 py-3 text-base ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-start"
                              )}
                            />
                          </FormControl>
                          <div className="p-2 border-t">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() =>
                                attachmentInputRef.current?.click()
                              }
                            >
                              <Paperclip className="mr-2" />
                              Attach Files
                            </Button>
                            <input
                              type="file"
                              multiple
                              ref={attachmentInputRef}
                              className="sr-only"
                              onChange={handleAttachmentChange}
                            />
                            {attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                <Label>
                                  Attachments ({attachments.length})
                                </Label>
                                <div className="space-y-1">
                                  {attachments.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between text-sm p-1.5 rounded-md bg-accent/50 group"
                                    >
                                      <span className="truncate">
                                        {file.name}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0"
                                        onClick={() => removeAttachment(index)}
                                      >
                                        <X className="size-3.5" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                type="submit"
                disabled={!form.formState.isValid || isSending}
              >
                {isSending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isSending ? "Sending..." : "Send Email"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <AIPromptDialog
        open={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        onGenerate={handleGenerateEmail}
        isGenerating={isGenerating}
      />
    </main>
  );
}
