import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    modified_content = content
    
    # 1. Fix optional chaining on arrays before mapping
    # Matches: arrayName.map(  and replaces with arrayName?.map(
    modified_content = re.sub(r'(\b[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)?)\.map\(', r'\1?.map(', modified_content)
    
    # Also handle arrayName.length -> arrayName?.length
    modified_content = re.sub(r'(\b[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)?)\.length\b', r'\1?.length', modified_content)
    
    # 2. Fix RegisterPage Step 3 missing required
    if "RegisterPage.jsx" in filepath:
        modified_content = modified_content.replace('className="h-11" />', 'className="h-11" required />')
        
    if content != modified_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified_content)
        print("Modified JS:", filepath)
        return True
    return False

modified_count = 0
for root, dirs, files in os.walk(r"d:\work\SafeRide Kids\frontend\src"):
    for file in files:
        if file.endswith(('.jsx', '.js')):
            if process_file(os.path.join(root, file)):
                modified_count += 1

print(f"JS Script Finished. Modified {modified_count} files.")
