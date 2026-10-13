
type SanityImage = {
  url?: string;
  src?: string;
  imageUrl?: string;
  asset?: {
    url?: string;
    _ref?: string;
  };
};

export function getEmailImageUrl(
  image: string | SanityImage | null | undefined
): string {
  if (!image) return "";

  if (typeof image === "string") {
    return image;
  }

  const url =
    image.url ||
    image.src ||
    image.imageUrl ||
    image.asset?.url;

  if (url) return url;

  const ref = image.asset?._ref;
  const match = ref?.match(
    /^image-([a-f0-9]+)-(\d+x\d+)-([a-z]+)$/i
  );

  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  if (!match || !projectId) return "";

  const [, id, dimensions, format] = match;

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
}
