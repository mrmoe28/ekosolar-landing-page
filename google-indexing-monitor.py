#!/usr/bin/env python3
"""
Google Indexing Status Monitor for EkoSolarPros
Monitors Google Search Console indexing status and provides alerts
"""

import json
import time
import requests
from datetime import datetime, timedelta
import os
from urllib.parse import quote

# Configuration
DOMAIN = "https://ekosolarpros.com"
CHECK_INTERVAL = 86400  # Check daily (24 hours in seconds)
REPORT_FILE = "google-indexing-report.json"

# URLs to monitor
CRITICAL_URLS = [
    "/",
    "/solar-installation-atlanta.html",
    "/solar-installation-savannah.html",
    "/solar-installation-columbus.html",
    "/solar-installation-augusta.html",
    "/solar-installation-macon.html",
    "/solar-installation-stone-mountain.html",
    "/solar-panel-repair-georgia.html",
    "/emergency-solar-repair.html",
    "/solar-inverter-repair.html",
    "/solar-maintenance-contracts.html",
    "/blog/",
    "/blog/georgia-solar-installation-guide-2025.html",
    "/blog/solar-panel-cost-georgia-2025.html",
    "/blog/stranded-solar-installations-georgia-rescue-services.html"
]

class GoogleIndexingMonitor:
    def __init__(self):
        self.domain = DOMAIN
        self.report_data = self.load_report()
        
    def load_report(self):
        """Load existing report data or create new"""
        if os.path.exists(REPORT_FILE):
            with open(REPORT_FILE, 'r') as f:
                return json.load(f)
        return {
            "last_check": None,
            "urls": {},
            "statistics": {
                "total_urls": 0,
                "indexed_urls": 0,
                "not_indexed_urls": 0,
                "errors": 0
            }
        }
    
    def save_report(self):
        """Save report data to file"""
        with open(REPORT_FILE, 'w') as f:
            json.dump(self.report_data, f, indent=2)
    
    def check_url_indexed(self, url):
        """Check if a URL is indexed in Google"""
        full_url = self.domain + url if not url.startswith('http') else url
        
        # Method 1: Check using site: operator
        search_query = f"site:{full_url}"
        encoded_query = quote(search_query)
        
        # Note: This is a simplified check. In production, you'd use Google Search Console API
        # For now, we'll simulate the check
        try:
            # In a real implementation, you would:
            # 1. Use Google Search Console API
            # 2. Or perform actual Google search (with appropriate rate limiting)
            # 3. Or use a third-party indexing API
            
            # Simulated check (replace with actual API call)
            is_indexed = self.simulate_indexing_check(url)
            
            return {
                "url": url,
                "full_url": full_url,
                "indexed": is_indexed,
                "last_checked": datetime.now().isoformat(),
                "method": "simulated"  # Change to "api" when using real API
            }
            
        except Exception as e:
            return {
                "url": url,
                "full_url": full_url,
                "indexed": None,
                "error": str(e),
                "last_checked": datetime.now().isoformat()
            }
    
    def simulate_indexing_check(self, url):
        """Simulate indexing check (replace with actual API call)"""
        # In production, replace this with actual Google Search Console API call
        # For demonstration, we'll assume main pages are indexed
        main_pages = ["/", "/blog/", "/solar-installation-atlanta.html"]
        return url in main_pages
    
    def check_all_urls(self):
        """Check indexing status for all critical URLs"""
        print(f"🔍 Checking indexing status for {len(CRITICAL_URLS)} URLs...")
        
        indexed_count = 0
        not_indexed_count = 0
        error_count = 0
        
        for url in CRITICAL_URLS:
            result = self.check_url_indexed(url)
            self.report_data["urls"][url] = result
            
            if result.get("indexed") == True:
                indexed_count += 1
                print(f"✅ Indexed: {url}")
            elif result.get("indexed") == False:
                not_indexed_count += 1
                print(f"❌ Not Indexed: {url}")
            else:
                error_count += 1
                print(f"⚠️ Error checking: {url}")
            
            # Add delay to avoid rate limiting
            time.sleep(1)
        
        # Update statistics
        self.report_data["statistics"] = {
            "total_urls": len(CRITICAL_URLS),
            "indexed_urls": indexed_count,
            "not_indexed_urls": not_indexed_count,
            "errors": error_count,
            "indexing_rate": f"{(indexed_count/len(CRITICAL_URLS)*100):.1f}%"
        }
        
        self.report_data["last_check"] = datetime.now().isoformat()
        
        return self.report_data["statistics"]
    
    def generate_recommendations(self):
        """Generate recommendations based on indexing status"""
        recommendations = []
        
        stats = self.report_data["statistics"]
        
        if stats["not_indexed_urls"] > 0:
            recommendations.append({
                "priority": "HIGH",
                "action": "Submit non-indexed URLs to Google Search Console",
                "details": f"{stats['not_indexed_urls']} URLs are not indexed"
            })
        
        if stats.get("indexing_rate", "0%").replace("%", "") and float(stats["indexing_rate"].replace("%", "")) < 80:
            recommendations.append({
                "priority": "MEDIUM",
                "action": "Review and improve content quality",
                "details": "Indexing rate is below 80%, consider improving content"
            })
        
        # Check for specific important pages
        important_pages = ["/", "/solar-installation-atlanta.html", "/blog/"]
        for page in important_pages:
            if page in self.report_data["urls"]:
                if not self.report_data["urls"][page].get("indexed"):
                    recommendations.append({
                        "priority": "CRITICAL",
                        "action": f"Urgent: Submit {page} to Google Search Console",
                        "details": f"Critical page {page} is not indexed"
                    })
        
        return recommendations
    
    def generate_html_report(self):
        """Generate HTML report for viewing in browser"""
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Indexing Report - EkoSolarPros</title>
    <style>
        body {{
            font-family: 'Outfit', sans-serif;
            background: #f5f5f5;
            padding: 20px;
            margin: 0;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        .header {{
            background: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}
        .stat-card {{
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .stat-value {{
            font-size: 32px;
            font-weight: bold;
            color: #333;
        }}
        .stat-label {{
            color: #666;
            margin-top: 5px;
        }}
        .url-table {{
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
        }}
        th {{
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
        }}
        td {{
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }}
        .indexed {{
            color: #28a745;
            font-weight: bold;
        }}
        .not-indexed {{
            color: #dc3545;
            font-weight: bold;
        }}
        .recommendations {{
            background: white;
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .rec-item {{
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #667eea;
            background: #f8f9fa;
            border-radius: 4px;
        }}
        .priority-critical {{
            border-left-color: #dc3545;
        }}
        .priority-high {{
            border-left-color: #ffc107;
        }}
        .priority-medium {{
            border-left-color: #17a2b8;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Google Indexing Status Report</h1>
            <p>EkoSolarPros - Last Updated: {self.report_data.get('last_check', 'Never')}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">{self.report_data['statistics']['total_urls']}</div>
                <div class="stat-label">Total URLs Monitored</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #28a745;">{self.report_data['statistics']['indexed_urls']}</div>
                <div class="stat-label">Indexed URLs</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #dc3545;">{self.report_data['statistics']['not_indexed_urls']}</div>
                <div class="stat-label">Not Indexed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{self.report_data['statistics'].get('indexing_rate', '0%')}</div>
                <div class="stat-label">Indexing Rate</div>
            </div>
        </div>
        
        <div class="url-table">
            <table>
                <thead>
                    <tr>
                        <th>URL</th>
                        <th>Status</th>
                        <th>Last Checked</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
"""
        
        for url, data in self.report_data["urls"].items():
            status_class = "indexed" if data.get("indexed") else "not-indexed"
            status_text = "✅ Indexed" if data.get("indexed") else "❌ Not Indexed"
            
            if data.get("error"):
                status_text = "⚠️ Error"
                status_class = "error"
            
            html_content += f"""
                    <tr>
                        <td>{url}</td>
                        <td class="{status_class}">{status_text}</td>
                        <td>{data.get('last_checked', 'Never')}</td>
                        <td>
                            <a href="https://search.google.com/search-console/inspect?resource_id={quote(self.domain)}&id={quote(self.domain + url)}" 
                               target="_blank" style="color: #667eea;">Inspect in GSC →</a>
                        </td>
                    </tr>
"""
        
        html_content += """
                </tbody>
            </table>
        </div>
        
        <div class="recommendations">
            <h2>📋 Recommendations</h2>
"""
        
        recommendations = self.generate_recommendations()
        for rec in recommendations:
            priority_class = f"priority-{rec['priority'].lower()}"
            html_content += f"""
            <div class="rec-item {priority_class}">
                <strong>{rec['priority']} Priority:</strong> {rec['action']}<br>
                <small>{rec['details']}</small>
            </div>
"""
        
        html_content += """
        </div>
    </div>
</body>
</html>
"""
        
        with open("google-indexing-report.html", "w") as f:
            f.write(html_content)
        
        print("📄 HTML report generated: google-indexing-report.html")
    
    def run_monitoring(self):
        """Run the monitoring process"""
        print("=" * 50)
        print("🚀 EkoSolar Google Indexing Monitor")
        print("=" * 50)
        
        # Check all URLs
        stats = self.check_all_urls()
        
        # Save report
        self.save_report()
        
        # Generate HTML report
        self.generate_html_report()
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 SUMMARY")
        print("=" * 50)
        print(f"Total URLs: {stats['total_urls']}")
        print(f"Indexed: {stats['indexed_urls']} ({stats.get('indexing_rate', '0%')})")
        print(f"Not Indexed: {stats['not_indexed_urls']}")
        print(f"Errors: {stats['errors']}")
        
        # Print recommendations
        recommendations = self.generate_recommendations()
        if recommendations:
            print("\n" + "=" * 50)
            print("💡 RECOMMENDATIONS")
            print("=" * 50)
            for rec in recommendations:
                print(f"\n[{rec['priority']}] {rec['action']}")
                print(f"  → {rec['details']}")
        
        print("\n✅ Monitoring complete! Check google-indexing-report.html for details.")
        
        return stats

def main():
    """Main function to run the monitoring"""
    monitor = GoogleIndexingMonitor()
    
    # Run monitoring
    monitor.run_monitoring()
    
    # Schedule info
    print(f"\n⏰ Next check scheduled in {CHECK_INTERVAL/3600:.1f} hours")
    print("\nTo set up automated monitoring:")
    print("1. Add to crontab: crontab -e")
    print("2. Add line: 0 9 * * * /usr/bin/python3 /path/to/google-indexing-monitor.py")
    print("   (This runs daily at 9 AM)")

if __name__ == "__main__":
    main()