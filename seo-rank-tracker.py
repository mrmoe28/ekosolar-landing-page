#!/usr/bin/env python3
"""
EkoSolarPros SEO Rank Tracking Script
Automated ranking monitoring for Georgia solar keywords
"""

import requests
import json
import csv
import time
from datetime import datetime
from typing import List, Dict
import os
from urllib.parse import quote

class SolarSEORankTracker:
    def __init__(self):
        self.domain = "ekosolarpros.com"
        self.target_keywords = [
            # Primary Georgia Solar Keywords
            "solar installation Georgia",
            "solar panels Georgia", 
            "solar companies Georgia",
            "solar panel cost Georgia",
            "best solar installers Georgia",
            "solar repair Georgia",
            "residential solar Georgia",
            "commercial solar Georgia",
            "Georgia solar incentives",
            "solar contractors Georgia",
            
            # City-Specific Keywords
            "solar installation Atlanta",
            "solar panels Savannah",
            "solar companies Columbus",
            "solar contractors Augusta",
            "solar installers Macon",
            "solar panels Stone Mountain",
            
            # Long-tail Keywords
            "solar panel installation cost Georgia",
            "emergency solar repair Georgia",
            "solar companies near me",
            "best solar companies Georgia 2025",
            "Georgia solar tax credits",
            "solar maintenance Georgia"
        ]
        
        self.results_file = "seo_rankings.csv"
        self.json_file = "seo_rankings.json"
        
    def search_google(self, keyword: str, location: str = "Georgia, US") -> List[Dict]:
        """
        Simulate Google search results check
        Note: For production use, integrate with proper SEO API like SEMrush or Ahrefs
        """
        print(f"Checking rankings for: {keyword}")
        
        # Simulate search results (replace with actual API call)
        mock_results = [
            {"url": f"https://{self.domain}/", "position": 5, "title": "Sample Title"},
            {"url": f"https://{self.domain}/solar-installation-atlanta.html", "position": 12, "title": "Atlanta Solar"},
        ]
        
        return mock_results
    
    def check_domain_rankings(self, keyword: str) -> Dict:
        """Check if domain appears in search results for keyword"""
        results = self.search_google(keyword)
        
        domain_rankings = []
        for result in results:
            if self.domain in result["url"]:
                domain_rankings.append({
                    "keyword": keyword,
                    "url": result["url"], 
                    "position": result["position"],
                    "title": result["title"],
                    "date": datetime.now().isoformat()
                })
        
        return domain_rankings
    
    def track_all_keywords(self) -> List[Dict]:
        """Track rankings for all target keywords"""
        all_rankings = []
        
        print(f"🔍 Starting rank tracking for {len(self.target_keywords)} keywords...")
        
        for i, keyword in enumerate(self.target_keywords, 1):
            print(f"Progress: {i}/{len(self.target_keywords)} - {keyword}")
            
            rankings = self.check_domain_rankings(keyword)
            all_rankings.extend(rankings)
            
            # Rate limiting to avoid being blocked
            time.sleep(2)
        
        return all_rankings
    
    def save_rankings_csv(self, rankings: List[Dict]):
        """Save rankings to CSV file"""
        fieldnames = ["date", "keyword", "url", "position", "title"]
        
        file_exists = os.path.exists(self.results_file)
        
        with open(self.results_file, "a", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            if not file_exists:
                writer.writeheader()
            
            for ranking in rankings:
                writer.writerow(ranking)
        
        print(f"✅ Rankings saved to {self.results_file}")
    
    def save_rankings_json(self, rankings: List[Dict]):
        """Save rankings to JSON file"""
        existing_data = []
        
        if os.path.exists(self.json_file):
            with open(self.json_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        
        existing_data.extend(rankings)
        
        with open(self.json_file, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Rankings saved to {self.json_file}")
    
    def generate_ranking_report(self, rankings: List[Dict]):
        """Generate a summary ranking report"""
        if not rankings:
            print("❌ No rankings found for any keywords")
            return
        
        print("\n📊 RANKING SUMMARY REPORT")
        print("=" * 50)
        
        # Group by keyword
        keyword_rankings = {}
        for ranking in rankings:
            keyword = ranking["keyword"]
            if keyword not in keyword_rankings:
                keyword_rankings[keyword] = []
            keyword_rankings[keyword].append(ranking)
        
        # Show best rankings
        print(f"🎯 Keywords ranking (Top 20):")
        top_rankings = [r for r in rankings if r["position"] <= 20]
        top_rankings.sort(key=lambda x: x["position"])
        
        for ranking in top_rankings[:10]:
            print(f"  {ranking['position']:2d}. {ranking['keyword']} - {ranking['url']}")
        
        print(f"\n📈 Total keywords tracked: {len(self.target_keywords)}")
        print(f"📈 Keywords ranking (any position): {len(keyword_rankings)}")
        print(f"📈 Keywords in top 20: {len(top_rankings)}")
        print(f"📈 Average position: {sum(r['position'] for r in rankings) / len(rankings):.1f}")
    
    def run_tracking(self):
        """Main tracking function"""
        print("🚀 EkoSolarPros SEO Rank Tracker Starting...")
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 Domain: {self.domain}")
        
        rankings = self.track_all_keywords()
        
        if rankings:
            self.save_rankings_csv(rankings)
            self.save_rankings_json(rankings)
            self.generate_ranking_report(rankings)
        else:
            print("❌ No rankings found")
        
        print("✅ Rank tracking completed!")

# Configuration for different tracking modes
class SEOMonitoringConfig:
    """Configuration for SEO monitoring alerts and thresholds"""
    
    RANKING_ALERTS = {
        "position_drop_threshold": 5,  # Alert if position drops by 5+ spots
        "top_10_keywords": [
            "solar installation Georgia",
            "solar companies Georgia", 
            "solar panels Georgia"
        ],
        "priority_pages": [
            "/",
            "/solar-installation-atlanta.html",
            "/solar-panel-repair-georgia.html"
        ]
    }
    
    REPORTING_SCHEDULE = {
        "daily_check": True,
        "weekly_report": True,
        "monthly_analysis": True
    }

def main():
    """Run the rank tracker"""
    tracker = SolarSEORankTracker()
    tracker.run_tracking()

if __name__ == "__main__":
    main()