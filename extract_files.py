import json
import re
import os

transcript_path = r'C:\Users\adity\.gemini\antigravity-ide\brain\0e6fb5c3-a1e0-4611-8df1-4f3b7cd13f11\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

content = ''
for line in lines:
    try:
        obj = json.loads(line)
        if obj.get('content') and '[diff_block_start]' in obj['content']:
            content += obj['content'] + '\n\n'
    except:
        continue

pattern = r'The following changes were made by the USER to: (.*?)\. If relevant.*?\[diff_block_start\]\n(.*?)\[diff_block_end\]'
matches = re.findall(pattern, content, re.DOTALL)

for filepath, diff_content in matches:
    filepath = filepath.strip()
    
    if 'data.ts' in filepath or r'src\components\admin' in filepath:
        if 'data.ts' in filepath:
            new_path = r'C:\Users\adity\Downloads\Yoki-Frontend\src\components\admin\data.ts'
        elif 'AdminConsole.tsx' in filepath:
            new_path = r'C:\Users\adity\Downloads\Yoki-Frontend\src\components\admin\AdminConsole.tsx'
        else:
            filename = os.path.basename(filepath)
            if filename == 'Siderbar.tsx':
                filename = 'Sidebar.tsx'
            new_path = rf'C:\Users\adity\Downloads\Yoki-Frontend\src\components\admin\components\{filename}'
        
        out_lines = []
        for line in diff_content.splitlines():
            if line.startswith('@@ '):
                continue
            if line.startswith('+'):
                out_lines.append(line[1:])
            elif line.startswith(' '):
                out_lines.append(line[1:])
                
        with open(new_path, 'w', encoding='utf-8') as out_f:
            out_f.write('\n'.join(out_lines))
        print(f'Wrote {len(out_lines)} lines to {new_path}')
