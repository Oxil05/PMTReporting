import json

with open('slides_deck.js', 'r', encoding='utf-8') as f:
    code = f.read().replace('const DECK_SLIDES = ', '').rstrip(';')
    slides = json.loads(code)

for s in slides[5:15]:
    print(f"Slide {s['number']}: TITLE = \"{s['title']}\"")
