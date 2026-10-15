export const getImageCrossOrigin = (imageUrl) =>
  typeof imageUrl === "string" &&
  /^https:\/\/res\.cloudinary\.com(?:\/|$)/i.test(imageUrl)
    ? "anonymous"
    : undefined;
