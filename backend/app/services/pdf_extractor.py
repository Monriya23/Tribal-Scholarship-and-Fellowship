import io
import hashlib
import re
from typing import Dict, Any, List
import pypdf

class PDFExtractorService:
    @staticmethod
    def extract_from_bytes(pdf_bytes: bytes, source_url: str = "") -> Dict[str, Any]:
        try:
            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            total_pages = len(reader.pages)
            
            pages_text: List[Dict[str, Any]] = []
            full_text_list: List[str] = []
            chunks: List[Dict[str, Any]] = []
            
            chunk_counter = 0
            for idx, page in enumerate(reader.pages):
                page_num = idx + 1
                text = page.extract_text() or ""
                cleaned_text = re.sub(r'[ \t]+', ' ', text).strip()
                
                pages_text.append({
                    "page_number": page_num,
                    "text": cleaned_text,
                    "char_count": len(cleaned_text)
                })
                full_text_list.append(f"--- PAGE {page_num} ---\n" + cleaned_text)
                
                # Split page into logical paragraph chunks (approx 300-500 words)
                paragraphs = [p.strip() for p in cleaned_text.split('\n\n') if p.strip()]
                if not paragraphs and cleaned_text:
                    paragraphs = [cleaned_text]
                    
                for para in paragraphs:
                    if len(para) > 40:  # Ignore trivial headers
                        chunk_counter += 1
                        # Attempt to infer section header
                        first_line = para.split('\n')[0][:80]
                        chunks.append({
                            "chunk_index": chunk_counter,
                            "page_number": page_num,
                            "section_title": first_line if any(c.isdigit() for c in first_line[:5]) else f"Page {page_num} Clause",
                            "content": para
                        })
            
            combined_text = "\n\n".join(full_text_list)
            content_hash = hashlib.sha256(pdf_bytes).hexdigest()
            
            return {
                "status": "SUCCESS",
                "total_pages": total_pages,
                "content_hash": content_hash,
                "extracted_text": combined_text,
                "pages": pages_text,
                "chunks": chunks,
                "chunk_count": len(chunks)
            }
        except Exception as e:
            return {
                "status": "FAILED",
                "error": f"Failed to extract PDF text: {str(e)}",
                "extracted_text": "",
                "chunks": []
            }
