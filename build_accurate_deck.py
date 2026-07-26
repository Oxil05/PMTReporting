import json
import os
import re
import fitz

doc = fitz.open('Green Monochromatic Simple The Minimalist Presentation Template.pdf')

img_dir = 'assets/images'
available_imgs = os.listdir(img_dir) if os.path.exists(img_dir) else []

# Exact curated title & content map per page based on user directives & PDF inspection
curated_slides = [
    # Slide 1
    {
        'number': 1,
        'tag': 'INTRODUCTION',
        'title': 'INSTRUCTIONAL METHODS, TECHNIQUES AND STRATEGIES',
        'subtitle': 'Group 5 • BSIT-31A • 2026 July 27',
        'paragraphs': [
            "A comprehensive overview of instructional material, teaching methods, techniques, strategies, and educational devices."
        ]
    },
    # Slide 2
    {
        'number': 2,
        'tag': 'RECAP',
        'title': 'RECAP - ISONDA',
        'paragraphs': [
            "Review of previous lessons and foundational concepts."
        ]
    },
    # Slide 3
    {
        'number': 3,
        'tag': 'OBJECTIVES',
        'title': 'LEARNING OBJECTIVES',
        'paragraphs': [
            "Upon successful completion of this module, you will be able to:",
            "• Distinguish the difference between methods, techniques and strategies in teaching.",
            "• Identify the role of these methods and strategies used in teaching.",
            "• Identify which method is the best choice for a given topic.",
            "• Be familiarized with the devices used in teaching.",
            "• Create sample devices for teaching, e.g. video lesson and animated PowerPoint Presentation.",
            "• Develop ability in presenting their lessons in the future."
        ]
    },
    # Slide 4
    {
        'number': 4,
        'tag': 'ICE BREAKER',
        'title': 'ICE BREAKER',
        'paragraphs': []
    },
    # Slide 5
    {
        'number': 5,
        'tag': 'TEACHING METHODS',
        'title': 'TEACHING METHODS (HOW WE TEACH THIS CONTENT)',
        'paragraphs': [
            "Method in a common usage refers to a procedure that one follows in order to attain an objective.",
            "The systematic way of doing something. It implies an orderly and logical arrangement of steps. It is more procedural."
        ]
    },
    # Slide 6
    {
        'number': 6,
        'tag': 'TEACHING METHODS',
        'title': 'The Different Methods Used in Teaching',
        'paragraphs': [
            "Overview of the core instructional methods used in modern classrooms."
        ]
    },
    # Slide 7
    {
        'number': 7,
        'tag': 'TEACHING METHODS',
        'title': 'A. Lecture',
        'paragraphs': [
            "A clarification of information to a large group in a short period of time.",
            "Lecture consists of an oral presentation by an expert. It is resorting to tackling a special topic, hence the need for an expert on the content."
        ]
    },
    # Slide 8
    {
        'number': 8,
        'tag': 'TEACHING METHODS',
        'title': 'B. Demonstration / Performance Method',
        'paragraphs': [
            "A method where the teacher illustrates a general principle using a concrete, real example, essentially modeling the skill first.",
            "The students then get to practice that same skill themselves, based on what they just saw."
        ]
    },
    # Slide 9
    {
        'number': 9,
        'tag': 'TEACHING METHODS',
        'title': 'C. Discussion',
        'paragraphs': [
            "A common method used for exploring attitudes and opinions, rather than just facts.",
            "It's meant to be a free, two-way exchange between teacher and students pulling out their interpretations, questions, and opinions, not just a one-way lecture."
        ]
    },
    # Slide 10
    {
        'number': 10,
        'tag': 'TEACHING METHODS',
        'title': 'D. Case Study',
        'paragraphs': [
            "An in-depth investigation of a single subject, group, organization, or event in its real-world context.",
            "The case study method is primarily aimed at the application of general principles to specific instances or at the analysis and evaluation of the situation."
        ]
    },
    # Slide 11
    {
        'number': 11,
        'tag': 'TEACHING METHODS',
        'title': 'E. Pairs or Small Group Works',
        'paragraphs': [
            "These methods are generally used as a part of a larger course rather than as the only teaching method.",
            "In these situations, students work in pairs or small groups on problems of application and analysis."
        ]
    },
    # Slide 12
    {
        'number': 12,
        'tag': 'TEACHING METHODS',
        'title': 'F. Field Studies',
        'paragraphs': [
            "As a teaching methodology, it is an out-of-the-classroom activity intended to present concepts in the most realistic manner.",
            "A qualitative research method where data is collected in natural, real-world settings rather than in a controlled laboratory. Ex. Field Trip"
        ]
    },
    # Slide 13
    {
        'number': 13,
        'tag': 'TEACHING METHODS',
        'title': 'G. Simulation',
        'paragraphs': [
            "Is an imitation of a real process or concept.",
            "It uses a mathematical model to recreate conditions, test behaviors, and predict outcomes in a controlled environment. It is widely used when experimenting on the actual system is too dangerous, expensive, or impossible. Ex. Simulation Games or virtual lab"
        ]
    },
    # Slide 14
    {
        'number': 14,
        'tag': 'TEACHING METHODS',
        'title': 'H. Role Playing',
        'paragraphs': [
            "Role Playing as an approach is one of the dramatic ways of presenting learning episodes.",
            "This approach is action-filled because it consists of an enactment by the students of a learning situation through which the participants depict."
        ]
    },
    # Slide 15
    {
        'number': 15,
        'tag': 'TEACHING TECHNIQUES',
        'title': 'THE TECHNIQUES OF TEACHING',
        'paragraphs': [
            "Exploring the individual steps, styles, and artistic executions teachers follow when delivering lessons."
        ]
    },
    # Slide 16
    {
        'number': 16,
        'tag': 'TEACHING TECHNIQUES',
        'title': 'Definition of Teaching Techniques',
        'paragraphs': [
            "Teaching techniques are such steps teachers follow when we teach. This refers to the teacher's style or tricks to accomplish an immediate objective.",
            "Technical skill or an artistic execution.",
            "Factor which promotes or effectuates learning through teaching with the aid of devices, or the skill of the teacher in manipulating the devices so that the psychological processes of the learner may be stimulated to effective reactions, particularly in dealing with the subject matter that is to be learned."
        ]
    },
    # Slide 17
    {
        'number': 17,
        'tag': 'TEACHING TECHNIQUES',
        'title': 'WHAT ARE THE THREE GENERAL TECHNIQUES?',
        'paragraphs': [
            "Overview of the primary categories governing instructional techniques."
        ]
    },
    # Slide 18
    {
        'number': 18,
        'tag': 'TEACHING TECHNIQUES',
        'title': 'General Techniques Categories',
        'paragraphs': [
            "• Question and answer (Knowledge)",
            "• Drill (Skill and habits)",
            "• Appreciation (Attitude and appreciation)"
        ]
    },
    # Slide 19
    {
        'number': 19,
        'tag': 'TEACHING TECHNIQUES',
        'title': 'STANDARDS THAT GOVERN THE SELECTION OF TECHNIQUE',
        'paragraphs': [
            "1. The Subject Matter: The technique must align with the nature of what you are teaching.",
            "2. The Students (Nature and Maturity): You must consider who you are teaching.",
            "3. The Teacher (Ability and Training): The choice of technique should be based on your own skills.",
            "4. The Time Allotted: You need to consider how much time you have for the subject."
        ]
    },
    # Slide 20
    {
        'number': 20,
        'tag': 'TEACHING TECHNIQUES',
        'title': 'RULES GOVERNING THE USE OF TECHNIQUES',
        'paragraphs': [
            "• It is a Means to an End: Technique should never be the ultimate goal of the lesson.",
            "• Judge by the Effect it Produces: Success of a technique is determined by its outcome in a specific situation.",
            "• Utilize the Primary Laws of Learning: When employing a technique, it should tap into fundamental psychological laws of learning."
        ]
    },
    # Slide 21
    {
        'number': 21,
        'tag': 'TEACHING STRATEGIES',
        'title': 'STRATEGY OF TEACHING (WHY WE TEACH THIS WAY)',
        'paragraphs': [
            "Teaching Strategies, also known as Instructional strategies are methods, techniques, or approaches teachers use to help students learn more effectively.",
            "These strategies guide how teachers introduce content, build understanding, check for mastery, and support students as they apply what they have learned."
        ]
    },
    # Slide 22
    {
        'number': 22,
        'tag': 'TEACHING STRATEGIES',
        'title': 'WHAT ARE THE DIFFERENT TYPES OF INSTRUCTIONAL STRATEGIES?',
        'paragraphs': [
            "Direct Instruction uses clear, explicit teaching to introduce new skills and ideas.",
            "The teacher models the skill, explains their thinking, and guides students through practice."
        ]
    },
    # Slide 23
    {
        'number': 23,
        'tag': 'TEACHING STRATEGIES',
        'title': 'DIRECT INSTRUCTION EXAMPLES',
        'paragraphs': [
            "Examples of direct instruction include:",
            "• Modeling and think-alouds",
            "• Guided practice",
            "• Explicit vocabulary instruction",
            "• Mini-lessons"
        ]
    },
    # Slide 24
    {
        'number': 24,
        'tag': 'TEACHING STRATEGIES',
        'title': 'COLLABORATIVE LEARNING',
        'paragraphs': [
            "Collaborative learning tasks students with working together to solve problems, develop ideas, and deepen their understanding of a topic."
        ]
    },
    # Slide 25
    {
        'number': 25,
        'tag': 'TEACHING STRATEGIES',
        'title': 'COLLABORATIVE LEARNING EXAMPLES',
        'paragraphs': [
            "Examples include:",
            "• Think-Pair-Share activities",
            "• Literature circles",
            "• Group projects"
        ]
    },
    # Slide 26
    {
        'number': 26,
        'tag': 'TEACHING STRATEGIES',
        'title': 'INQUIRY-BASED LEARNING',
        'paragraphs': [
            "These strategies encourage students to explore ideas, ask questions, and discover answers on their own."
        ]
    },
    # Slide 27
    {
        'number': 27,
        'tag': 'TEACHING STRATEGIES',
        'title': 'INQUIRY-BASED LEARNING EXAMPLES',
        'paragraphs': [
            "Examples of inquiry-based learning include:",
            "• Project-based learning",
            "• Socratic seminars",
            "• Experiments",
            "• Research tasks"
        ]
    },
    # Slide 28
    {
        'number': 28,
        'tag': 'TEACHING STRATEGIES',
        'title': 'DIFFERENTIATED INSTRUCTION',
        'paragraphs': [
            "Differentiation helps teachers meet diverse learning needs by adjusting content, tasks, or the way lessons are taught."
        ]
    },
    # Slide 29
    {
        'number': 29,
        'tag': 'TEACHING STRATEGIES',
        'title': 'DIFFERENTIATED INSTRUCTION EXAMPLES',
        'paragraphs': [
            "Examples include tiered assignments, flexible grouping, choice boards, and scaffolded texts."
        ]
    },
    # Slide 30
    {
        'number': 30,
        'tag': 'TEACHING STRATEGIES',
        'title': 'ASSESSMENT',
        'paragraphs': [
            "While often overlooked, assessment is a critical part of instruction.",
            "Teachers use ongoing checks to guide their next steps."
        ]
    },
    # Slide 31
    {
        'number': 31,
        'tag': 'TEACHING STRATEGIES',
        'title': 'ASSESSMENT EXAMPLES',
        'paragraphs': [
            "Examples include exit tickets, conferences, quick writes, and whiteboard responses.",
            "3-2-1 Prompt: Ask students to write down 3 things they learned, 2 things they found interesting, and 1 question they still have."
        ]
    },
    # Slide 32
    {
        'number': 32,
        'tag': 'EDUCATIONAL DEVICES',
        'title': 'WHAT IS A DEVICE?',
        'paragraphs': [
            "A teaching aid or tool used to facilitate instruction.",
            "Helps teachers present lessons more effectively.",
            "Examples: projector, books, chalk, videos, PowerPoint."
        ]
    },
    # Slide 33
    {
        'number': 33,
        'tag': 'EDUCATIONAL DEVICES',
        'title': 'WHY DO WE NEED TEACHING DEVICES?',
        'paragraphs': [
            "• Capture students' attention.",
            "• Stimulate imagination.",
            "• Improve understanding.",
            "• Encourage participation.",
            "• Develop listening skills."
        ]
    },
    # Slide 34
    {
        'number': 34,
        'tag': 'EDUCATIONAL DEVICES',
        'title': 'CLASSIFICATION OF DEVICES',
        'paragraphs': [
            "• Material Devices: Physical teaching tools (e.g. blackboard, chalk, books, pencil and paper).",
            "• General Devices: Used in all subjects.",
            "• Special Devices: Used in specific subjects.",
            "• Mental Devices: Classroom visual aids.",
            "• Field and Excursion Visual Aids: Outdoor learning tools."
        ]
    },
    # Slide 35
    {
        'number': 35,
        'tag': 'EDUCATIONAL DEVICES',
        'title': 'Criteria Covering the Selection of Devices',
        'paragraphs': [
            "Guidelines and essential benchmarks for selecting teaching tools."
        ]
    },
    # Slide 36
    {
        'number': 36,
        'tag': 'EDUCATIONAL DEVICES',
        'title': 'Criteria for Selecting Educational Devices',
        'paragraphs': [
            "• Supports Learning: Must directly help students learn and master the specific subject matter and lesson goals.",
            "• Adapts to Students: Fits the individual needs and learning styles of each pupil."
        ]
    },
    # Slide 37
    {
        'number': 37,
        'tag': 'EDUCATIONAL DEVICES',
        'title': 'Criteria for Selecting Educational Devices (Cont.)',
        'paragraphs': [
            "• Balanced Quantity: Should not be too many to overwhelm, but enough to give both teachers and students options.",
            "• Practical & Economical: Cost-effective, functional, and selected for true learning value.",
            "• Ready to Use: Simple, accessible, and easily usable in the classroom."
        ]
    },
    # Slide 38
    {
        'number': 38,
        'tag': 'EDUCATIONAL DEVICES',
        'title': 'General Suggestions for the Use of Devices',
        'paragraphs': [
            "Best practices for incorporating educational devices effectively."
        ]
    },
    # Slide 39
    {
        'number': 39,
        'tag': 'EDUCATIONAL DEVICES',
        'title': 'General Suggestions for the Use of Devices: Rules',
        'paragraphs': [
            "1. The teaching devices should serve some vital purposes well established in advance.",
            "2. Should be within the view of all members of the class.",
            "3. Teacher must not consider devices as a substitute for teaching procedure or method.",
            "4. Teacher should use various types of devices."
        ]
    },
    # Slide 40
    {
        'number': 40,
        'tag': 'EDUCATIONAL DEVICES',
        'title': 'The Teaching Devices',
        'paragraphs': [
            "Categories of physical and visual teaching aids."
        ]
    },
    # Slide 41
    {
        'number': 41,
        'tag': 'EDUCATIONAL DEVICES',
        'title': '1. Representations or Replicas',
        'paragraphs': [
            "globes, maps, models, miniature of objects"
        ]
    },
    # Slide 42
    {
        'number': 42,
        'tag': 'EDUCATIONAL DEVICES',
        'title': '2. Art Work',
        'paragraphs': [
            "painting, sculpture, busts, fashion pieces"
        ]
    },
    # Slide 43
    {
        'number': 43,
        'tag': 'EDUCATIONAL DEVICES',
        'title': '3. Electronic Equipment and Devices',
        'paragraphs': [
            "computers, laptop, iPad, projector, tapes, films, discs"
        ]
    },
    # Slide 44
    {
        'number': 44,
        'tag': 'CLASSROOM ACTIVITY',
        'title': 'CLASSROOM ACTIVITY',
        'paragraphs': [
            "Interactive demonstration and group participation exercise."
        ]
    },
    # Slide 45
    {
        'number': 45,
        'tag': 'BIBLE VERSE',
        'title': 'BIBLE VERSE',
        'citation': 'PROVERBS 24:5-6',
        'paragraphs': [
            "“A WISE MAN IS FULL OF STRENGTH, AND A MAN OF KNOWLEDGE ENHANCES HIS MIGHT, FOR BY WISE GUIDANCE YOU CAN WAGE YOUR WAR, AND IN ABUNDANCE OF COUNSELORS THERE IS VICTORY.”"
        ]
    },
    # Slide 46
    {
        'number': 46,
        'tag': 'CONCLUSION',
        'title': 'THANK YOU FOR LISTENING',
        'paragraphs': [
            "Group 5 • BSIT-31A • Shawn Garcia • Liceria & Co."
        ]
    }
]

# Attach matching image paths
for slide in curated_slides:
    p = slide['number']
    matching_imgs = [f'assets/images/{img}' for img in available_imgs if f'slide_{p:02d}' in img]
    slide['images'] = matching_imgs
    slide['raw_text'] = doc[p - 1].get_text('text').strip() if p <= len(doc) else ""

js_output = f"const DECK_SLIDES = {json.dumps(curated_slides, indent=2, ensure_ascii=False)};"

with open('slides_deck.js', 'w', encoding='utf-8') as f:
    f.write(js_output)

print(f"Successfully generated curated slides_deck.js for all {len(curated_slides)} slides!")
