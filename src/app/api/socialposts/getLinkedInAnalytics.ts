"use server";

import { zeroAnalytics } from "@/lib/zeroAnalytics";
import { getLinkedInPostDetails } from "./getLinkedInPostDetails";

const refreshLinkedInAccessToken = async (
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<string | null> => {
  try {
    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("❌ Failed to refresh LinkedIn token:", data.error_description || "Unknown error");
      throw new Error(data.error_description || "Failed to refresh LinkedIn token");
    }

    return data.access_token;
  } catch (err) {
    console.error("❌ Exception in refreshLinkedInAccessToken:", err);
    return null;
  }
};

const fetchStats = async (shareUrn: string, orgUrn: string, accessToken: string) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-Restli-Protocol-Version": "2.0.0",
    "LinkedIn-Version": "202402",
  };

  const statsParams = `q=organizationalEntity&organizationalEntity=${encodeURIComponent(
    orgUrn
  )}&shares=List(${encodeURIComponent(shareUrn)})`;
  const statsUrl = `https://api.linkedin.com/v2/organizationalEntityShareStatistics?${statsParams}`;

  const socialUrl = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(shareUrn)}`;

  const sharesUrl = `https://api.linkedin.com/v2/shares/${encodeURIComponent(shareUrn)}`;
  const ugcUrl = `https://api.linkedin.com/v2/ugcPosts/${encodeURIComponent(shareUrn)}`;

  const [statsResponse, socialActionsResponse, sharesResponse] = await Promise.all([
    fetch(statsUrl, { headers }),
    fetch(socialUrl, { headers }),
    fetch(sharesUrl, { headers }),
  ]);

  let postResponse = sharesResponse;
  if (!sharesResponse.ok) {
    postResponse = await fetch(ugcUrl, { headers });
  }

  return { statsResponse, socialActionsResponse, postResponse };
};

export const getLinkedInAnalytics = async (post: any, organization: any) => {
  const {
    linkedInRefreshToken,
    linkedInClientId,
    linkedInClientSecret,
    linkedInId,
  } = organization?.settings || {};

  const shareUrn = post.postId;

  if (!linkedInRefreshToken || !linkedInClientId || !linkedInClientSecret || !linkedInId) {
    console.warn(`⚠️ Missing required LinkedIn settings for organization ${organization.name}. Cannot fetch analytics.`);
    return { ...zeroAnalytics(), postContent: post.postContent, imageUrl: post.imageUrl };
  }

  if (!shareUrn) {
    console.warn(`Missing Post ID (Share URN) for post ${post._id}.`);
    return { ...zeroAnalytics(), postContent: post.postContent, imageUrl: post.imageUrl };
  }

  try {
    const accessToken = await refreshLinkedInAccessToken(
      linkedInRefreshToken,
      linkedInClientId,
      linkedInClientSecret
    );
    if (!accessToken) {
      console.error(`❌ Failed to obtain a valid access token for ${organization.name}.`);
      return { ...zeroAnalytics(), postContent: post.postContent, imageUrl: post.imageUrl };
    }
    console.log(`✅ LinkedIn access token refreshed for ${organization.name}`);

    const orgUrn = `urn:li:organization:${linkedInId}`;
    const { statsResponse, socialActionsResponse, postResponse } = await fetchStats(shareUrn, orgUrn, accessToken);

    if (!statsResponse.ok || !socialActionsResponse.ok) {
      console.error("❌ Failed to fetch LinkedIn analytics data");
      return { ...zeroAnalytics(), postContent: post.postContent, imageUrl: post.imageUrl };
    }

    const statsData = await statsResponse.json();
    const socialActionsData = await socialActionsResponse.json();
    const postData = postResponse.ok ? await postResponse.json() : {};

    const firstElement = statsData.elements?.[0];
    const impressions = firstElement?.totalShareStatistics?.impressionCount ?? 0;
    const reach = firstElement?.totalShareStatistics?.uniqueImpressionsCount ?? 0;
    const clicks = firstElement?.totalShareStatistics?.clickCount ?? 0;

    const likes = socialActionsData.likesSummary?.totalLikes ?? 0;
    const comments = socialActionsData.commentsSummary?.totalComments ?? 0;
    const shares = firstElement?.totalShareStatistics?.shareCount ?? 0;
    const saves = 0;

    const totalEngagement = likes + comments + shares + clicks;
    const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;

    // ✅ Extract content and image safely
    let { postContent, imageUrl } =
      (await getLinkedInPostDetails(post, organization, accessToken)) || {
        postContent: "",
        imageUrl: "",
      };

    // Handle UGC Posts
    if (postData?.specificContent?.["com.linkedin.ugc.ShareContent"]) {
      const ugcContent = postData.specificContent["com.linkedin.ugc.ShareContent"];
      postContent = ugcContent?.shareCommentary?.text || postContent;

      if (ugcContent?.media?.length) {
        imageUrl =
          ugcContent.media[0]?.thumbnails?.[0]?.imageSpecificContent?.url ||
          ugcContent.media[0]?.thumbnails?.[0]?.url ||
          imageUrl;
      }
    }

    // Handle legacy Shares
    if (postData?.specificContent?.shareContent) {
      const legacyContent = postData.specificContent.shareContent;
      postContent = legacyContent?.shareCommentary?.text || postContent;

      if (legacyContent?.media?.length) {
        imageUrl =
          legacyContent.media[0]?.thumbnails?.[0]?.imageSpecificContent?.url ||
          legacyContent.media[0]?.thumbnails?.[0]?.url ||
          imageUrl;
      }
    }

    // Fallback: sometimes text is at `text.text`
    if (!postContent && postData?.text?.text) {
      postContent = postData.text.text;
    }
  

    return {
      impressions,
      reach,
      likes,
      comments,
      shares,
      clicks,
      saves,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      postContent,
      imageUrl,
    };
  } catch (error) {
    console.error("❌ Exception in getLinkedInAnalytics for post", post._id, error);
    return { ...zeroAnalytics(), postContent: post.postContent, imageUrl: post.imageUrl };
  }
};
