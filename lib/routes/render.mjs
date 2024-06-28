import Joi from "joi";
import satori from "satori";
import { html as satoriHtml } from "satori-html";
import juice from "juice";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// basic, fallback font
const OpenSansBold = await readFile(path.join(__dirname, "../public/fonts/OpenSans-Bold.ttf"));

const makeCssVarPath = ({ clientPropertyId, rootClientPropertyId }) => {
  return `https://asset-store.job.madgexhosting.net/${
    rootClientPropertyId || clientPropertyId
  }/jobseekers-frontend/${clientPropertyId}/tokens/css-vars/variables.css`;
};

export default {
  method: "get",
  path: "/render",
  options: {
    tags: ["api"],
    validate: {
      query: Joi.object({
        clientPropertyId: Joi.string()
          .default("8b3cb731-f5c9-4e96-9508-d5940f5446a4") // 8b3cb731-f5c9-4e96-9508-d5940f5446a4 = guardian
          .required(),
        template: Joi.allow("jobboard-basic", "jobboard-diagonal").default("jobboard-basic").required(),
        logoUrl: Joi.string()
          .default("https://jobs.theguardian.com/_/jobseekers-frontend/assets/images/logo-small.png")
          .optional(),
        brandFontUrl: Joi.string()
          .default("https://jobs.theguardian.com/assets/dist/css/fonts/guardian-2018/GHGuardianHeadline-Semibold.ttf")
          .optional(),
        inlineStyles: Joi.boolean().default(true),
        toPng: Joi.boolean().default(true).optional(),
      }).unknown(true),
    },
    handler: async (request, h) => {
      const { fetchText, fetchAsBase64 } = request.server.methods;

      const cssVarsPath = makeCssVarPath({ clientPropertyId: request.query.clientPropertyId });
      const cssVariables = await fetchText(cssVarsPath);

      let logo = await fetchAsBase64(request.query.logoUrl);
      let font = await fetchAsBase64(request.query.brandFontUrl);

      // render template to html
      let html = await request.render(`og-image-templates/${request.query.template}`, {
        cssVariables,
        logo,
        job: {
          title: "Senior Frontend Developer & Team Lead",
          company: "The Guardian",
          location: "Kingston upon Thames",
        },
      });

      if (request.query.inlineStyles) {
        // css inliner required to resolve CSS variables to hex/rgb values
        html = juice(html);
      }

      if (!request.query.toPng) {
        return h.response(html);
      }

      let markup = satoriHtml(html);

      const svg = await satori(markup, {
        width: 1200,
        height: 630,

        // satori currently supports three font formats: TTF, OTF and WOFF
        // Note that WOFF2 is not supported by satori at the moment
        fonts: [
          {
            name: "Open Sans",
            data: OpenSansBold,
            weight: 700,
            style: "bold",
          },
          {
            name: "brandFont",
            weight: 400,
            style: "normal",
            data: font.buffer,
          },
        ],
      });

      const png = await sharp(Buffer.from(svg)).resize(1200, 630).png();

      return h.response(png).header("Content-type", "image/png");
    },
  },
};
