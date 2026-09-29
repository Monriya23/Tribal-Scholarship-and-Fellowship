import abc
import hashlib
import requests
import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
from app.config import settings

class SourceConnector(abc.ABC):
    @abc.abstractmethod
    def discover(self) -> List[str]:
        """Discover URLs or endpoints to crawl."""
        pass

    @abc.abstractmethod
    def fetch(self, url: str) -> Dict[str, Any]:
        """Fetch raw content from given URL."""
        pass

    @abc.abstractmethod
    def parse(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse content and extract metadata."""
        pass

    @abc.abstractmethod
    def extract_documents(self, parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract documents/guidelines found."""
        pass

class WebPageConnector(SourceConnector):
    def __init__(self, base_url: str, user_agent: str = settings.USER_AGENT):
        self.base_url = base_url
        self.user_agent = user_agent
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": self.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.8,*/*;q=0.7",
            "Accept-Language": "en-US,en;q=0.9,hi;q=0.8"
        })

    def discover(self) -> List[str]:
        return [self.base_url]

    def fetch(self, url: str) -> Dict[str, Any]:
        try:
            response = self.session.get(
                url, 
                timeout=settings.REQUEST_TIMEOUT_SECONDS,
                allow_redirects=True,
                verify=True
            )
            
            if response.status_code == 200:
                content_bytes = response.content
                content_hash = hashlib.sha256(content_bytes).hexdigest()
                return {
                    "status": "SUCCESS",
                    "url": url,
                    "status_code": response.status_code,
                    "content": response.text,
                    "content_bytes": content_bytes,
                    "content_hash": content_hash,
                    "content_type": response.headers.get("Content-Type", "text/html"),
                    "fetched_at": datetime.datetime.utcnow().isoformat()
                }
            elif response.status_code in [401, 403]:
                return {
                    "status": "SOURCE_ACCESS_UNAVAILABLE",
                    "url": url,
                    "status_code": response.status_code,
                    "error": f"Public access restricted by source (HTTP {response.status_code})"
                }
            else:
                return {
                    "status": "ERROR",
                    "url": url,
                    "status_code": response.status_code,
                    "error": f"HTTP error {response.status_code}"
                }
        except requests.exceptions.RequestException as e:
            return {
                "status": "SOURCE_ACCESS_UNAVAILABLE",
                "url": url,
                "error": f"Connection failed or timed out: {str(e)}"
            }

    def parse(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        if raw_data.get("status") != "SUCCESS":
            return raw_data
        from app.services.html_parser import HTMLParserService
        return HTMLParserService.parse_page(raw_data)

    def extract_documents(self, parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        return parsed_data.get("extracted_documents", [])

class PDFConnector(SourceConnector):
    def __init__(self, user_agent: str = settings.USER_AGENT):
        self.user_agent = user_agent
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": self.user_agent})

    def discover(self) -> List[str]:
        return []

    def fetch(self, url: str) -> Dict[str, Any]:
        try:
            response = self.session.get(
                url, 
                timeout=settings.REQUEST_TIMEOUT_SECONDS,
                stream=True
            )
            if response.status_code == 200:
                content_bytes = response.content
                if len(content_bytes) > settings.MAX_DOC_DOWNLOAD_BYTES:
                    return {
                        "status": "ERROR",
                        "url": url,
                        "error": "Document size exceeded maximum allowed limit"
                    }
                content_hash = hashlib.sha256(content_bytes).hexdigest()
                return {
                    "status": "SUCCESS",
                    "url": url,
                    "content_bytes": content_bytes,
                    "content_hash": content_hash,
                    "content_type": response.headers.get("Content-Type", "application/pdf"),
                    "fetched_at": datetime.datetime.utcnow().isoformat()
                }
            elif response.status_code in [401, 403]:
                return {
                    "status": "SOURCE_ACCESS_UNAVAILABLE",
                    "url": url,
                    "status_code": response.status_code,
                    "error": f"Public access restricted by source (HTTP {response.status_code})"
                }
            return {"status": "ERROR", "url": url, "error": f"HTTP {response.status_code}"}
        except Exception as e:
            return {"status": "SOURCE_ACCESS_UNAVAILABLE", "url": url, "error": str(e)}

    def parse(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        if raw_data.get("status") != "SUCCESS":
            return raw_data
        from app.services.pdf_extractor import PDFExtractorService
        return PDFExtractorService.extract_from_bytes(raw_data["content_bytes"], raw_data.get("url", ""))

    def extract_documents(self, parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [parsed_data] if parsed_data.get("status") == "SUCCESS" else []

class StaticDocumentConnector(SourceConnector):
    """Handles local authoritative circulars and downloaded gazette copies."""
    def discover(self) -> List[str]:
        return []

    def fetch(self, file_path: str) -> Dict[str, Any]:
        path = Path(file_path)
        if not path.exists():
            return {"status": "ERROR", "error": f"File {file_path} not found"}
        content_bytes = path.read_bytes()
        content_hash = hashlib.sha256(content_bytes).hexdigest()
        return {
            "status": "SUCCESS",
            "url": f"file://{path.absolute()}",
            "content_bytes": content_bytes,
            "content_hash": content_hash,
            "content_type": "application/pdf" if path.suffix == ".pdf" else "text/plain",
            "fetched_at": datetime.datetime.utcnow().isoformat()
        }

    def parse(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        from app.services.pdf_extractor import PDFExtractorService
        return PDFExtractorService.extract_from_bytes(raw_data["content_bytes"], raw_data.get("url", ""))

    def extract_documents(self, parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [parsed_data]

class APIConnector(SourceConnector):
    """Integration-ready connector when official Government APIs become accessible."""
    def discover(self) -> List[str]:
        return []
    def fetch(self, url: str) -> Dict[str, Any]:
        return {"status": "INTEGRATION_READY", "message": "API endpoint integration ready when government keys/endpoints are provisioned"}
    def parse(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return raw_data
    def extract_documents(self, parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        return []
