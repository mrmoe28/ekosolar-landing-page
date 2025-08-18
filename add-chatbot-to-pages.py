#!/usr/bin/env python3
"""
Add EkoSolar Chatbot to all HTML pages
"""

import os
import re
from pathlib import Path

# Chatbot HTML to add before closing </body> tag
CHATBOT_HTML = """    
    <!-- Solar Chatbot Container -->
    <div id="solar-chatbot"></div>
    
    <!-- Load EkoSolar Chatbot -->
    <script type="text/babel" src="/solar-chatbot.js"></script>"""

# React dependencies to add in head section
REACT_DEPENDENCIES = """    
    <!-- React dependencies for chatbot -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>"""

def add_chatbot_to_page(file_path):
    """Add chatbot to an HTML page"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has chatbot
        if 'solar-chatbot' in content:
            print(f"✅ Already has chatbot: {file_path}")
            return False
        
        # Skip dashboard and monitoring pages
        if any(skip in str(file_path) for skip in ['google-dashboard.html', 'seo-audit-dashboard.html', 'dns-verification-guide.html']):
            print(f"⏭️ Skipping dashboard: {file_path}")
            return False
        
        modified = False
        
        # Add React dependencies to head if not present
        if 'react@18' not in content:
            head_pattern = r'(</head>)'
            if re.search(head_pattern, content, re.IGNORECASE):
                content = re.sub(
                    head_pattern,
                    REACT_DEPENDENCIES + r'\n\1',
                    content,
                    count=1,
                    flags=re.IGNORECASE
                )
                modified = True
        
        # Add chatbot before closing </body> tag
        body_pattern = r'(</body>)'
        if re.search(body_pattern, content, re.IGNORECASE):
            content = re.sub(
                body_pattern,
                CHATBOT_HTML + r'\n\1',
                content,
                count=1,
                flags=re.IGNORECASE
            )
            modified = True
        
        if modified:
            # Write back the modified content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ Added chatbot to: {file_path}")
            return True
        else:
            print(f"⚠️ No body tag found in: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def process_all_html_files():
    """Process all HTML files in the project"""
    root_dir = Path('.')
    html_files = []
    
    # Find all HTML files
    for file_path in root_dir.rglob('*.html'):
        # Skip hidden directories, node_modules, and temp files
        if any(part.startswith('.') or part == 'node_modules' for part in file_path.parts):
            continue
        html_files.append(file_path)
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    updated_count = 0
    for file_path in html_files:
        if add_chatbot_to_page(file_path):
            updated_count += 1
    
    print(f"\n{'='*50}")
    print(f"Summary: Added chatbot to {updated_count} files")
    print(f"{'='*50}")
    
    # Create a summary report
    create_chatbot_report(html_files)

def create_chatbot_report(html_files):
    """Create a report of chatbot integration status"""
    report = {
        'with_chatbot': [],
        'without_chatbot': [],
        'skipped': []
    }
    
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if any(skip in str(file_path) for skip in ['google-dashboard.html', 'seo-audit-dashboard.html', 'dns-verification-guide.html']):
                report['skipped'].append(str(file_path))
            elif 'solar-chatbot' in content:
                report['with_chatbot'].append(str(file_path))
            else:
                report['without_chatbot'].append(str(file_path))
        except:
            pass
    
    # Write report
    with open('chatbot-integration-status.txt', 'w') as f:
        f.write("EkoSolar Chatbot Integration Status Report\n")
        f.write("="*50 + "\n\n")
        
        f.write(f"✅ Pages with Chatbot ({len(report['with_chatbot'])} files):\n")
        for file in report['with_chatbot']:
            f.write(f"  - {file}\n")
        
        f.write(f"\n❌ Pages without Chatbot ({len(report['without_chatbot'])} files):\n")
        for file in report['without_chatbot']:
            f.write(f"  - {file}\n")
        
        f.write(f"\n⏭️ Skipped ({len(report['skipped'])} files):\n")
        for file in report['skipped']:
            f.write(f"  - {file}\n")
        
        f.write(f"\n📊 Integration Summary:\n")
        f.write(f"  Total files: {len(html_files)}\n")
        f.write(f"  With chatbot: {len(report['with_chatbot'])}\n")
        f.write(f"  Without chatbot: {len(report['without_chatbot'])}\n")
        f.write(f"  Integration rate: {len(report['with_chatbot'])/len(html_files)*100:.1f}%\n")
    
    print("\n📄 Chatbot integration status report saved to: chatbot-integration-status.txt")

if __name__ == "__main__":
    print("🤖 Adding EkoSolar Chatbot to all HTML pages...")
    print("="*50 + "\n")
    process_all_html_files()