import json
import os
import re

with open('extracted_slides.json', 'r', encoding='utf-8') as f:
    raw_slides = json.load(f)

img_dir = 'assets/images'
available_imgs = os.listdir(img_dir) if os.path.exists(img_dir) else []

formatted_slides = []

for item in raw_slides:
    p = item['page']
    text = item['text'].strip()
    
    # 1. Split raw text by lines
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    # 2. Filter out standalone numbers (e.g. '2', '4', '5', '8', '9', '10', '11')
    clean_lines = []
    for line in lines:
        if re.match(r'^\d+$', line):
            continue
        clean_lines.append(line)
        
    # 3. Determine Title & Body Content
    title = f"Slide {p}"
    body_lines = clean_lines

    if clean_lines:
        # First non-number line is usually the Title
        title = clean_lines[0]
        body_lines = clean_lines[1:]

    # 4. Join line-wrapped text into coherent paragraphs/bullets
    paragraphs = []
    current_para = []

    for line in body_lines:
        # Check if line is a bullet or new list item
        is_bullet = bool(re.match(r'^[-•*▪a-zA-Z0-9]\.\s|^[-•*▪]\s|^\d+\.\s', line))
        
        if is_bullet:
            if current_para:
                paragraphs.append(" ".join(current_para))
                current_para = []
            paragraphs.append(line)
        else:
            # Check if previous ended with punctuation or if this line is continuation
            if current_para:
                current_para.append(line)
            else:
                current_para.append(line)

    if current_para:
        paragraphs.append(" ".join(current_para))

    # Clean up title: remove trailing slide numbers or weird symbols
    title = re.sub(r'\s+\d+$', '', title).strip()

    # Find matching images
    matching_imgs = [f'assets/images/{img}' for img in available_imgs if f'slide_{p:02d}' in img]

    # Clean Topic Tag without slide numbers
    tag = "REPORTING"
    if 1 <= p <= 5:
        tag = "INTRODUCTION"
    elif 6 <= p <= 14:
        tag = "TEACHING METHODS"
    elif 15 <= p <= 20:
        tag = "TEACHING TECHNIQUES"
    elif 21 <= p <= 31:
        tag = "TEACHING STRATEGIES"
    elif 32 <= p <= 43:
        tag = "EDUCATIONAL DEVICES"
    elif p == 44:
        tag = "CLASSROOM ACTIVITY"
    elif p == 45:
        tag = "INSPIRATIONAL VERSE"
    elif p == 46:
        tag = "CONCLUSION"

    formatted_slides.append({
        'number': p,
        'tag': tag,
        'title': title,
        'paragraphs': paragraphs,
        'raw_text': text,
        'images': matching_imgs
    })

js_output = f"const DECK_SLIDES = {json.dumps(formatted_slides, indent=2, ensure_ascii=False)};"

with open('slides_deck.js', 'w', encoding='utf-8') as f:
    f.write(js_output)

print(f"Processed {len(formatted_slides)} slides into clean paragraphs.")
