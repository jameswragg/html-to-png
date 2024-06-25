import { html } from "satori-html";
import satori from "satori";
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const makeSvg = async () => {
  const htmlString = html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title></title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          html,
          body {
            background: lightblue;
            height: 100%;
          }
          body {
            margin: 0;
          }
          .container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          }
          .container div {
            background: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div>hello there</div>
        </div>
      </body>
    </html>
  `;

  const svg = await satori(htmlString, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Open Sans",
        data: await fs.readFile(
          path.join(__dirname, "../fonts/OpenSans-Bold.ttf")
        ),
        weight: 700,
        style: "normal",
      },
    ],
  });

  return svg;
};

export const home = [
  {
    method: "get",
    path: "/sharp",
    handler: async (request, h) => {
      const svg = await makeSvg();

      const png = await sharp(Buffer.from(svg)).resize(1200, 630).png();

      return h.response(png).header("Content-type", "image/png");
    },
  },
  {
    method: "get",
    path: "/resvg",
    handler: async (request, h) => {
      const svg = await makeSvg();

      const resvg = new Resvg(svg);

      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      return h.response(pngBuffer).header("Content-type", "image/png");
    },
  },
];
