#!/usr/bin/env python3
"""
Add Google Integration scripts to all HTML pages
"""

import os
import re
from pathlib import Path

# Google integration script tags to add
GOOGLE_SCRIPTS = """    <!-- Google Integration Scripts -->
    <script src="/google-integration.js" defer></script>
    <script src="/schema-markup.js" defer></script>
    """

def add_google_integration(file_path):
    """Add Google integration scripts to an HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has Google integration
        if 'google-integration.js' in content:
            print(f"✅ Already integrated: {file_path}")
            return False
        
        # Skip dashboard and monitoring pages
        if 'google-dashboard.html' in str(file_path) or 'seo-dashboard.html' in str(file_path):
            print(f"⏭️ Skipping dashboard: {file_path}")
            return False
        
        # Find the </head> tag and insert scripts before it
        head_pattern = r'(</head>)'
        
        if re.search(head_pattern, content, re.IGNORECASE):
            # Insert scripts before </head>
            new_content = re.sub(
                head_pattern,
                GOOGLE_SCRIPTS + r'\n\1',
                content,
                count=1,
                flags=re.IGNORECASE
            )
            
            # Write back the modified content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ Added integration to: {file_path}")
            return True
        else:
            print(f"⚠️ No </head> tag found in: {file_path}")
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
        # Skip node_modules, hidden directories, and temp files
        if any(part.startswith('.') or part == 'node_modules' for part in file_path.parts):
            continue
        html_files.append(file_path)
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    updated_count = 0
    for file_path in html_files:
        if add_google_integration(file_path):
            updated_count += 1
    
    print(f"\n{'='*50}")
    print(f"Summary: Updated {updated_count} files")
    print(f"{'='*50}")
    
    # Create a summary report
    create_integration_report(html_files)

def create_integration_report(html_files):
    """Create a report of integration status"""
    report = {
        'integrated': [],
        'not_integrated': [],
        'skipped': []
    }
    
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'google-dashboard.html' in str(file_path) or 'seo-dashboard.html' in str(file_path):
                report['skipped'].append(str(file_path))
            elif 'google-integration.js' in content:
                report['integrated'].append(str(file_path))
            else:
                report['not_integrated'].append(str(file_path))
        except:
            pass
    
    # Write report
    with open('google-integration-status.txt', 'w') as f:
        f.write("Google Integration Status Report\n")
        f.write("="*50 + "\n\n")
        
        f.write(f"✅ Integrated ({len(report['integrated'])} files):\n")
        for file in report['integrated']:
            f.write(f"  - {file}\n")
        
        f.write(f"\n❌ Not Integrated ({len(report['not_integrated'])} files):\n")
        for file in report['not_integrated']:
            f.write(f"  - {file}\n")
        
        f.write(f"\n⏭️ Skipped ({len(report['skipped'])} files):\n")
        for file in report['skipped']:
            f.write(f"  - {file}\n")
    
    print("\n📄 Integration status report saved to: google-integration-status.txt")

if __name__ == "__main__":
    print("🚀 Adding Google Integration to all HTML pages...")
    print("="*50 + "\n")
    process_all_html_files()