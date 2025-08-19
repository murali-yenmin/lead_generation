
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { TrendingUp, BarChart2, Users, MessageSquare, ThumbsUp, Repeat, Star, MousePointerClick, CalendarIcon, Facebook, Linkedin } from 'lucide-react';
import { fetchSocialPosts, setPlatformFilter, setDateRange, SocialPost, AnalyticsSummary } from '@/store/slices/socialPostsSlice';
import Image from 'next/image';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.111 0-3.473.012-4.69.068-2.578.118-3.966 1.51-4.084 4.084-.056 1.217-.067 1.575-.067 4.69s.011 3.473.067 4.69c.118 2.577 1.506 3.966 4.084 4.084 1.217.056 1.575.067 4.69.067s3.473-.011 4.69-.067c2.578-.118 3.966-1.506 4.084-4.084.056-1.217.067-1.575.067-4.69s-.011-3.473-.067-4.69c-.118-2.577-1.506-3.966-4.084-4.084-1.217-.056-1.575-.067-4.69-.067zm0 6.162c-2.304 0-4.173 1.869-4.173 4.173s1.869 4.173 4.173 4.173 4.173-1.869 4.173-4.173-1.869-4.173-4.173-4.173zm0 6.782c-1.442 0-2.609-1.167-2.609-2.609s1.167-2.609 2.609-2.609 2.609 1.167 2.609 2.609-1.167 2.609-2.609-2.609zm6.27-7.927c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25z" />
  </svg>
);


function AnalyticsSummaryCard({ title, value, icon, isLoading }: { title: string, value: string | number, icon: React.ReactNode, isLoading: boolean }) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-4 w-28 mt-1" />
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
            </CardContent>
        </Card>
    )
}

function Filters({ className }: { className?: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const { platformFilter, dateRange } = useSelector((state: RootState) => state.socialPosts);

    const handleDateChange = (range: DateRange | undefined) => {
        dispatch(setDateRange({ from: range?.from, to: range?.to }));
    };

    return (
        <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
             <Select value={platformFilter} onValueChange={(value) => dispatch(setPlatformFilter(value))}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by platform..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-full sm:w-[300px] justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}


export default function SocialMediaAnalyticsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { posts, totalPosts, summary, isLoading, error, platformFilter, dateRange } = useSelector((state: RootState) => state.socialPosts);
    const { token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(fetchSocialPosts());
        }
    }, [dispatch, token, platformFilter, dateRange]);


    const platformIcons: { [key: string]: React.ReactNode } = {
        linkedin: <Linkedin className="size-4 text-blue-700" />,
        facebook: <Facebook className="size-4 text-blue-600" />,
        instagram: <InstagramIcon className="size-4 text-pink-500" />,
        twitter: <TwitterIcon className="size-4" />,
    };

    const columns = useMemo<ColumnDef<SocialPost>[]>(() => [
        {
            accessorKey: 'postContent',
            header: 'Post',
            cell: ({ row }) => { 
                const post = row.original;
                const imageUrl = post.analytics.imageUrl || post.imageUrl;
                const postContent = post.analytics.postContent || post.postContent;
                return (
                    <div className="flex items-start gap-4">
                        {imageUrl && (
                             <div className="size-16 rounded-md overflow-hidden shrink-0">
                                <Image src={imageUrl} alt="Post image" width={64} height={64} className="object-cover h-full w-full" />
                             </div>
                        )}
                        <div className="space-y-1 max-w-[400px]">
                            <p className="line-clamp-2 text-sm font-medium">{postContent}</p>
                            <div className="flex items-center gap-2">
                                {platformIcons[post.platform.slice(0,400).toLowerCase()]}
                                <p className="text-xs text-muted-foreground">{format(new Date(post.postedAt), "PPp")}</p>
                            </div>
                        </div>
                    </div>
                );
            }
        },
        { accessorKey: 'analytics.impressions', header: 'Impressions', cell: ({ row }) => row.original.analytics.impressions.toLocaleString() },
        { accessorKey: 'analytics.reach', header: 'Reach', cell: ({ row }) => row.original.analytics.reach.toLocaleString() },
        { accessorKey: 'analytics.likes', header: 'Likes', cell: ({ row }) => row.original.analytics.likes.toLocaleString() },
        { accessorKey: 'analytics.comments', header: 'Comments', cell: ({ row }) => row.original.analytics.comments.toLocaleString() },
        { accessorKey: 'analytics.engagementRate', header: 'Eng. Rate', cell: ({ row }) => `${row.original.analytics.engagementRate}%` },
    ], []);


    return (
        <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
            <div className="space-y-2">
                <h1 className="flex items-center gap-2 text-2xl font-headline font-semibold">
                    <TrendingUp className="size-8"/>
                    Social Media Analytics
                </h1>
                <p className="text-muted-foreground">
                    Review the performance of your social media posts.
                </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
               <AnalyticsSummaryCard title="Total Impressions" value={summary?.impressions || 0} icon={<BarChart2 />} isLoading={isLoading} />
               <AnalyticsSummaryCard title="Total Reach" value={summary?.reach || 0} icon={<Users />} isLoading={isLoading} />
               <AnalyticsSummaryCard title="Total Engagements" value={(summary?.likes || 0) + (summary?.comments || 0) + (summary?.shares || 0)} icon={<ThumbsUp />} isLoading={isLoading} />
               <AnalyticsSummaryCard title="Avg. Engagement Rate" value={`${summary?.engagementRate || 0}%`} icon={<BarChart2 />} isLoading={isLoading} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Post Performance</CardTitle>
                    <CardDescription>A detailed breakdown of each post's analytics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={posts}
                        isLoading={isLoading}
                        error={error}
                        pageCount={1} // Pagination not implemented for this view
                        currentPage={1}
                        onPageChange={() => {}}
                        currentLimit={10}
                        onLimitChange={() => {}}
                        hidePagination={true}
                    >
                        <Filters />
                    </DataTable>
                </CardContent>
            </Card>
        </main>
    );
}
