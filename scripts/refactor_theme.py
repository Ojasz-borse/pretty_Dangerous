import os
import re

directory = 'd:/My Version/IntelliReviewAI1.0/src'
index_html = 'd:/My Version/IntelliReviewAI1.0/index.html'

replacements = {
    r'\bbg-neutral-950\b': 'bg-white dark:bg-neutral-950',
    r'\bbg-neutral-900\b': 'bg-slate-50 dark:bg-neutral-900',
    r'\bbg-neutral-800\b': 'bg-slate-100 dark:bg-neutral-800',
    r'\btext-white\b': 'text-slate-900 dark:text-white',
    r'\btext-neutral-500\b': 'text-slate-500 dark:text-neutral-500',
    r'\btext-neutral-400\b': 'text-slate-600 dark:text-neutral-400',
    r'\btext-neutral-300\b': 'text-slate-700 dark:text-neutral-300',
    r'\bborder-white/5\b': 'border-slate-200 dark:border-white/5',
    r'\bborder-white/10\b': 'border-slate-200 dark:border-white/10',
    r'\bborder-white/20\b': 'border-slate-300 dark:border-white/20',
    r'\bfrom-neutral-950\b': 'from-white dark:from-neutral-950',
    r'\bvia-neutral-900\b': 'via-slate-50 dark:via-neutral-900',
    r'\bto-neutral-950\b': 'to-white dark:to-neutral-950',
    r'\bhover:bg-white/5\b': 'hover:bg-slate-100 dark:hover:bg-white/5',
    r'\bbg-white/5\b': 'bg-slate-100 dark:bg-white/5',
    r'\bbg-white/10\b': 'bg-slate-200 dark:bg-white/10',
    r'\bshadow-black/20\b': 'shadow-slate-300/50 dark:shadow-black/20',
}

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        for pattern, replacement in replacements.items():
            # Only replace if the replacement isn't already present
            if replacement not in new_content:
                new_content = re.sub(pattern, replacement, new_content)

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

# Process TSX files
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

# Process index.html
process_file(index_html)
print("Refactoring complete.")
