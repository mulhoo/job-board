import requests
from bs4 import BeautifulSoup
import time
import re
from datetime import datetime
from typing import List, Dict, Optional

class IndeedScraper:
    def __init__(self):
        self.base_url = "https://www.indeed.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        self.last_request_time = 0

    def rate_limit(self):
        """Ensure minimum time between requests"""
        elapsed = time.time() - self.last_request_time
        if elapsed < 2:
            time.sleep(2 - elapsed)
        self.last_request_time = time.time()

    def search_jobs(self, query: str = "software engineer", location: str = "San Francisco, CA", limit: int = 10) -> List[Dict]:
        """Scrape jobs from Indeed with pagination and error handling"""
        jobs = []

        for start in range(0, limit, 10):
            try:
                self.rate_limit()
                page_jobs = self._scrape_page(query, location, start)
                jobs.extend(page_jobs)

                if len(page_jobs) < 10 or len(jobs) >= limit:
                    break

            except Exception as e:
                print(f"Error scraping page starting at {start}: {e}")
                break

        return jobs[:limit]

    def _scrape_page(self, query: str, location: str, start: int, retries: int = 3) -> List[Dict]:
        """Scrape a single page with retry logic"""
        search_url = f"{self.base_url}/jobs"
        params = {
            'q': query,
            'l': location,
            'start': start
        }

        for attempt in range(retries):
            try:
                response = requests.get(search_url, headers=self.headers, params=params, timeout=10)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')
                job_cards = soup.find_all('div', {'class': re.compile(r'job_seen_beacon|slider_container|jobsearch-SerpJobCard')})

                page_jobs = []
                for card in job_cards:
                    job_data = self._extract_job_data(card)
                    if job_data:
                        page_jobs.append(job_data)

                return page_jobs

            except requests.RequestException as e:
                if attempt == retries - 1:
                    print(f"Failed to scrape page after {retries} attempts: {e}")
                    return []

                wait_time = 2 ** attempt
                print(f"Request failed (attempt {attempt + 1}), retrying in {wait_time}s...")
                time.sleep(wait_time)

            except Exception as e:
                print(f"Unexpected error on attempt {attempt + 1}: {e}")
                if attempt == retries - 1:
                    return []
                time.sleep(1)

        return []

    def _extract_job_data(self, card) -> Optional[Dict]:
        """Extract job data from a job card"""
        try:
            title_elem = (card.find('h2', {'class': re.compile(r'jobTitle')}) or
                         card.find('a', {'data-jk': True}) or
                         card.find('span', {'title': True}))
            title = title_elem.get_text(strip=True) if title_elem else "Unknown Title"

            company_elem = (card.find('span', {'class': re.compile(r'companyName')}) or
                           card.find('div', {'class': re.compile(r'company')}) or
                           card.find('a', {'class': re.compile(r'company')}))
            company = company_elem.get_text(strip=True) if company_elem else "Unknown Company"

            location_elem = (card.find('div', {'class': re.compile(r'companyLocation')}) or
                            card.find('span', {'class': re.compile(r'location')}))
            location = location_elem.get_text(strip=True) if location_elem else "Remote"

            salary_elem = card.find('span', {'class': re.compile(r'salary|estimated')})
            salary = salary_elem.get_text(strip=True) if salary_elem else None

            snippet_elem = (card.find('div', {'class': re.compile(r'job-snippet')}) or
                           card.find('span', title=True) or
                           card.find('div', {'class': re.compile(r'summary')}))
            description = snippet_elem.get_text(strip=True) if snippet_elem else "No description available"

            job_url = None
            link_elem = card.find('h2', {'class': re.compile(r'jobTitle')})
            if link_elem:
                a_tag = link_elem.find('a')
                if a_tag and a_tag.get('href'):
                    href = a_tag['href']
                    if href.startswith('/'):
                        job_url = self.base_url + href
                    else:
                        job_url = href

            if title == "Unknown Title" and company == "Unknown Company":
                return None

            return {
                'title': title,
                'company': company,
                'location': location,
                'salary_range': salary,
                'description': description,
                'source': 'Indeed',
                'external_url': job_url,
                'scraped_at': datetime.now().isoformat(),
                'confidence_score': self._calculate_confidence(title, company, description, salary)
            }

        except Exception as e:
            print(f"Error extracting job data: {e}")
            return None

    def _calculate_confidence(self, title: str, company: str, description: str, salary: Optional[str]) -> int:
        """Calculate confidence score based on data completeness"""
        score = 60

        if title and title != "Unknown Title":
            score += 20
        if company and company != "Unknown Company":
            score += 15
        if description and len(description) > 50:
            score += 10
        if salary:
            score += 5

        return min(score, 100)

    def get_source_info(self) -> Dict:
        """Return information about this scraper source"""
        return {
            'name': 'indeed',
            'display_name': 'Indeed',
            'base_url': self.base_url,
            'rate_limit_seconds': 2,
            'supports_pagination': True,
            'max_recommended_limit': 100
        }