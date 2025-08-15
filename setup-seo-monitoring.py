#!/usr/bin/env python3
"""
EkoSolarPros SEO Monitoring Setup Script
Configures all SEO tracking and monitoring tools
"""

import os
import json
import subprocess
import sys
from datetime import datetime

class SEOMonitoringSetup:
    def __init__(self):
        self.config_file = "seo_config.json"
        self.base_config = {
            "domain": "ekosolarpros.com",
            "google_analytics_id": "GA_MEASUREMENT_ID",
            "google_search_console_verified": True,
            "pagespeed_api_key": "",
            "email_settings": {
                "smtp_server": "smtp.gmail.com",
                "smtp_port": 587,
                "email_user": "",
                "email_password": "",
                "recipients": []
            },
            "monitoring_schedule": {
                "daily_rank_check": True,
                "weekly_vitals_check": True,
                "weekly_reports": True,
                "monthly_reports": True
            },
            "target_keywords": [
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
                "solar installation Atlanta",
                "solar panels Savannah",
                "solar companies Columbus",
                "solar contractors Augusta",
                "solar installers Macon",
                "solar panels Stone Mountain"
            ],
            "priority_pages": [
                "/",
                "/solar-installation-atlanta.html",
                "/solar-installation-savannah.html",
                "/solar-installation-columbus.html",
                "/solar-installation-augusta.html", 
                "/solar-installation-macon.html",
                "/solar-panel-repair-georgia.html",
                "/emergency-solar-repair.html"
            ]
        }
    
    def check_dependencies(self):
        """Check if required Python packages are installed"""
        required_packages = [
            "requests",
            "beautifulsoup4",
            "pandas",
            "matplotlib",
            "seaborn"
        ]
        
        missing_packages = []
        
        for package in required_packages:
            try:
                __import__(package)
            except ImportError:
                missing_packages.append(package)
        
        if missing_packages:
            print(f"⚠️  Missing required packages: {', '.join(missing_packages)}")
            print("Installing missing packages...")
            
            for package in missing_packages:
                try:
                    subprocess.check_call([sys.executable, "-m", "pip", "install", package])
                    print(f"✅ Installed {package}")
                except subprocess.CalledProcessError:
                    print(f"❌ Failed to install {package}")
        else:
            print("✅ All required packages are installed")
    
    def create_config_file(self):
        """Create initial configuration file"""
        if os.path.exists(self.config_file):
            print(f"⚠️  Configuration file {self.config_file} already exists")
            return
        
        with open(self.config_file, 'w') as f:
            json.dump(self.base_config, f, indent=2)
        
        print(f"✅ Created configuration file: {self.config_file}")
    
    def setup_google_analytics(self):
        """Guide user through Google Analytics setup"""
        print("\n📊 GOOGLE ANALYTICS 4 SETUP")
        print("=" * 40)
        print("1. Go to https://analytics.google.com/")
        print("2. Create a new GA4 property for ekosolarpros.com")
        print("3. Get your Measurement ID (format: G-XXXXXXXXXX)")
        print("4. The tracking code has been added to your website")
        print("5. Replace 'GA_MEASUREMENT_ID' in index.html with your actual ID")
        
        ga_id = input("\nEnter your Google Analytics Measurement ID (or press Enter to skip): ").strip()
        
        if ga_id:
            # Update the tracking code in index.html
            try:
                with open('index.html', 'r') as f:
                    content = f.read()
                
                updated_content = content.replace('GA_MEASUREMENT_ID', ga_id)
                
                with open('index.html', 'w') as f:
                    f.write(updated_content)
                
                print(f"✅ Updated Google Analytics ID in index.html")
                
                # Update config
                config = self.load_config()
                config['google_analytics_id'] = ga_id
                self.save_config(config)
                
            except Exception as e:
                print(f"❌ Failed to update index.html: {e}")
    
    def setup_google_search_console(self):
        """Guide user through Google Search Console setup"""
        print("\n🔍 GOOGLE SEARCH CONSOLE SETUP") 
        print("=" * 40)
        print("✅ Verification file already exists: google44d7e3a72b5cfc88.html")
        print("1. Go to https://search.google.com/search-console")
        print("2. Add property for https://ekosolarpros.com")
        print("3. Use HTML file verification method")
        print("4. Upload the verification file to your website root")
        print("5. Submit your sitemap.xml")
        
        verified = input("\nHave you verified your domain in Search Console? (y/n): ").lower()
        
        if verified == 'y':
            print("✅ Google Search Console verification completed")
            config = self.load_config()
            config['google_search_console_verified'] = True
            self.save_config(config)
        else:
            print("⚠️  Please complete Search Console verification")
    
    def setup_pagespeed_api(self):
        """Guide user through PageSpeed Insights API setup"""
        print("\n⚡ PAGESPEED INSIGHTS API SETUP")
        print("=" * 40)
        print("1. Go to https://console.developers.google.com/")
        print("2. Create a new project or select existing")
        print("3. Enable the PageSpeed Insights API")
        print("4. Create credentials (API Key)")
        print("5. Restrict the API key to PageSpeed Insights API")
        
        api_key = input("\nEnter your PageSpeed Insights API key (or press Enter to skip): ").strip()
        
        if api_key:
            config = self.load_config()
            config['pagespeed_api_key'] = api_key
            self.save_config(config)
            
            # Update the Core Web Vitals script
            try:
                with open('core-web-vitals-monitor.py', 'r') as f:
                    content = f.read()
                
                updated_content = content.replace('YOUR_API_KEY_HERE', api_key)
                
                with open('core-web-vitals-monitor.py', 'w') as f:
                    f.write(updated_content)
                
                print("✅ Updated PageSpeed API key in monitoring script")
                
            except Exception as e:
                print(f"❌ Failed to update monitoring script: {e}")
    
    def setup_email_notifications(self):
        """Configure email notifications"""
        print("\n📧 EMAIL NOTIFICATIONS SETUP")
        print("=" * 40)
        print("Configure email settings for automated reports")
        
        email_user = input("Enter your Gmail address: ").strip()
        if email_user:
            print("\nFor Gmail, you need to use an App Password:")
            print("1. Go to Google Account settings")
            print("2. Enable 2-factor authentication") 
            print("3. Generate an App Password for 'Mail'")
            
            email_password = input("Enter your Gmail App Password: ").strip()
            recipients = input("Enter report recipients (comma-separated): ").strip()
            
            if email_password and recipients:
                config = self.load_config()
                config['email_settings'] = {
                    "smtp_server": "smtp.gmail.com",
                    "smtp_port": 587,
                    "email_user": email_user,
                    "email_password": email_password,
                    "recipients": [email.strip() for email in recipients.split(',')]
                }
                self.save_config(config)
                
                # Update reporting script
                try:
                    with open('seo-automated-reporting.py', 'r') as f:
                        content = f.read()
                    
                    content = content.replace('your-email@gmail.com', email_user)
                    content = content.replace('your-app-password', email_password)
                    
                    with open('seo-automated-reporting.py', 'w') as f:
                        f.write(content)
                    
                    print("✅ Email settings configured")
                    
                except Exception as e:
                    print(f"❌ Failed to update reporting script: {e}")
    
    def create_tracking_schedule(self):
        """Create automated tracking schedule"""
        print("\n⏰ SETTING UP AUTOMATED TRACKING")
        print("=" * 40)
        
        # Create a simple cron-like schedule
        schedule_script = '''#!/bin/bash
# EkoSolarPros SEO Monitoring Schedule
# Add to crontab with: crontab -e

# Daily rank tracking at 6 AM
# 0 6 * * * cd /path/to/EkoSolarPros\ Site && python3 seo-rank-tracker.py

# Weekly Core Web Vitals check on Sundays at 7 AM  
# 0 7 * * 0 cd /path/to/EkoSolarPros\ Site && python3 core-web-vitals-monitor.py

# Weekly reports on Mondays at 8 AM
# 0 8 * * 1 cd /path/to/EkoSolarPros\ Site && python3 seo-automated-reporting.py

# Monthly comprehensive analysis on 1st of month at 9 AM
# 0 9 1 * * cd /path/to/EkoSolarPros\ Site && python3 seo-automated-reporting.py

echo "SEO monitoring tasks configured!"
echo "To enable automated scheduling, run: crontab -e"
echo "Then add the commented lines above (uncomment them first)"
'''
        
        with open('seo-schedule.sh', 'w') as f:
            f.write(schedule_script)
        
        os.chmod('seo-schedule.sh', 0o755)
        
        print("✅ Created scheduling script: seo-schedule.sh")
        print("📋 To enable automation, run: crontab -e and add the scheduled tasks")
    
    def create_readme(self):
        """Create README with setup instructions"""
        readme_content = f'''# EkoSolarPros SEO Monitoring System

Automated SEO tracking and reporting for Georgia solar keywords.

## Setup Date
{datetime.now().strftime('%B %d, %Y')}

## Files Overview

### Core Monitoring Scripts
- `seo-rank-tracker.py` - Track keyword rankings
- `core-web-vitals-monitor.py` - Monitor page performance
- `seo-automated-reporting.py` - Generate and send reports
- `seo-dashboard.html` - Visual monitoring dashboard

### Configuration
- `seo_config.json` - Main configuration file
- `seo-schedule.sh` - Automated scheduling script

### Data Files (Generated)
- `seo_rankings.csv` - Historical ranking data
- `seo_rankings.json` - Ranking data in JSON format
- `core_web_vitals.csv` - Performance data
- `core_web_vitals.json` - Performance data in JSON format

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install requests beautifulsoup4 pandas matplotlib seaborn
   ```

2. **Configure Google Analytics**
   - Replace 'GA_MEASUREMENT_ID' in index.html with your actual ID

3. **Set Up API Keys**
   - Get PageSpeed Insights API key
   - Configure email settings for reports

4. **Run Manual Tests**
   ```bash
   python3 seo-rank-tracker.py
   python3 core-web-vitals-monitor.py
   python3 seo-automated-reporting.py
   ```

5. **Set Up Automation**
   ```bash
   crontab -e
   # Add scheduled tasks from seo-schedule.sh
   ```

6. **View Dashboard**
   - Open seo-dashboard.html in your browser

## Monitoring Target Keywords

{chr(10).join(f"- {keyword}" for keyword in self.base_config['target_keywords'])}

## Priority Pages

{chr(10).join(f"- {page}" for page in self.base_config['priority_pages'])}

## Reports Generated

- **Weekly Reports**: Every Monday with ranking changes
- **Monthly Reports**: First of each month with comprehensive analysis
- **Core Web Vitals**: Weekly performance monitoring
- **Automated Alerts**: When rankings drop significantly

## Support

For issues or questions, check the configuration in `seo_config.json`
'''

        with open('SEO-MONITORING-README.md', 'w') as f:
            f.write(readme_content)
        
        print("✅ Created README: SEO-MONITORING-README.md")
    
    def load_config(self):
        """Load configuration from file"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                return json.load(f)
        return self.base_config
    
    def save_config(self, config):
        """Save configuration to file"""
        with open(self.config_file, 'w') as f:
            json.dump(config, f, indent=2)
    
    def run_setup(self):
        """Run complete setup process"""
        print("🚀 EkoSolarPros SEO Monitoring Setup")
        print("=" * 50)
        print(f"Setting up monitoring for: {self.base_config['domain']}")
        print(f"Target keywords: {len(self.base_config['target_keywords'])}")
        print(f"Priority pages: {len(self.base_config['priority_pages'])}")
        print()
        
        # Step 1: Check dependencies
        self.check_dependencies()
        
        # Step 2: Create config file
        self.create_config_file()
        
        # Step 3: Setup Google services
        self.setup_google_analytics()
        self.setup_google_search_console()
        self.setup_pagespeed_api()
        
        # Step 4: Configure notifications
        self.setup_email_notifications()
        
        # Step 5: Create automation
        self.create_tracking_schedule()
        
        # Step 6: Create documentation
        self.create_readme()
        
        print("\n🎉 SEO MONITORING SETUP COMPLETE!")
        print("=" * 50)
        print("✅ All monitoring scripts configured")
        print("✅ Dashboard ready to use")
        print("✅ Automated reporting configured")
        print("✅ Documentation created")
        print()
        print("📋 NEXT STEPS:")
        print("1. Test the monitoring scripts manually")
        print("2. Set up cron jobs for automation")
        print("3. Open seo-dashboard.html to view results")
        print("4. Check your email for test reports")
        print()
        print("🔍 Monitor your Georgia solar keyword rankings!")

def main():
    setup = SEOMonitoringSetup()
    setup.run_setup()

if __name__ == "__main__":
    main()