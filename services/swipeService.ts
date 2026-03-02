import { supabase } from "./supabase";

export async function createSwipe(
  userId: string,
  likedUserId: string,
  liked: boolean
) {
  const { data, error } = await supabase
    .from("swipes")
    .insert([
      {
        user_id: userId,
        liked_user_id: likedUserId,
        liked,
      },
    ]);

  return { data, error };
}

export async function checkMatch(
  userId: string,
  likedUserId: string
) {
  return await supabase
    .from("swipes")
    .select("*")
    .eq("user_id", likedUserId)
    .eq("liked_user_id", userId)
    .eq("liked", true)
    .maybeSingle();
}