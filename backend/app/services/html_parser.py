import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from typing import Dict, Any, List

class HTMLParserService:
    @staticmethod
    def parse_page(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        html_content = raw_data.get("content", "")
        base_url = raw_data.get("url", "")
        soup = BeautifulSoup(html_content, "html.parser")
        
        # Remove noisy elements (scripts, styles, nav menus)
        for tag in soup(["script", "style", "noscript", "svg"]):
            tag.decompose()

        page_title = soup.title.string.strip() if soup.title and soup.title.string else "MoTA Official Page"
        
        # Discover linked PDF guidelines and circulars
        extracted_documents: List[Dict[str, Any]] = []
        for link in soup.find_all("a", href=True):
            href = link["href"].strip()
            full_url = urljoin(base_url, href)
            link_text = link.get_text(separator=" ", strip=True)
            
            # Identify official guideline / scheme document links
            is_pdf = full_url.lower().endswith(".pdf") or "pdf" in href.lower()
            is_relevant = any(k in link_text.lower() or k in href.lower() for k in [
                "guideline", "scheme", "fellowship", "scholarship", "circular", "notification", "revised", "format"
            ])
            
            if is_pdf or is_relevant:
                extracted_documents.append({
                    "title": link_text if link_text else "Official Document Link",
                    "url": full_url,
                    "document_type": "GUIDELINE_PDF" if is_pdf else "CIRCULAR_LINK",
                    "mime_type": "application/pdf" if is_pdf else "text/html"
                })

        # Extract main text
        main_text = soup.get_text(separator="\n", strip=True)
        # Deduplicate sequential whitespace
        cleaned_text = re.sub(r'\n{3,}', '\n\n', main_text)

        return {
            "status": "SUCCESS",
            "page_title": page_title,
            "url": base_url,
            "extracted_text": cleaned_text,
            "extracted_documents": extracted_documents,
            "document_count_found": len(extracted_documents)
        }
