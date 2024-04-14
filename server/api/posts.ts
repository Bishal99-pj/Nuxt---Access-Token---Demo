import { JSONFilePreset } from "lowdb/node";
import type { Post } from "~/types/Posts.type";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // LOWDB INITIALISATION
  const lowdb = await JSONFilePreset("../../Data/posts.json", {
    posts: [] as Post[],
  });
  // FETCHING POSTS DATA FROM EXTERNAL URL
  try {
    const data = await $fetch<Post[]>(config.public.basePostsUrl);
    if (data) {
      lowdb.data.posts = data;
    }
  } catch (e: Error | unknown) {
    // ERROR HANDLING
    console.error(e);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not fetch posts data",
    });
  }
  return { data: lowdb.data.posts };
});
