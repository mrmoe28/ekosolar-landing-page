#!/usr/bin/env python3
"""
DNS TXT Record Verification Checker for Google Search Console
Checks if the Google verification TXT record is properly configured
"""

import subprocess
import sys
import time
import json
from datetime import datetime

# Configuration
DOMAIN = "ekosolarpros.com"
EXPECTED_TXT_VALUE = "google-site-verification=0MteZqJD37YDp4TuovOagBQhnyYZrb30iHoY2DrUqc8"

class DNSVerificationChecker:
    def __init__(self):
        self.domain = DOMAIN
        self.expected_value = EXPECTED_TXT_VALUE
        self.dns_servers = [
            ("8.8.8.8", "Google DNS"),
            ("1.1.1.1", "Cloudflare DNS"),
            ("208.67.222.222", "OpenDNS"),
        ]
    
    def check_txt_record(self, dns_server=None):
        """Check TXT records for the domain"""
        try:
            if dns_server:
                cmd = f"nslookup -type=TXT {self.domain} {dns_server}"
            else:
                cmd = f"nslookup -type=TXT {self.domain}"
            
            result = subprocess.run(
                cmd, 
                shell=True, 
                capture_output=True, 
                text=True,
                timeout=10
            )
            
            output = result.stdout + result.stderr
            return output
            
        except subprocess.TimeoutExpired:
            return "Timeout: DNS query took too long"
        except Exception as e:
            return f"Error: {str(e)}"
    
    def parse_txt_records(self, output):
        """Parse TXT records from nslookup output"""
        txt_records = []
        lines = output.split('\n')
        
        for line in lines:
            if 'text =' in line or 'TXT' in line:
                # Extract the value between quotes
                if '"' in line:
                    start = line.find('"')
                    end = line.rfind('"')
                    if start != -1 and end != -1 and start < end:
                        txt_value = line[start+1:end]
                        txt_records.append(txt_value)
        
        return txt_records
    
    def verify_google_record(self, txt_records):
        """Check if Google verification record exists"""
        for record in txt_records:
            if record == self.expected_value or self.expected_value in record:
                return True
        return False
    
    def check_all_dns_servers(self):
        """Check TXT record across multiple DNS servers"""
        results = {}
        
        print(f"🔍 Checking DNS TXT records for {self.domain}")
        print("=" * 60)
        
        for dns_server, name in self.dns_servers:
            print(f"\n📡 Checking {name} ({dns_server})...")
            
            output = self.check_txt_record(dns_server)
            txt_records = self.parse_txt_records(output)
            has_google_record = self.verify_google_record(txt_records)
            
            results[name] = {
                "server": dns_server,
                "txt_records": txt_records,
                "has_google_verification": has_google_record,
                "timestamp": datetime.now().isoformat()
            }
            
            if has_google_record:
                print(f"✅ Google verification record FOUND on {name}")
                print(f"   Record: {self.expected_value}")
            else:
                print(f"❌ Google verification record NOT found on {name}")
                if txt_records:
                    print(f"   Found TXT records: {txt_records}")
                else:
                    print(f"   No TXT records found")
        
        return results
    
    def generate_report(self, results):
        """Generate a detailed report"""
        print("\n" + "=" * 60)
        print("📊 DNS VERIFICATION REPORT")
        print("=" * 60)
        
        verified_count = sum(1 for r in results.values() if r["has_google_verification"])
        total_count = len(results)
        
        print(f"\nDomain: {self.domain}")
        print(f"Expected TXT Value: {self.expected_value}")
        print(f"\nVerification Status: {verified_count}/{total_count} DNS servers confirmed")
        
        if verified_count == total_count:
            print("\n✅ SUCCESS: DNS record is fully propagated!")
            print("You can now verify in Google Search Console.")
            return True
        elif verified_count > 0:
            print("\n⚠️ PARTIAL: DNS record is propagating...")
            print(f"Detected on {verified_count} out of {total_count} DNS servers.")
            print("Wait a few more minutes for full propagation.")
            return False
        else:
            print("\n❌ NOT FOUND: DNS record not detected yet.")
            print("\nPossible reasons:")
            print("1. Record was just added (wait 5-30 minutes)")
            print("2. Record not added correctly to DNS provider")
            print("3. TTL hasn't expired yet (can take up to 48 hours)")
            print("\nNext steps:")
            print("1. Verify you added the TXT record correctly")
            print("2. Check your DNS provider's control panel")
            print("3. Wait and check again in 15 minutes")
            return False
    
    def continuous_check(self, interval=60, max_attempts=30):
        """Continuously check DNS until record is found"""
        print(f"🔄 Starting continuous DNS monitoring...")
        print(f"Checking every {interval} seconds for up to {max_attempts} attempts")
        print("Press Ctrl+C to stop\n")
        
        for attempt in range(1, max_attempts + 1):
            print(f"\n--- Attempt {attempt}/{max_attempts} ---")
            
            results = self.check_all_dns_servers()
            is_verified = self.generate_report(results)
            
            if is_verified:
                print("\n🎉 DNS verification record is ready!")
                print("You can now click VERIFY in Google Search Console.")
                self.save_status(True)
                return True
            
            if attempt < max_attempts:
                print(f"\n⏳ Waiting {interval} seconds before next check...")
                try:
                    time.sleep(interval)
                except KeyboardInterrupt:
                    print("\n\n⏹️ Monitoring stopped by user.")
                    break
        
        print("\n⏰ Maximum attempts reached. Please check manually later.")
        return False
    
    def save_status(self, is_verified):
        """Save verification status to file"""
        status = {
            "domain": self.domain,
            "txt_value": self.expected_value,
            "is_verified": is_verified,
            "last_check": datetime.now().isoformat(),
            "verification_method": "DNS TXT Record"
        }
        
        with open("dns-verification-status.json", "w") as f:
            json.dump(status, f, indent=2)
        
        print(f"\n💾 Status saved to dns-verification-status.json")

def main():
    """Main function"""
    print("=" * 60)
    print("🔐 Google Search Console DNS Verification Checker")
    print("=" * 60)
    
    checker = DNSVerificationChecker()
    
    # Check if user wants continuous monitoring
    if len(sys.argv) > 1 and sys.argv[1] == "--monitor":
        checker.continuous_check(interval=30, max_attempts=60)
    else:
        # Single check
        results = checker.check_all_dns_servers()
        is_verified = checker.generate_report(results)
        checker.save_status(is_verified)
        
        if not is_verified:
            print("\n💡 Tip: Run with --monitor flag for continuous checking:")
            print(f"   python3 {sys.argv[0]} --monitor")

if __name__ == "__main__":
    main()