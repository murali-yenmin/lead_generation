
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { getLinkedInAnalytics } from './getLinkedInAnalytics';
import { getFacebookAnalytics } from './getFacebookAnalytics';
import { getInstagramAnalytics } from './getInstagramAnalytics';

// Placeholder for Twitter analytics
const getTwitterAnalytics = async (postId: string) => {
    console.log(`Fetching mock analytics for Twitter post: ${postId}`);
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const impressions = random(1000, 15000);
    const reach = impressions; // Twitter often focuses on impressions
    const likes = random(50, 1000);
    const comments = random(5, 100);
    const shares = random(2, 50); // Retweets
    const clicks = random(10, 500);
    const saves = 0; // Not applicable for Twitter
    
    const totalEngagement = likes + comments + shares + clicks + saves;
    const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;
    const eve = (likes * 1) + (comments * 2) + (shares * 3) + (clicks * 1) + (saves * 2);

    return { impressions, reach, likes, comments, shares, clicks, saves, engagementRate: parseFloat(engagementRate.toFixed(2)), eve };
}

const getAnalyticsForPost = async (post: any, organization: any) => {
    switch (post.platform.toLowerCase()) {
        case 'linkedin':
            return getLinkedInAnalytics(post, organization);
        case 'facebook':
            return getFacebookAnalytics(post, organization);
        case 'instagram':
            return getInstagramAnalytics(post, organization);
        case 'twitter':
            return getTwitterAnalytics(post.postId);
        default:
            // Fallback to zeroed data for unknown platforms
            return { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0, saves: 0, engagementRate: 0, eve: 0 };
    }
};


export async function GET(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth.valid || !auth.decoded || typeof auth.decoded === 'string' || !auth.decoded.organizationId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { organizationId } = auth.decoded;
  const { searchParams } = new URL(req.url);

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const organization = await db.collection('organizations').findOne({ _id: new ObjectId(organizationId as string) });
    if (!organization) {
        return NextResponse.json({ message: 'Organization not found.' }, { status: 404 });
    }

    // Build the query
    const query: any = {
      organizationId: new ObjectId(organizationId as string),
    };
    
    const platform = searchParams.get('platform');
    if (platform && platform !== 'all') {
      query.platform = platform;
    }

    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    if (dateFrom || dateTo) {
        query.postedAt = {};
        if (dateFrom) query.postedAt.$gte = new Date(dateFrom);
        if (dateTo) query.postedAt.$lte = new Date(dateTo);
    }

    const posts = await db.collection('socialposts').find(query).sort({ postedAt: -1 }).toArray();
    
    const postsWithAnalytics = await Promise.all(posts.map(async (post) => {
        const analytics = await getAnalyticsForPost(post, organization);
        return { ...post, analytics };
    }));
    
    const totalPosts = await db.collection('socialposts').countDocuments(query);
    
    // Aggregate overall stats
    const overallAnalytics = postsWithAnalytics.reduce((acc, post) => {
        acc.impressions += post.analytics.impressions;
        acc.reach += post.analytics.reach;
        acc.likes += post.analytics.likes;
        acc.comments += post.analytics.comments;
        acc.shares += post.analytics.shares;
        acc.clicks += post.analytics.clicks;
        acc.saves += post.analytics.saves; 
        acc.postContents += post.analytics.postContent || "";
        acc.imageUrls += post.analytics.imageUrl || "";
        return acc;
    }, { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0, saves: 0, postContents: "", imageUrls: "" });

    const totalEngagement = overallAnalytics.likes + overallAnalytics.comments + overallAnalytics.shares + overallAnalytics.clicks + overallAnalytics.saves;
    const overallEngagementRate = overallAnalytics.reach > 0 ? (totalEngagement / overallAnalytics.reach) * 100 : 0;


    return NextResponse.json({ 
        posts: postsWithAnalytics, 
        totalPosts,
        summary: {
            ...overallAnalytics,
            engagementRate: parseFloat(overallEngagementRate.toFixed(2))
        }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
