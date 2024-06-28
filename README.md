# html-to-png

Example repo showing how `og:image` images can be generated using:

- [hapi](https://hapi.dev) - web server & API
- [hapi-swagger](https://github.com/hapi-swagger/hapi-swagger) - Swagger interface for the API
- [nunjucks](https://mozilla.github.io/nunjucks/) - template the HTML
- [`juice`](https://github.com/Automattic/juice) - inline all CSS properties to style attributes & resolve CSS variables
- [`satori-html`](https://github.com/natemoo-re/satori-html) - convert an HTML string to a React compatible VDOM object for satori
- [`satori`](https://github.com/vercel/satori) - convert HTML and CSS to SVG
- [`sharp`](https://sharp.pixelplumbing.com/) - used to process & convert image formats

## Notes

The client id, logo & font URLs are supplied as querystrings.

There are the following methods available on the hapi server, both have in-memory caching:

- fetchText
- fetchAsBase64

## Benchmark

Autocannon benchmark (`npm run benchmark`) results:

```bash
┌─────────┬────────┬────────┬────────┬────────┬───────────┬──────────┬────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev    │ Max    │
├─────────┼────────┼────────┼────────┼────────┼───────────┼──────────┼────────┤
│ Latency │ 198 ms │ 260 ms │ 336 ms │ 378 ms │ 261.29 ms │ 35.52 ms │ 400 ms │
└─────────┴────────┴────────┴────────┴────────┴───────────┴──────────┴────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 33      │ 33      │ 38      │ 41      │ 37.6    │ 2.01    │ 33      │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 1.26 MB │ 1.26 MB │ 1.45 MB │ 1.56 MB │ 1.43 MB │ 76.6 kB │ 1.26 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```
