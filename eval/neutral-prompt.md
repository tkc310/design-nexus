# Which page would you ship?

Two web pages, **Page A** and **Page B**, were built from the same brief by different builders. You are the person who wrote the brief and will put one of them in front of real users tomorrow.

- Look at every screenshot of both pages at every width (for each width: the first screen as a visitor sees it on arrival, then the page in 900px tiles in order, then the uncut page as an overview; in the tiles, fixed and sticky bars are laid into the flow). Read both `index.html` files if you want to check behaviour.
- Decide which page you would ship. Use your own judgment of what makes a page good for its users; there is no rubric.
- Do not prefer a page for being longer or for its position (A or B).
- Do not open any file outside the two page folders and this prompt's folder. Do not open any file named key, PAIR_PROMPT, or pair.

Write one JSON object to `neutral.opus.json` in this folder:

```json
{ "ship": "A|B", "margin": "slight|clear|large", "why": "two or three sentences: what decided it" }
```
