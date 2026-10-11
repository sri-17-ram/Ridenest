import os
import re

src_dir = r'd:\work\RideNest\frontend\src'

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            used_tags = set(re.findall(r'<([A-Z][a-zA-Z0-9]*)\b', content))
            
            imported_tags = set()
            import_statements = re.findall(r'import\s+\{([^}]+)\}\s+from', content)
            for stmt in import_statements:
                imported_tags.update(x.strip().split(' as ')[-1] for x in stmt.split(','))
            
            default_imports = set(re.findall(r'import\s+([A-Z][a-zA-Z0-9]*)\s+from', content))
            imported_tags.update(default_imports)
            
            missing = used_tags - imported_tags
            
            if missing:
                print(f'{path}: missing imports {missing}')
