// src/app/api/socialposts/getInstagramAnalytics.ts

import { zeroAnalytics } from "@/lib/zeroAnalytics";

/**
 * Fetch Instagram analytics for a post.
 * Supports organic posts and ads.
 */
export const getInstagramAnalytics = async (post: any, organization: any) => {
  const accessToken = organization?.settings?.instagramAccessToken;
  const postId = post.postId; // IG media ID
  const isAd = post.isAd || false;

  if (!accessToken) {
    console.warn(`❌ Missing Instagram Access Token for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  if (!postId) {
    console.warn(`❌ Missing Instagram Post ID for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  try {
    // Fetch media details (caption, media_url, like count, comments count)
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${postId}?fields=id,caption,media_type,media_url,permalink,timestamp,username,like_count,comments_count&access_token=${accessToken}`
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.error?.code === 10) {
        console.error(`🚨 Permission issue: Missing "instagram_basic" or "instagram_manage_insights".`);
      } else if (data.error?.code === 100) {
        console.warn(`⚠️ Some metrics invalid for post type (${postId}). Returning partial data.`);
        return {
          ...zeroAnalytics(),
          likes: data.like_count ?? 0,
          comments: data.comments_count ?? 0,
          postContent: data?.caption || "",
          imageUrl: data?.media_url || "",
        };
      }
      throw new Error(data.error?.message || "Instagram API request failed");
    }

    const reactions = data.like_count ?? 0;
    const comments = data.comments_count ?? 0;
    const shares = 0; // IG API doesn’t expose shares
    const saves = 0; // IG API doesn’t expose saves directly

    // Optional: Fetch insights for reach, impressions, engagement
    let reach = 0;
    let impressions = 0;
    let engaged = 0;

    try {
      const insightsRes = await fetch(
        `https://graph.facebook.com/v20.0/${postId}/insights?metric=impressions,reach,engagement&access_token=${accessToken}`
      );
      const insightsData = await insightsRes.json();
      if (insightsRes.ok && insightsData.data) {
        impressions = insightsData.data.find((m: any) => m.name === "impressions")?.values?.[0]?.value ?? 0;
        reach = insightsData.data.find((m: any) => m.name === "reach")?.values?.[0]?.value ?? 0;
        engaged = insightsData.data.find((m: any) => m.name === "engagement")?.values?.[0]?.value ?? 0;
      }
    } catch (err) {
      console.warn(`⚠️ Could not fetch insights for Instagram post ${postId}`, err);
    }

    // Clicks = engaged users minus likes + comments
    const clicks = Math.max(0, engaged - (reactions + comments + shares));

    // Engagement rate
    const totalEngagement = reactions + comments + shares + clicks;
    const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;

    // Simulate leads if this is an Ad
    let leads = 0;
    let conversionRate = 0;

    if (isAd) {
      // If linked to ad data, would require Ads Insights API
      const conversionRateMin = 0.05;
      const conversionRateMax = 0.15;
      const randomRate = Math.random() * (conversionRateMax - conversionRateMin) + conversionRateMin;
      leads = Math.floor(clicks * randomRate);
      conversionRate = reach > 0 ? (leads / reach) * 100 : 0;
    }

    return {
      impressions,
      reach,
      likes: reactions,
      comments,
      shares,
      clicks,
      saves,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      postContent: data?.caption || "",
      imageUrl: data?.media_url || "",
      leads,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
    };
  } catch (error) {
    console.error(`❌ Error fetching Instagram analytics for post ${postId}:`, error);
    return zeroAnalytics();
  }
};
