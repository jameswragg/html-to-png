import sharp from "sharp";
import { ONE_DAY, ONE_WEEK } from "./helpers/constants.mjs";
import * as Hoek from "@hapi/hoek";

export default {
  method: async function (url, opts = {}) {
    Hoek.assert(url, "No remote URL provided");

    const defaults = {
      toPng: true,
    };

    const options = Hoek.applyToDefaults(defaults, opts);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    let mimeType = response.headers.get("content-type");
    const arrayBuffer = await response.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    let base64 = buffer.toString("base64");

    if (!mimeType.startsWith("image/")) {
      return { base64, buffer, mimeType };
    }

    if (options.toPng) {
      const sharpImage = sharp(arrayBuffer);
      const { format, width, height } = await sharpImage.metadata();
      if (format !== "png") {
        buffer = await sharpImage.resize(width, height).png().toBuffer();
        base64 = buffer.toString("base64");
        mimeType = "image/png";
      }
    }

    return { base64, buffer, mimeType };
  },
  options: {
    cache: {
      cache: "in-memory",
      expiresIn: ONE_WEEK,
      staleIn: ONE_DAY,
      staleTimeout: 100,
      generateTimeout: 5000,
      pendingGenerateTimeout: 5000, // how long to block subsequent stale refresh requests for
    },
  },
};
