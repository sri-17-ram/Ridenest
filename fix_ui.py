import os
import re

def is_dark_bg(class_str):
    dark_bg_pattern = r'\b(bg-(gray-(800|900|950)|slate-(800|900|950)|zinc-(800|900|950)|neutral-(800|900|950)|stone-(800|900|950)|black|indigo-[5-9]00|blue-[5-9]00|emerald-[5-9]00|red-[5-9]00|primary-[5-9]00|yellow-[5-9]00|orange-[5-9]00)|from-[a-z]+-[5-9]00|from-black|to-[a-z]+-[5-9]00|to-black)\b'
    return bool(re.search(dark_bg_pattern, class_str))

def process_class_str(class_str):
    original = class_str
    
    # Always fix placeholders for inputs
    class_str = re.sub(r'\bplaceholder:text-gray-[34]00\b', 'placeholder:text-slate-500', class_str)
    
    # If it's a dark background, skip text color modifications
    if is_dark_bg(class_str):
        return class_str
        
    # Replace standalone text colors (not dark:)
    class_str = re.sub(r'(?<!dark:)\btext-white\b', 'text-slate-900', class_str)
    class_str = re.sub(r'(?<!dark:)\btext-gray-300\b', 'text-slate-600', class_str)
    class_str = re.sub(r'(?<!dark:)\btext-gray-400\b', 'text-slate-500', class_str)
    
    return class_str

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all className="..." or className={...}
    # This regex is a bit simplistic but works for most standard tailwind strings
    # We will look for className="<string>" specifically
    
    modified_content = content
    
    # Replace in className="something"
    def replacer(match):
        prefix = match.group(1)
        classes = match.group(2)
        suffix = match.group(3)
        return prefix + process_class_str(classes) + suffix

    modified_content = re.sub(r'(className=")([^"]+)(")', replacer, modified_content)
    
    # Also handle cn("something", ...) strings
    def cn_replacer(match):
        prefix = match.group(1)
        classes = match.group(2)
        suffix = match.group(3)
        return prefix + process_class_str(classes) + suffix
        
    modified_content = re.sub(r'(cn\s*\(\s*")([^"]+)(")', cn_replacer, modified_content)
    modified_content = re.sub(r'(,\s*")([^"]+)("\s*[\),])', cn_replacer, modified_content)

    if content != modified_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified_content)
        print("Modified UI:", filepath)
        return True
    return False

modified_count = 0
for root, dirs, files in os.walk(r"d:\work\SafeRide Kids\frontend\src"):
    for file in files:
        if file.endswith(('.jsx', '.tsx')):
            if process_file(os.path.join(root, file)):
                modified_count += 1

print(f"UI Script Finished. Modified {modified_count} files.")
