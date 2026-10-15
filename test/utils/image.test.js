import { describe, expect, test } from "vitest";
import { getImageCrossOrigin } from "../../src/utils/image";

describe("getImageCrossOrigin", () => {
  test("requests public Cloudinary delivery images without cross-origin credentials", () => {
    expect(
      getImageCrossOrigin(
        "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      ),
    ).toBe("anonymous");
  });

  test("leaves other hosts and invalid values unchanged", () => {
    expect(getImageCrossOrigin("https://example.com/product.jpg")).toBeUndefined();
    expect(getImageCrossOrigin("https://res.cloudinary.com.evil.test/image.jpg"))
      .toBeUndefined();
    expect(getImageCrossOrigin(null)).toBeUndefined();
  });
});
