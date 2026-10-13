import { defineLive } from "next-sanity/live";
import { client } from "./client";

const token =
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error(
    "Missing SANITY_API_READ_TOKEN or SANITY_API_TOKEN. Please check your .env file."
  );
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
