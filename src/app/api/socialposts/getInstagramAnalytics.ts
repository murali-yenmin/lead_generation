// src/app/api/socialposts/getInstagramAnalytics.ts

import { zeroAnalytics } from "@/lib/zeroAnalytics";

export const getInstagramAnalytics = async (post: any, organization: any) => {
  const accessToken = organization?.settings?.instagramAccessToken;
  const postId = post.postId; // Instagram Media ID

  if (!accessToken) {
    console.warn(`❌ Missing Instagram Access Token for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  if (!postId) {
    console.warn(`❌ Missing Instagram Post ID for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  try {
    // ✅ Get media details
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${postId}?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Instagram API request failed");
    }

    console.log(`📊 Instagram media data for ${postId}:`, data);

    // ✅ Ensure likes & comments fallback
    let likes = data.like_count ?? 0;
    let comments = data.comments_count ?? 0;

    // If missing, fetch manually
    if (likes === 0) {
      try {
        const likesRes = await fetch(
          `https://graph.facebook.com/v20.0/${postId}/likes?summary=true&access_token=${accessToken}`
        );
        const likesData = await likesRes.json();
        likes = likesData?.summary?.total_count ?? 0;
      } catch (e) {
        console.warn(`⚠️ Could not fetch likes count for post ${postId}`);
      }
    }

    if (comments === 0) {
      try {
        const commentsRes = await fetch(
          `https://graph.facebook.com/v20.0/${postId}/comments?summary=true&access_token=${accessToken}`
        );
        const commentsData = await commentsRes.json();
        comments = commentsData?.summary?.total_count ?? 0;
      } catch (e) {
        console.warn(`⚠️ Could not fetch comments count for post ${postId}`);
      }
    }

    // ✅ Fetch insights for impressions, reach, saves
    const metrics = ["impressions", "reach", "engagement", "saved"];
    const insightsRes = await fetch(
      `https://graph.facebook.com/v20.0/${postId}/insights?metric=${metrics.join(",")}&access_token=${accessToken}`
    );

    const insightsData = await insightsRes.json();
    const insights = insightsData.data || [];

    const getInsightValue = (name: string) =>
      insights.find((i: any) => i.name === name)?.values?.[0]?.value ?? 0;

    const impressions = getInsightValue("impressions");
    const reach = getInsightValue("reach");
    const engaged = getInsightValue("engagement");
    const saves = getInsightValue("saved");

    const clicks = Math.max(0, engaged - (likes + comments + saves));
    const shares = 0; // IG doesn’t expose shares

    const totalEngagement = likes + comments + saves + clicks;
    const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;

    return {
      impressions,
      reach,
      likes,
      comments,
      shares,
      clicks,
      saves,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      postContent: data.caption || "",
      imageUrl:
        data.media_type === "IMAGE" || data.media_type === "CAROUSEL_ALBUM"
          ? data.media_url
          : "",
      videoUrl: data.media_type === "VIDEO" ? data.media_url : "",
      permalink: data.permalink || "",
    };
  } catch (error) {
    console.error(`❌ Error fetching Instagram analytics for post ${postId}:`, error);
    return zeroAnalytics();
  }
};
