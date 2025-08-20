"use server";

/**
 * Fetch LinkedIn Post object (content + image).
 * Handles both `/shares/{id}` and `/ugcPosts/{id}` and resolves media URNs.
 */
export const getLinkedInPostDetails = async (
  post: any,
  organization: any,
  accessToken: string
) => {
  try {
    const shareUrn = post.postId;
    if (!shareUrn) {
      console.warn(`⚠️ Missing Post ID (Share URN) for post ${post._id}.`);
      return {
        postUrn: null,
        postContent: post.postContent || "",
        imageUrl: post.imageUrl || "",
      };
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202402",
    };

    // Try /shares first
    const sharesUrl = `https://api.linkedin.com/v2/shares/${encodeURIComponent(shareUrn)}`;
    let postResponse = await fetch(sharesUrl, { headers });

    // fallback to /ugcPosts if shares fails
    if (!postResponse.ok) {
      const ugcUrl = `https://api.linkedin.com/v2/ugcPosts/${encodeURIComponent(shareUrn)}`;
      postResponse = await fetch(ugcUrl, { headers });
    }

    if (!postResponse.ok) {
      console.warn(`⚠️ Could not fetch LinkedIn post details for ${shareUrn}`);
      return {
        postUrn: shareUrn,
        postContent: post.postContent || "",
        imageUrl: post.imageUrl || "",
      };
    }

    const postData = await postResponse.json();

    // ✅ Parse content
    let postContent = "";
    let imageUrl = "";

    // ----- Handle UGC Posts -----
    if (postData?.specificContent?.["com.linkedin.ugc.ShareContent"]) {
      const ugcContent = postData.specificContent["com.linkedin.ugc.ShareContent"];
      postContent = ugcContent?.shareCommentary?.text || "";

      const mediaUrn = ugcContent?.media?.[0]?.media || null;
      if (mediaUrn) {
        // Try entityLocation or thumbnails first
        if (ugcContent?.media?.[0]?.thumbnails?.[0]?.resolvedUrl) {
          imageUrl = ugcContent.media[0].thumbnails[0].resolvedUrl;
        } else {
          imageUrl = await fetchMediaUrl(mediaUrn, accessToken);
        }
      }
    }

    // ----- Handle Shares -----
    else if (postData?.content?.contentEntities) {
      postContent = postData?.text?.text || "";

      const entities = postData.content.contentEntities || [];
      const firstEntity = entities[0] || null;

      if (firstEntity?.entityLocation?.startsWith("https://media.licdn.com")) {
        imageUrl = firstEntity.entityLocation;
      } else if (firstEntity?.thumbnails?.length) {
        imageUrl = firstEntity.thumbnails[0].resolvedUrl || "";
      } else if (firstEntity?.entity) {
        imageUrl = await fetchMediaUrl(firstEntity.entity, accessToken);
      }
    }

    // fallback to DB-stored values
    postContent = postContent || post.postContent || "";
    imageUrl = imageUrl || post.imageUrl || "";

    return {
      postUrn: shareUrn,
      postContent,
      imageUrl,
    };
  } catch (error) {
    console.error("❌ Exception in getLinkedInPostDetails for post", post._id, error);
    return {
      postUrn: post.postId || null,
      postContent: post.postContent || "",
      imageUrl: post.imageUrl || "",
    };
  }
};

/**
 * Resolve LinkedIn media URN into actual CDN URL.
 * (Only works if LinkedIn returns expanded recipes with identifiers.)
 */
async function fetchMediaUrl(mediaUrn: string, accessToken: string): Promise<string> {
  try {
    console.log("🔍 Resolving media URL for", mediaUrn);

    const assetId = mediaUrn.replace("urn:li:digitalmediaAsset:", "");
    const assetUrl = `https://api.linkedin.com/v2/assets/${assetId}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202402",
    };

    const res = await fetch(assetUrl, { headers });
    if (!res.ok) {
      console.warn(
        `⚠️ Could not fetch asset details for ${mediaUrn}: ${res.status} ${res.statusText}`
      );
      return "";
    }

    const data = await res.json();
    console.log("📦 Raw Asset Data:", JSON.stringify(data, null, 2));

    let url = "";

    // 1. Direct downloadUrl
    if (data?.downloadUrl) {
      url = data.downloadUrl;
    }

    // 2. recipes as string (no permission for expansion)
    if (!url && typeof data?.recipes === "string") {
      console.warn("⚠️ LinkedIn did not expand recipes. Media URL may not be accessible with this token.");
    }

    // 3. Expanded recipes → check ingredients[].identifier
    if (!url && Array.isArray(data?.recipes)) {
      for (const recipe of data.recipes) {
        if (Array.isArray(recipe.ingredients)) {
          for (const ing of recipe.ingredients) {
            if (ing.identifier?.startsWith("https://media.licdn.com")) {
              url = ing.identifier;
              break;
            }
          }
        }
        if (url) break;
      }
    }

    console.log("🔗 Resolved media URL:", url);
    return url || "";
  } catch (err) {
    console.error("❌ Error resolving media URL for", mediaUrn, err);
    return "";
  }
}
