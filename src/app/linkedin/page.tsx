import { SocialMediaKeywordGenerator } from "@/components/linkedin-keyword-generator";
import { SocialMediaPostComposer } from "@/components/linkedin-post-composer";

export default function LinkedinPage() {
    return (
        <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
            <h1 className="text-2xl font-headline font-semibold">Social Media Tools</h1>
            <div className="space-y-8">
                <SocialMediaKeywordGenerator />
                <SocialMediaPostComposer />
            </div>
        </main>
    )
}
