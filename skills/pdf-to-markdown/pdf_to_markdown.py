#!/usr/bin/env python3
"""
PDF to Markdown Converter

Convert any PDF document (scanned or digital) to well-structured Markdown.
Supports OCR for scanned documents and handles multiple languages.

Usage:
    from pdf_to_markdown import convert_pdf_to_markdown
    md_path = convert_pdf_to_markdown('document.pdf')

CLI:
    python pdf_to_markdown.py <pdf-file> [options]
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Optional, Tuple


def extract_digital_pdf(pdf_path: str) -> List[Dict]:
    """
    Extract text from digital PDF (selectable text).

    Args:
        pdf_path: Path to PDF file

    Returns:
        List of dicts with 'page' and 'text' keys
    """
    import fitz  # PyMuPDF

    doc = fitz.open(pdf_path)
    pages = []

    for i, page in enumerate(doc):
        text = page.get_text().strip()
        pages.append({"page": i + 1, "text": text})

    doc.close()
    return pages


def extract_scanned_pdf(
    pdf_path: str,
    dpi: int = 150,
    languages: str = 'chi_sim+eng'
) -> List[Dict]:
    """
    Extract text from scanned PDF using OCR.

    Args:
        pdf_path: Path to PDF file
        dpi: Resolution for image conversion (default 150)
        languages: Tesseract language codes (default 'chi_sim+eng')

    Returns:
        List of dicts with 'page' and 'text' keys
    """
    from pdf2image import convert_from_path
    import pytesseract

    print(f"Converting PDF to images (DPI={dpi})...")
    images = convert_from_path(pdf_path, dpi=dpi)

    pages = []
    total = len(images)

    for i, img in enumerate(images):
        print(f"  OCR processing page {i + 1}/{total}...", end='\r')
        text = pytesseract.image_to_string(img, lang=languages)
        pages.append({"page": i + 1, "text": text.strip()})

    print(f"  OCR complete: {total} pages processed")
    return pages


def generate_markdown(
    pages: List[Dict],
    title: str,
    output_path: Path,
    include_page_numbers: bool = True,
    page_separator: str = "---"
) -> Path:
    """
    Generate Markdown document from extracted pages.

    Args:
        pages: List of page dicts with 'page' and 'text' keys
        title: Document title
        output_path: Path for output Markdown file
        include_page_numbers: Whether to include page headers
        page_separator: Separator between pages

    Returns:
        Path to generated Markdown file
    """
    lines = [
        f"# {title}",
        "",
        f"> Converted from PDF: {len(pages)} pages",
        ""
    ]

    for page in pages:
        if not page["text"]:
            continue

        if include_page_numbers:
            lines.append(f"## Page {page['page']}")
            lines.append("")

        # Preserve paragraphs, clean excessive whitespace
        text = page["text"]

        # Normalize whitespace while preserving paragraph breaks
        paragraphs = []
        current_para = []

        for line in text.split('\n'):
            stripped = line.strip()
            if not stripped:
                if current_para:
                    paragraphs.append(' '.join(current_para))
                    current_para = []
            else:
                current_para.append(stripped)

        if current_para:
            paragraphs.append(' '.join(current_para))

        # Add paragraphs to output
        for para in paragraphs:
            if para:
                lines.append(para)
                lines.append("")

        if page_separator:
            lines.append(page_separator)
            lines.append("")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    return output_path


def detect_pdf_type(pdf_path: str) -> Tuple[str, float]:
    """
    Detect if PDF is scanned or digital.

    Args:
        pdf_path: Path to PDF file

    Returns:
        Tuple of (type, confidence) where type is 'digital' or 'scanned'
    """
    import fitz

    doc = fitz.open(pdf_path)
    sample_text = doc[0].get_text()

    # Count meaningful characters
    meaningful_chars = sum(
        1 for c in sample_text
        if 32 <= ord(c) <= 126 or ord(c) > 127
    )

    # Count total characters excluding whitespace
    total_chars = len(sample_text.replace(' ', '').replace('\n', ''))

    doc.close()

    # If less than 100 meaningful chars, likely scanned
    if meaningful_chars < 100:
        return 'scanned', 0.95

    # Calculate ratio of meaningful to total
    if total_chars > 0:
        ratio = meaningful_chars / total_chars
        if ratio > 0.8:
            return 'digital', ratio
        else:
            return 'scanned', 1 - ratio

    return 'scanned', 0.5


def convert_pdf_to_markdown(
    pdf_path: str,
    output_dir: Optional[str] = None,
    title: Optional[str] = None,
    languages: str = 'chi_sim+eng',
    dpi: int = 150,
    include_page_numbers: bool = True,
    force_ocr: bool = False
) -> Path:
    """
    Convert PDF to Markdown.

    Automatically detects if PDF is scanned or digital and uses appropriate
    extraction method.

    Args:
        pdf_path: Path to PDF file
        output_dir: Directory for output markdown (default: same as PDF)
        title: Document title (default: derived from filename)
        languages: OCR languages for scanned PDFs (default: 'chi_sim+eng')
        dpi: OCR resolution for scanned PDFs (default: 150)
        include_page_numbers: Whether to include page headers in output
        force_ocr: Force OCR even if PDF appears to be digital

    Returns:
        Path to generated markdown file

    Raises:
        FileNotFoundError: If PDF file not found
        ImportError: If required dependencies not installed
    """
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    output_dir = Path(output_dir) if output_dir else pdf_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    if title is None:
        title = pdf_path.stem.replace('-', ' ').replace('_', ' ').title()

    output_path = output_dir / f"{pdf_path.stem}.md"

    # Detect PDF type
    pdf_type, confidence = detect_pdf_type(pdf_path)
    print(f"PDF type detected: {pdf_type} (confidence: {confidence:.2%})")

    # Extract based on type
    if pdf_type == 'scanned' or force_ocr:
        print(f"Using OCR with languages: {languages}")
        pages = extract_scanned_pdf(pdf_path, dpi=dpi, languages=languages)
    else:
        print("Extracting digital text...")
        pages = extract_digital_pdf(pdf_path)

    # Generate markdown
    result_path = generate_markdown(
        pages=pages,
        title=title,
        output_path=output_path,
        include_page_numbers=include_page_numbers
    )

    # Print summary
    file_size = os.path.getsize(result_path) / 1024
    total_chars = sum(len(p["text"]) for p in pages)
    print(f"\n✓ Conversion complete")
    print(f"  Output: {result_path}")
    print(f"  Pages: {len(pages)}")
    print(f"  Characters: {total_chars:,}")
    print(f"  File size: {file_size:.1f} KB")

    return result_path


def main():
    """CLI entry point."""
    import argparse

    parser = argparse.ArgumentParser(
        description='Convert PDF to Markdown',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s document.pdf
  %(prog)s document.pdf -o ./output -t "My Title"
  %(prog)s scanned.pdf -l chi_sim+eng --dpi 200
  %(prog)s document.pdf --force-ocr -l eng
        """
    )

    parser.add_argument('pdf', help='Path to PDF file')
    parser.add_argument(
        '-o', '--output-dir',
        help='Output directory (default: same as PDF)'
    )
    parser.add_argument(
        '-t', '--title',
        help='Document title (default: derived from filename)'
    )
    parser.add_argument(
        '-l', '--languages',
        default='chi_sim+eng',
        help='OCR languages, comma-separated (default: chi_sim+eng)'
    )
    parser.add_argument(
        '--dpi',
        type=int,
        default=150,
        help='OCR resolution in DPI (default: 150)'
    )
    parser.add_argument(
        '--force-ocr',
        action='store_true',
        help='Force OCR even for digital PDFs'
    )
    parser.add_argument(
        '--no-page-numbers',
        action='store_true',
        help='Exclude page number headers'
    )

    args = parser.parse_args()

    try:
        md_path = convert_pdf_to_markdown(
            pdf_path=args.pdf,
            output_dir=args.output_dir,
            title=args.title,
            languages=args.languages,
            dpi=args.dpi,
            include_page_numbers=not args.no_page_numbers,
            force_ocr=args.force_ocr
        )

        print(f"\nNext steps:")
        print(f"  - Review: {md_path}")
        print(f"  - Ingest to ACE: ace knowledge ingest {md_path} --tags <category>")

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except ImportError as e:
        print(f"Error: Missing dependency - {e}", file=sys.stderr)
        print("\nInstall required packages:", file=sys.stderr)
        print("  pip install pdfplumber pymupdf pdf2image pytesseract pillow", file=sys.stderr)
        print("\nSystem dependencies:", file=sys.stderr)
        print("  apt-get install -y tesseract-ocr tesseract-ocr-chi-sim poppler-utils", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
