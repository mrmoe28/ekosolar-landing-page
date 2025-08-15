#!/usr/bin/env python3
"""
EkoSolarPros Core Web Vitals Monitoring Script
Automated performance tracking for SEO optimization
"""

import requests
import json
import csv
import time
from datetime import datetime
from typing import Dict, List
import os

class CoreWebVitalsMonitor:
    def __init__(self):
        self.domain = "ekosolarpros.com"
        self.pages_to_monitor = [
            # Priority pages for solar SEO
            "https://ekosolarpros.com/",
            "https://ekosolarpros.com/solar-installation-atlanta.html",
            "https://ekosolarpros.com/solar-installation-savannah.html", 
            "https://ekosolarpros.com/solar-installation-columbus.html",
            "https://ekosolarpros.com/solar-installation-augusta.html",
            "https://ekosolarpros.com/solar-installation-macon.html",
            "https://ekosolarpros.com/solar-panel-repair-georgia.html",
            "https://ekosolarpros.com/emergency-solar-repair.html",
            "https://ekosolarpros.com/blog/",
        ]
        
        self.results_file = "core_web_vitals.csv"
        self.json_file = "core_web_vitals.json"
        
        # PageSpeed Insights API (free tier available)
        self.pagespeed_api_key = "YOUR_API_KEY_HERE"  # Replace with actual API key
        self.pagespeed_base_url = "https://www.googleapis.com/pagespeed/insights/v5/runPagespeed"
    
    def check_page_speed(self, url: str, strategy: str = "mobile") -> Dict:
        """Check page speed using PageSpeed Insights API"""
        params = {
            "url": url,
            "key": self.pagespeed_api_key,
            "strategy": strategy,
            "category": ["PERFORMANCE", "SEO", "ACCESSIBILITY", "BEST_PRACTICES"]
        }
        
        try:
            print(f"🔍 Checking {strategy} performance for: {url}")
            response = requests.get(self.pagespeed_base_url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            return self.parse_pagespeed_results(data, url, strategy)
            
        except requests.RequestException as e:
            print(f"❌ Error checking {url}: {e}")
            return self.create_fallback_results(url, strategy)
    
    def parse_pagespeed_results(self, data: Dict, url: str, strategy: str) -> Dict:
        """Parse PageSpeed Insights API response"""
        lighthouse_result = data.get("lighthouseResult", {})
        categories = lighthouse_result.get("categories", {})
        audits = lighthouse_result.get("audits", {})
        
        # Core Web Vitals
        lcp = audits.get("largest-contentful-paint", {}).get("displayValue", "N/A")
        fid = audits.get("max-potential-fid", {}).get("displayValue", "N/A") 
        cls = audits.get("cumulative-layout-shift", {}).get("displayValue", "N/A")
        
        # Performance metrics
        performance_score = categories.get("performance", {}).get("score", 0) * 100
        seo_score = categories.get("seo", {}).get("score", 0) * 100
        accessibility_score = categories.get("accessibility", {}).get("score", 0) * 100
        
        return {
            "url": url,
            "strategy": strategy,
            "date": datetime.now().isoformat(),
            "performance_score": round(performance_score, 1),
            "seo_score": round(seo_score, 1),
            "accessibility_score": round(accessibility_score, 1),
            "largest_contentful_paint": lcp,
            "first_input_delay": fid,
            "cumulative_layout_shift": cls,
            "speed_index": audits.get("speed-index", {}).get("displayValue", "N/A"),
            "time_to_interactive": audits.get("interactive", {}).get("displayValue", "N/A"),
            "first_contentful_paint": audits.get("first-contentful-paint", {}).get("displayValue", "N/A")
        }
    
    def create_fallback_results(self, url: str, strategy: str) -> Dict:
        """Create fallback results when API fails"""
        return {
            "url": url,
            "strategy": strategy,
            "date": datetime.now().isoformat(),
            "performance_score": 0,
            "seo_score": 0,
            "accessibility_score": 0,
            "largest_contentful_paint": "Error",
            "first_input_delay": "Error",
            "cumulative_layout_shift": "Error",
            "speed_index": "Error",
            "time_to_interactive": "Error",
            "first_contentful_paint": "Error"
        }
    
    def monitor_all_pages(self) -> List[Dict]:
        """Monitor Core Web Vitals for all pages"""
        all_results = []
        
        print(f"🚀 Starting Core Web Vitals monitoring for {len(self.pages_to_monitor)} pages...")
        
        for i, url in enumerate(self.pages_to_monitor, 1):
            print(f"Progress: {i}/{len(self.pages_to_monitor)}")
            
            # Check both mobile and desktop
            mobile_results = self.check_page_speed(url, "mobile")
            desktop_results = self.check_page_speed(url, "desktop")
            
            all_results.extend([mobile_results, desktop_results])
            
            # Rate limiting to respect API limits
            time.sleep(5)
        
        return all_results
    
    def save_results_csv(self, results: List[Dict]):
        """Save results to CSV file"""
        if not results:
            return
        
        fieldnames = list(results[0].keys())
        file_exists = os.path.exists(self.results_file)
        
        with open(self.results_file, "a", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            if not file_exists:
                writer.writeheader()
            
            for result in results:
                writer.writerow(result)
        
        print(f"✅ Results saved to {self.results_file}")
    
    def save_results_json(self, results: List[Dict]):
        """Save results to JSON file"""
        existing_data = []
        
        if os.path.exists(self.json_file):
            with open(self.json_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        
        existing_data.extend(results)
        
        with open(self.json_file, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Results saved to {self.json_file}")
    
    def generate_performance_report(self, results: List[Dict]):
        """Generate performance summary report"""
        if not results:
            print("❌ No performance data available")
            return
        
        print("\n📊 CORE WEB VITALS REPORT")
        print("=" * 50)
        
        # Calculate averages
        mobile_results = [r for r in results if r["strategy"] == "mobile"]
        desktop_results = [r for r in results if r["strategy"] == "desktop"]
        
        if mobile_results:
            avg_mobile_perf = sum(r["performance_score"] for r in mobile_results) / len(mobile_results)
            avg_mobile_seo = sum(r["seo_score"] for r in mobile_results) / len(mobile_results)
            print(f"📱 Mobile Average Performance: {avg_mobile_perf:.1f}/100")
            print(f"📱 Mobile Average SEO Score: {avg_mobile_seo:.1f}/100")
        
        if desktop_results:
            avg_desktop_perf = sum(r["performance_score"] for r in desktop_results) / len(desktop_results)
            avg_desktop_seo = sum(r["seo_score"] for r in desktop_results) / len(desktop_results)
            print(f"💻 Desktop Average Performance: {avg_desktop_perf:.1f}/100")
            print(f"💻 Desktop Average SEO Score: {avg_desktop_seo:.1f}/100")
        
        # Show worst performing pages
        print(f"\n⚠️  Pages needing optimization (Performance < 80):")
        poor_performers = [r for r in results if r["performance_score"] < 80 and r["performance_score"] > 0]
        poor_performers.sort(key=lambda x: x["performance_score"])
        
        for result in poor_performers[:5]:
            print(f"  {result['performance_score']:.1f} - {result['url']} ({result['strategy']})")
        
        # Core Web Vitals issues
        print(f"\n🎯 Core Web Vitals Status:")
        lcp_issues = [r for r in results if "Error" not in str(r["largest_contentful_paint"])]
        if lcp_issues:
            print(f"  LCP (Largest Contentful Paint) - monitored on {len(lcp_issues)} pages")
        
        print(f"\n📈 Total pages monitored: {len(self.pages_to_monitor)}")
        print(f"📈 Total measurements: {len(results)}")
    
    def check_vitals_thresholds(self, results: List[Dict]) -> List[Dict]:
        """Check if any pages exceed Core Web Vitals thresholds"""
        alerts = []
        
        for result in results:
            alerts_for_page = []
            
            # Performance score threshold
            if result["performance_score"] < 60:
                alerts_for_page.append("Performance score below 60")
            
            # SEO score threshold  
            if result["seo_score"] < 90:
                alerts_for_page.append("SEO score below 90")
            
            if alerts_for_page:
                alerts.append({
                    "url": result["url"],
                    "strategy": result["strategy"],
                    "alerts": alerts_for_page,
                    "performance_score": result["performance_score"],
                    "seo_score": result["seo_score"]
                })
        
        return alerts
    
    def run_monitoring(self):
        """Main monitoring function"""
        print("🚀 EkoSolarPros Core Web Vitals Monitor Starting...")
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 Domain: {self.domain}")
        
        if self.pagespeed_api_key == "YOUR_API_KEY_HERE":
            print("⚠️  Warning: PageSpeed API key not configured. Using fallback mode.")
        
        results = self.monitor_all_pages()
        
        if results:
            self.save_results_csv(results)
            self.save_results_json(results)
            self.generate_performance_report(results)
            
            # Check for issues
            alerts = self.check_vitals_thresholds(results)
            if alerts:
                print(f"\n🚨 PERFORMANCE ALERTS ({len(alerts)} issues):")
                for alert in alerts[:5]:
                    print(f"  {alert['url']} ({alert['strategy']}): {', '.join(alert['alerts'])}")
        else:
            print("❌ No performance data collected")
        
        print("✅ Core Web Vitals monitoring completed!")

def main():
    """Run the Core Web Vitals monitor"""
    monitor = CoreWebVitalsMonitor()
    monitor.run_monitoring()

if __name__ == "__main__":
    main()