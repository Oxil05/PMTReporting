import json
import os
import re

with open('extracted_slides.json', 'r', encoding='utf-8') as f:
    raw_slides = json.load(f)

# Map available images to slides
img_dir = 'assets/images'
available_imgs = os.listdir(img_dir) if os.path.exists(img_dir) else []

formatted_slides = []

for item in raw_slides:
    p = item['page']
    text = item['text'].strip()
    lines = [l.strip() for l in text.split('\n') if l.strip()]

    # Find matching image if exists
    matching_imgs = [f'assets/images/{img}' for img in available_imgs if f'slide_{p:02d}' in img]

    # Category / Topic tag detection
    tag = "REPORTING"
    if 1 <= p <= 5:
        tag = "TITLE & INTRODUCTION"
    elif 6 <= p <= 14:
        tag = "TEACHING METHODS"
    elif 15 <= p <= 20:
        tag = "TEACHING TECHNIQUES"
    elif 21 <= p <= 31:
        tag = "TEACHING STRATEGIES"
    elif 32 <= p <= 43:
        tag = "EDUCATIONAL DEVICES"
    elif p == 44:
        tag = "INTERACTIVE CLASSROOM ACTIVITY"
    elif p == 45:
        tag = "INSPIRATIONAL VERSE"
    elif p == 46:
        tag = "CLOSING"

    # Title detection
    title = f"Slide {p}"
    content_lines = lines

    if lines:
        # Check first line
        first = lines[0]
        if not re.match(r'^\d+$', first):
            title = first
            content_lines = lines[1:]
        elif len(lines) > 1 and not re.match(r'^\d+$', lines[1]):
            title = lines[1]
            content_lines = lines[2:]

    # Clean up standalone slide numbers from bullets
    clean_bullets = [l for l in content_lines if not re.match(r'^\d+$', l)]

    formatted_slides.append({
        'number': p,
        'tag': tag,
        'title': title,
        'bullets': clean_bullets,
        'raw_text': text,
        'images': matching_imgs
    })

js_output = f"const DECK_SLIDES = {json.dumps(formatted_slides, indent=2, ensure_ascii=False)};"

with open('slides_deck.js', 'w', encoding='utf-8') as f:
    f.write(js_output)

print(f"Built slides_deck.js with {len(formatted_slides)} formatted slides.")
