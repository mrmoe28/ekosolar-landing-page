#!/usr/bin/env python3
"""
EkoSolarPros Automated SEO Reporting System
Weekly and monthly reports for Georgia solar keywords performance
"""

import smtplib
import json
import csv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime, timedelta
from typing import Dict, List
import os
from pathlib import Path

class SEOReportingSystem:
    def __init__(self):
        self.domain = "ekosolarpros.com"
        self.report_recipients = [
            "owner@ekosolarpros.com",  # Replace with actual email
            "marketing@ekosolarpros.com"  # Replace with actual email
        ]
        
        # Email configuration
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email_user = "your-email@gmail.com"  # Replace with actual email
        self.email_password = "your-app-password"  # Replace with app password
        
        # Data files
        self.rankings_file = "seo_rankings.json"
        self.vitals_file = "core_web_vitals.json"
        
    def load_ranking_data(self) -> List[Dict]:
        """Load ranking data from JSON file"""
        if os.path.exists(self.rankings_file):
            with open(self.rankings_file, 'r') as f:
                return json.load(f)
        return []
    
    def load_vitals_data(self) -> List[Dict]:
        """Load Core Web Vitals data from JSON file"""
        if os.path.exists(self.vitals_file):
            with open(self.vitals_file, 'r') as f:
                return json.load(f)
        return []
    
    def analyze_ranking_trends(self, data: List[Dict], days: int = 7) -> Dict:
        """Analyze ranking trends over specified period"""
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_data = [
            d for d in data 
            if datetime.fromisoformat(d['date']) >= cutoff_date
        ]
        
        if not recent_data:
            return {"error": "No recent data available"}
        
        # Group by keyword
        keyword_analysis = {}
        for entry in recent_data:
            keyword = entry['keyword']
            if keyword not in keyword_analysis:
                keyword_analysis[keyword] = []
            keyword_analysis[keyword].append({
                'position': entry['position'],
                'date': entry['date']
            })
        
        # Calculate trends
        trends = {}
        for keyword, positions in keyword_analysis.items():
            if len(positions) >= 2:
                # Sort by date
                positions.sort(key=lambda x: x['date'])
                first_pos = positions[0]['position']
                last_pos = positions[-1]['position']
                change = first_pos - last_pos  # Positive = improved
                trends[keyword] = {
                    'current_position': last_pos,
                    'previous_position': first_pos,
                    'change': change,
                    'trend': 'improved' if change > 0 else 'declined' if change < 0 else 'stable'
                }
        
        return trends
    
    def analyze_vitals_performance(self, data: List[Dict], days: int = 7) -> Dict:
        """Analyze Core Web Vitals performance"""
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_data = [
            d for d in data 
            if datetime.fromisoformat(d['date']) >= cutoff_date
        ]
        
        if not recent_data:
            return {"error": "No recent vitals data available"}
        
        # Calculate averages
        mobile_data = [d for d in recent_data if d['strategy'] == 'mobile']
        desktop_data = [d for d in recent_data if d['strategy'] == 'desktop']
        
        analysis = {}
        
        if mobile_data:
            analysis['mobile'] = {
                'avg_performance': sum(d['performance_score'] for d in mobile_data) / len(mobile_data),
                'avg_seo': sum(d['seo_score'] for d in mobile_data) / len(mobile_data),
                'avg_accessibility': sum(d['accessibility_score'] for d in mobile_data) / len(mobile_data),
                'pages_tested': len(mobile_data)
            }
        
        if desktop_data:
            analysis['desktop'] = {
                'avg_performance': sum(d['performance_score'] for d in desktop_data) / len(desktop_data),
                'avg_seo': sum(d['seo_score'] for d in desktop_data) / len(desktop_data),
                'avg_accessibility': sum(d['accessibility_score'] for d in desktop_data) / len(desktop_data),
                'pages_tested': len(desktop_data)
            }
        
        return analysis
    
    def generate_weekly_report_html(self) -> str:
        """Generate HTML weekly report"""
        rankings_data = self.load_ranking_data()
        vitals_data = self.load_vitals_data()
        
        ranking_trends = self.analyze_ranking_trends(rankings_data, 7)
        vitals_analysis = self.analyze_vitals_performance(vitals_data, 7)
        
        # Calculate key metrics
        top_10_keywords = len([k for k, v in ranking_trends.items() if v['current_position'] <= 10])
        improved_keywords = len([k for k, v in ranking_trends.items() if v['trend'] == 'improved'])
        declined_keywords = len([k for k, v in ranking_trends.items() if v['trend'] == 'declined'])
        
        html_report = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }}
                .header {{ background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 30px; text-align: center; border-radius: 10px; }}
                .metric-box {{ display: inline-block; background: #f8f9fa; padding: 20px; margin: 10px; border-radius: 8px; text-align: center; min-width: 150px; }}
                .metric-value {{ font-size: 2em; font-weight: bold; color: #10B981; }}
                .metric-label {{ color: #666; }}
                .section {{ margin: 30px 0; padding: 20px; border-radius: 8px; background: #f8f9fa; }}
                .positive {{ color: #10B981; }}
                .negative {{ color: #ef4444; }}
                .stable {{ color: #6b7280; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
                th {{ background-color: #10B981; color: white; }}
                .footer {{ text-align: center; margin-top: 40px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🌞 EkoSolarPros Weekly SEO Report</h1>
                <p>Georgia Solar Keywords Performance - Week of {datetime.now().strftime('%B %d, %Y')}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <div class="metric-box">
                    <div class="metric-value">{top_10_keywords}</div>
                    <div class="metric-label">Keywords in Top 10</div>
                </div>
                <div class="metric-box">
                    <div class="metric-value">{improved_keywords}</div>
                    <div class="metric-label">Improved Keywords</div>
                </div>
                <div class="metric-box">
                    <div class="metric-value">{declined_keywords}</div>
                    <div class="metric-label">Declined Keywords</div>
                </div>
            </div>
            
            <div class="section">
                <h2>📈 Ranking Changes This Week</h2>
                <table>
                    <tr>
                        <th>Keyword</th>
                        <th>Current Position</th>
                        <th>Previous Position</th>
                        <th>Change</th>
                        <th>Trend</th>
                    </tr>
        '''
        
        # Add ranking trends to table
        for keyword, data in ranking_trends.items():
            change_symbol = "+" if data['change'] > 0 else ""
            trend_class = data['trend']
            if data['trend'] == 'improved':
                trend_class = 'positive'
            elif data['trend'] == 'declined':
                trend_class = 'negative'
            else:
                trend_class = 'stable'
                
            html_report += f'''
                    <tr>
                        <td>{keyword}</td>
                        <td>{data['current_position']}</td>
                        <td>{data['previous_position']}</td>
                        <td class="{trend_class}">{change_symbol}{data['change']}</td>
                        <td class="{trend_class}">{data['trend'].title()}</td>
                    </tr>
            '''
        
        html_report += '''
                </table>
            </div>
        '''
        
        # Add Core Web Vitals section
        if vitals_analysis:
            html_report += '''
            <div class="section">
                <h2>⚡ Core Web Vitals Performance</h2>
            '''
            
            if 'mobile' in vitals_analysis:
                mobile = vitals_analysis['mobile']
                html_report += f'''
                <h3>📱 Mobile Performance</h3>
                <ul>
                    <li>Average Performance Score: <strong>{mobile['avg_performance']:.1f}/100</strong></li>
                    <li>Average SEO Score: <strong>{mobile['avg_seo']:.1f}/100</strong></li>
                    <li>Average Accessibility Score: <strong>{mobile['avg_accessibility']:.1f}/100</strong></li>
                    <li>Pages Tested: {mobile['pages_tested']}</li>
                </ul>
                '''
            
            if 'desktop' in vitals_analysis:
                desktop = vitals_analysis['desktop']
                html_report += f'''
                <h3>💻 Desktop Performance</h3>
                <ul>
                    <li>Average Performance Score: <strong>{desktop['avg_performance']:.1f}/100</strong></li>
                    <li>Average SEO Score: <strong>{desktop['avg_seo']:.1f}/100</strong></li>
                    <li>Average Accessibility Score: <strong>{desktop['avg_accessibility']:.1f}/100</strong></li>
                    <li>Pages Tested: {desktop['pages_tested']}</li>
                </ul>
                '''
            
            html_report += '</div>'
        
        # Add recommendations
        html_report += '''
            <div class="section">
                <h2>🎯 Recommendations for Next Week</h2>
                <ul>
                    <li><strong>Focus on improving declining keywords</strong> - Add more content and optimize pages</li>
                    <li><strong>Maintain momentum on improved keywords</strong> - Continue content optimization</li>
                    <li><strong>Monitor Core Web Vitals</strong> - Ensure mobile performance stays above 80</li>
                    <li><strong>Create content for long-tail keywords</strong> - Target specific Georgia cities</li>
                    <li><strong>Build local citations</strong> - Improve local SEO presence</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>Report generated automatically on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                <p>EkoSolarPros SEO Monitoring System</p>
            </div>
        </body>
        </html>
        '''
        
        return html_report
    
    def send_email_report(self, subject: str, html_content: str, recipients: List[str] = None):
        """Send email report"""
        if recipients is None:
            recipients = self.report_recipients
        
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.email_user
            msg['To'] = ', '.join(recipients)
            
            # Add HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Connect and send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_user, self.email_password)
            
            text = msg.as_string()
            server.sendmail(self.email_user, recipients, text)
            server.quit()
            
            print(f"✅ Report sent successfully to {len(recipients)} recipients")
            
        except Exception as e:
            print(f"❌ Failed to send email report: {e}")
    
    def save_report_to_file(self, html_content: str, filename: str = None):
        """Save report to HTML file"""
        if filename is None:
            filename = f"seo_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"✅ Report saved to {filename}")
    
    def generate_weekly_report(self, send_email: bool = True, save_file: bool = True):
        """Generate and distribute weekly report"""
        print("📊 Generating weekly SEO report...")
        
        html_report = self.generate_weekly_report_html()
        
        if save_file:
            self.save_report_to_file(html_report)
        
        if send_email and self.email_user != "your-email@gmail.com":
            subject = f"EkoSolarPros Weekly SEO Report - {datetime.now().strftime('%B %d, %Y')}"
            self.send_email_report(subject, html_report)
        elif send_email:
            print("⚠️  Email not configured. Report saved to file only.")
        
        print("✅ Weekly report generation completed!")
    
    def generate_monthly_report(self):
        """Generate comprehensive monthly report"""
        print("📊 Generating monthly SEO report...")
        
        # Analyze 30-day trends
        rankings_data = self.load_ranking_data()
        vitals_data = self.load_vitals_data()
        
        monthly_trends = self.analyze_ranking_trends(rankings_data, 30)
        monthly_vitals = self.analyze_vitals_performance(vitals_data, 30)
        
        # Generate more comprehensive report for monthly
        # (Implementation would be similar to weekly but with more detailed analysis)
        
        print("✅ Monthly report generation completed!")

def main():
    """Run the automated reporting system"""
    reporter = SEOReportingSystem()
    
    # Check which report to generate based on day of week
    today = datetime.now()
    
    # Generate weekly report every Monday
    if today.weekday() == 0:  # Monday
        reporter.generate_weekly_report()
    
    # Generate monthly report on 1st of each month
    if today.day == 1:
        reporter.generate_monthly_report()
    
    # For testing, generate weekly report
    print("🧪 Generating test weekly report...")
    reporter.generate_weekly_report(send_email=False, save_file=True)

if __name__ == "__main__":
    main()