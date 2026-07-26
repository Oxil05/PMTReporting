import json

with open('extracted_slides.json', 'r', encoding='utf-8') as f:
    slides = json.load(f)

for s in slides:
    print(f"=== SLIDE {s['page']} ===")
    print(s['text'].strip())
    print()
