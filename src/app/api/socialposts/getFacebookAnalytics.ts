// src/app/api/socialposts/getFacebookAnalytics.ts

import { zeroAnalytics } from "@/lib/zeroAnalytics";

export const getFacebookAnalytics = async (post: any, organization: any) => {
  const accessToken = organization?.settings?.facebookAccessToken;
  const postId = post.postId; // format: {pageId}_{postId}

  if (!accessToken) {
    console.warn(`❌ Missing Facebook Page Access Token for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  if (!postId) {
    console.warn(`❌ Missing Facebook Post ID for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  try {
    // ✅ Added attachments{media} to fetch post images
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${postId}?fields=message,permalink_url,created_time,from,likes.summary(true){id,name},comments.summary(true){from,message,created_time},reactions.summary(true){type},shares,attachments{media}&access_token=${accessToken}`
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.error?.code === 10) {
        console.error(`🚨 Permission issue: Your app/token is missing "pages_read_engagement".`);
      } else if (data.error?.code === 100) {
        console.warn(
          `⚠️ Some metrics are invalid for this post type (${postId}). Returning partial data.`
        );
        return {
          ...zeroAnalytics(),
          likes: data.reactions?.summary?.total_count ?? 0,
          comments: data.comments?.summary?.total_count ?? 0,
          shares: data.shares?.count ?? 0,
          postContent: data?.message || "",
          imageUrl: data?.attachments?.data?.[0]?.media?.image?.src || "",
        };
      }
      throw new Error(data.error?.message || "Facebook API request failed");
    }

    // Extract insights safely
    const insights = data.insights?.data || [];
    const getInsightValue = (name: string) =>
      insights.find((i: any) => i.name === name)?.values?.[0]?.value ?? 0;

    const reach = getInsightValue("post_impressions_unique");
    const impressions = getInsightValue("post_impressions");
    const engaged = getInsightValue("post_engaged_users");

    const reactions = data.reactions?.summary?.total_count ?? 0;
    const comments = data.comments?.summary?.total_count ?? 0;
    const shares = data.shares?.count ?? 0;

    const clicks = Math.max(0, engaged - (reactions + comments + shares));
    const saves = 0;

    const totalEngagement = reactions + comments + shares + clicks;
    const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;

    // ✅ Extract post image
    const imageUrl = data?.attachments?.data?.[0]?.media?.image?.src || "";

    return {
      impressions,
      reach,
      likes: reactions,
      comments,
      shares,
      clicks,
      saves,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      postContent: data?.message || "",
      imageUrl,
    };
  } catch (error) {
    console.error(`❌ Error fetching Facebook analytics for post ${postId}:`, error);
    return zeroAnalytics();
  }
};
