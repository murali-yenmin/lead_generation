// src/app/api/socialposts/getFacebookAnalytics.ts

import { zeroAnalytics } from "@/lib/zeroAnalytics";

/**
 * Fetch Facebook analytics for a post.
 * Supports regular posts and Lead Ads (fetches actual leads if post.isLeadAd = true)
 */
export const getFacebookAnalytics = async (post: any, organization: any) => {
  const accessToken = organization?.settings?.facebookAccessToken;
  const postId = post.postId; // format: {pageId}_{postId}
  console.log(post, "post.isLeadAd");
  const isLeadAd = post.isLeadAd || false;

  if (!accessToken) {
    console.warn(`❌ Missing Facebook Page Access Token for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  if (!postId) {
    console.warn(`❌ Missing Facebook Post ID for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  try {
    // Fetch post details including reactions, comments, shares, attachments
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${postId}?fields=message,permalink_url,created_time,from,likes.summary(true){id,name},comments.summary(true){from,message,created_time},reactions.summary(true){type},shares,attachments{media}&access_token=${accessToken}`
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.error?.code === 10) {
        console.error(`🚨 Permission issue: Missing "pages_read_engagement" permission.`);
      } else if (data.error?.code === 100) {
        console.warn(`⚠️ Some metrics are invalid for this post type (${postId}). Returning partial data.`);
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

    // Extract engagement metrics
    const reactions = data.reactions?.summary?.total_count ?? 0;
    const comments = data.comments?.summary?.total_count ?? 0;
    const shares = data.shares?.count ?? 0;

    // Simulate clicks (engaged users minus reactions, comments, shares)
    const engaged = 0; // Facebook API insights optional, can fetch `/insights?metric=post_engaged_users`
    const clicks = Math.max(0, engaged - (reactions + comments + shares));
    const saves = 0; // Not provided by API for posts

    // Engagement rate
    const reach = 0; // Optional: fetch from `/insights?metric=post_impressions_unique`
    const totalEngagement = reactions + comments + shares + clicks;
    const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;

    // Extract image
    const imageUrl = data?.attachments?.data?.[0]?.media?.image?.src || "";

    let leads = 0;
    let leadConversionRate = 0;

    // Fetch actual leads if this is a Lead Ad
    if (isLeadAd) {
      try {
        const leadsRes = await fetch(
          `https://graph.facebook.com/v20.0/${postId}/leads?access_token=${accessToken}`
        );
        const leadsData = await leadsRes.json();
        console.log(leadsData, "leadsData");
        leads = leadsData?.data?.length ?? 0;
        leadConversionRate = reach > 0 ? (leads / reach) * 100 : 0;
      } catch (err) {
        console.warn(`⚠️ Could not fetch lead data for post ${postId}`, err);
      }
    } else {
      // Simulate leads for regular posts
      const conversionRateMin = 0.05;
      const conversionRateMax = 0.15;
      const conversionRate = Math.random() * (conversionRateMax - conversionRateMin) + conversionRateMin;
      leads = Math.floor(clicks * conversionRate);
      leadConversionRate = reach > 0 ? (leads / reach) * 100 : 0;
    }

    return {
      impressions: 0, // optional: fetch via /insights
      reach,
      likes: reactions,
      comments,
      shares,
      clicks,
      saves,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      postContent: data?.message || "",
      imageUrl,
      leads,
      conversionRate: parseFloat(leadConversionRate.toFixed(2)),
    };
  } catch (error) {
    console.error(`❌ Error fetching Facebook analytics for post ${postId}:`, error);
    return zeroAnalytics();
  }
};
