# Provenance

> **Unofficial copy — not the website of Stash Dash.** See `README.md`.

Where everything in this copy comes from, and what was changed to publish it. The same facts, as data, are in `PROVENANCE.json`. "Private build" means the build this copy was made from (README, the paragraph that begins "Two terms used below").

## Words

The text of the pages comes from https://www.stashdash.com/, read on the evening of October 12, 2026, California time (October 13, between 00:15 and 02:15 UTC): 1,021 addresses were asked for in one run (the ones the site lists in its own sitemap and links to), of which 1,017 gave a page (755 distinct pages); parts that only a browser draws were read in a browser on 6 addresses (7 readings), and 47 pages were opened in a browser to measure the live design. The README says, under *Content*, which words on the pages are the redesign's and where the redesign sets words of the live site in places of its own.

## Pictures and video made for this redesign

4 stills and 2 loops were generated on 2026-10-13 (UTC). This copy ships 2 of the stills and the 2 loops, each loop with its own first frame as a still picture; the other 2 stills (still-night-dash, fal.ai: fal-ai/nano-banana-pro; still-tray, fal.ai: fal-ai/nano-banana-pro) were only the first and last frames given to the video model and are not here. None shows a person, a place that can be named, a cannabis product or its packaging, or the plant. The files here are re-encodings made by this build (WebP through a browser canvas, H.264 without an audio track); they were read for metadata before publishing (README, Verification).

| Made as | Files under `assets/generated/` | Shows | Made with | Pages that show it |
| --- | --- | --- | --- | --- |
| loop-night-dash | 2 mp4, 3 webp (its first frame) | loop: an empty road at night | Higgsfield: kling-video/o3/first-last-frame (from the still still-night-dash) | `/becomedriver`, `/deliverylocations` |
| loop-tray | 2 mp4, 3 webp (its first frame) | loop: a silver tray with a plain wrapped gift box | Higgsfield: kling-video/o3/first-last-frame (from the still still-tray) | `/` |
| still-bell | 3 webp | still: a brass desk bell | fal.ai: fal-ai/nano-banana-pro | `/`, `/contact`, `/faq` |
| still-bowtie | 3 webp | still: a black bow tie on linen | Higgsfield: alibaba/qwen-image-3/text-to-image | `/aboutus` |

## Pictures from the live site

697 pictures that the live pages show are used: the business's logo, the product photographs, the marks of the brands, the icons of the categories, the promotions, the gift cards and the event flyer. Each is written as WebP in the sizes its places need (3,917 files), never larger than the source. Of the live site's other pictures, the private build leaves out 45 that were fetched and 17 whose addresses gave no file, and names 65 only in tags that this copy removes; 3 are deliberately not shown here (README, Hardening 8).

## Typefaces

Fraunces, Archivo and DM Mono (10 files), served from this site, each under the SIL Open Font License 1.1. Every font file carries its project's notice, read from the files for this document:

- Copyright 2020 The Archivo Project Authors (https://github.com/Omnibus-Type/Archivo)
- Copyright 2020 The DM Mono Project Authors (https://www.github.com/googlefonts/dm-mono)
- Copyright 2020 The Fraunces Project Authors (github.com/undercasetype/Fraunces)

The licence text of each project is shipped beside the font files, as the project publishes it: `assets/fonts/OFL-Archivo.txt`, `assets/fonts/OFL-DM-Mono.txt`, `assets/fonts/OFL-Fraunces.txt`. Where a licence text is headed by a notice that differs from the one in the font files (another year, another form of the address), both are the project's own and both are shipped as they are: "Copyright 2018 The Fraunces Project Authors (https://github.com/undercasetype/Fraunces)".

## Changes made for publishing

| Change | Count, or the pages |
| --- | --- |
| Pages given the robots tag `noindex, nofollow, noarchive, nosnippet, noimageindex` and a `no-referrer` tag | 750 |
| JSON-LD blocks removed | 739 |
| Link-preview picture tags removed | 1,500 |
| Pages whose link-preview tags carry the disclosure | 750 |
| Link-card titles marked "Unofficial preview:" | 750 |
| Pages whose `og:url` names this preview and whose `twitter:card` is `summary` | 750 |
| Icon links removed (an empty icon stands in) | 1,500 |
| Page descriptions replaced by the disclosure | 1 |
| Canonical tags removed (pages with no page of their own on the live site) | `/404.html`, `/categories`, `/search` |
| Canonical tags set to the live spelling of the address | `/brands/cat4` → `/brands/CAT4` |
| Pages on which the age question was reduced to a confirmation of age (the agreement box, its links and its refusal removed) | 748 |
| Name under which the answer to the age question is kept (the browser's local storage) | `stashdash_preview_age` |
| Product pages from which the two sentences about placing an order were removed | 634 |
| Pages from which the event flyer's words as text were removed (the flyer stays) | `/events` |
| Sentences that say a product helps with cancer, Parkinson's disease, fibromyalgia, neuropathy or inflammatory bowel disease, or that put a figure on a health effect, removed from page text (other statements about health stay) | 9 on 8 pages |
| The same sentences removed from description tags | 9 |
| Buttons turned from another site's shop to the business's own page | 3 on `/becomedriver` |
| `404.html` made to name its files under `/stashdash/` | yes |
| Notes of this preview on single pages | `/termsandconditions`, `/privacypolicy`, `/faq`, `/gift-cards`, `/deliverylocations`, `/becomedriver`, `/learnmore`, `/shop/daily-deals`, `/events` |
| Pictures of the live site not shown (mock-ups that show a person or personal details) | 3 |
| Links that show the business's web address, made to open the business's live site | 1 |
| Controls that lead to the live store, left as they are | 8,985 |
| Comments taken out of the stylesheet | 94 |
| Comments taken out of the script | 31 |
| Files of the private build not shipped | `.htaccess`, `_redirects`, `llms.txt`, `sitemap.xml` |
| `robots.txt` | replaced by the preview's own (`Disallow: /`) |
| Files nothing in this copy names, not shipped | 684 |
| Files added | `assets/css/preview.css`, `assets/fonts/OFL-Archivo.txt`, `assets/fonts/OFL-DM-Mono.txt`, `assets/fonts/OFL-Fraunces.txt`, `.nojekyll`, `.gitattributes` |
