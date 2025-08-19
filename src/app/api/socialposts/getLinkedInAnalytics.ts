// src/app/api/socialposts/getLinkedInAnalytics.ts

import { zeroAnalytics } from "@/lib/zeroAnalytics";

export const getLinkedInAnalytics = async (post: any, organization: any) => {
  const accessToken = organization?.settings?.linkedInRefreshToken;
  const postUrn = post.postUrn; // Example: "urn:li:share:123456789"

  if (!accessToken) {
    console.warn(`❌ Missing LinkedIn Access Token for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  if (!postUrn) {
    console.warn(`❌ Missing LinkedIn Post URN for ${organization?.name || "Org"}`);
    return zeroAnalytics();
  }

  try {
    // ✅ Fetch stats for a specific share/UGC post
    const response = await fetch(
      `https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${organization.settings.linkedinOrgUrn}&shares[0]=${postUrn}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "LinkedIn API request failed");
    }

    console.log(`📊 LinkedIn analytics for ${postUrn}:`, data);

    const stats =
      data.elements && data.elements.length > 0
        ? data.elements[0].totalShareStatistics
        : {};

    const impressions = stats?.impressionCount ?? 0;
    const clicks = stats?.clickCount ?? 0;
    const likes = stats?.likeCount ?? 0;
    const comments = stats?.commentCount ?? 0;
    const shares = stats?.shareCount ?? 0;
    const saves = 0; // LinkedIn API doesn’t expose saves

    const reach = impressions; // LinkedIn doesn’t separate reach vs impressions
    const totalEngagement = likes + comments + shares + clicks;
    const engagementRate = impressions > 0 ? (totalEngagement / impressions) * 100 : 0;

    return {
      impressions,
      reach,
      likes,
      comments,
      shares,
      clicks,
      saves,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      postContent: post.content || "",
      imageUrl: post.imageUrl || "",
    };
  } catch (error) {
    console.error(`❌ Error fetching LinkedIn analytics for post ${postUrn}:`, error);
    return zeroAnalytics();
  }
};
