---
name: pdf-to-markdown
description: Convert any PDF (scanned or digital) to structured Markdown. Supports OCR for scanned documents, preserves document structure, handles multiple languages.
---

# PDF to Markdown Converter

Convert any PDF document (scanned or digital) to well-structured Markdown for further processing, knowledge ingestion, or documentation.

## When to Use

- Converting PDF manuals, guides, or documentation to Markdown
- Extracting text from scanned documents using OCR
- Preparing documents for knowledge base ingestion
- Converting research papers or reports to editable format
- Processing multi-language documents

## Prerequisites

Required system packages:
```bash
apt-get install -y tesseract-ocr tesseract-ocr-chi-sim poppler-utils
```

Required Python packages:
```bash
pip install pdfplumber pymupdf pdf2image pytesseract pillow -i https://mirrors.aliyun.com/pypi/simple/
```

## Quick Start

```python
from skills.pdf_to_markdown import convert_pdf_to_markdown

# Simple conversion
md_path = convert_pdf_to_markdown('document.pdf')

# With options
md_path = convert_pdf_to_markdown(
    pdf_path='document.pdf',
    output_dir='./output',
    title='My Document',
    languages='chi_sim+eng',  # For Chinese+English OCR
    dpi=150
)
```

## Features

### 1. Automatic PDF Type Detection

Automatically detects if PDF is scanned or digital:
- **Digital PDF**: Extracts selectable text directly
- **Scanned PDF**: Uses OCR with configurable languages

### 2. Multi-Language OCR Support

Common Tesseract language packs:
- `eng` - English
- `chi_sim` - Simplified Chinese
- `chi_tra` - Traditional Chinese
- `jpn` - Japanese
- `kor` - Korean
- `deu` - German
- `fra` - French

Install additional languages:
```bash
apt-get install tesseract-ocr-<lang>
```

### 3. Document Structure Preservation

- Preserves page boundaries
- Maintains paragraph structure
- Handles headers and sections
- Clean whitespace normalization

## Usage Examples

### Basic Usage

```python
from skills.pdf_to_markdown import convert_pdf_to_markdown

md_path = convert_pdf_to_markdown('manual.pdf')
print(f"Converted: {md_path}")
```

### CLI Usage

```bash
# Basic conversion
python -m skills.pdf_to_markdown document.pdf

# With options
python -m skills.pdf_to_markdown document.pdf -o ./output -t "My Title" -l chi_sim+eng
```

### Advanced Usage

```python
from skills.pdf_to_markdown import (
    convert_pdf_to_markdown,
    extract_digital_pdf,
    extract_scanned_pdf
)

# Force specific extraction method
pages = extract_digital_pdf('digital.pdf')  # For digital PDFs
pages = extract_scanned_pdf('scanned.pdf', languages='eng', dpi=200)  # For scanned PDFs

# Custom markdown generation
from skills.pdf_to_markdown import generate_markdown

generate_markdown(
    pages=pages,
    title="Custom Title",
    output_path="output.md",
    include_page_numbers=True,
    page_separator="---"
)
```

## Integration with ACE

After converting PDF to Markdown:

```bash
# Ingest for knowledge base
ace knowledge ingest output.md --tags <category>

# Or use in device onboarding
ace knowledge ingest output.md --tags device:<device-id>
```

## API Reference

### `convert_pdf_to_markdown(pdf_path, output_dir=None, title=None, languages='chi_sim+eng', dpi=150)`

Main function to convert PDF to Markdown.

**Parameters:**
- `pdf_path` (str): Path to PDF file
- `output_dir` (str, optional): Output directory (default: same as PDF)
- `title` (str, optional): Document title (default: derived from filename)
- `languages` (str): OCR languages for scanned PDFs (default: 'chi_sim+eng')
- `dpi` (int): OCR resolution (default: 150)

**Returns:**
- `Path`: Path to generated Markdown file

**Raises:**
- `FileNotFoundError`: If PDF file not found
- `ImportError`: If required dependencies not installed

### `extract_digital_pdf(pdf_path)`

Extract text from digital PDF with selectable text.

### `extract_scanned_pdf(pdf_path, dpi=150, languages='chi_sim+eng')`

Extract text from scanned PDF using OCR.

### `generate_markdown(pages, title, output_path, **options)`

Generate Markdown from extracted pages.

## Error Handling

Common issues and solutions:

### Missing Tesseract
```
Error: tesseract is not installed or it's not in your PATH
Solution: apt-get install -y tesseract-ocr
```

### Missing Poppler
```
Error: Unable to get page count. Is poppler installed?
Solution: apt-get install -y poppler-utils
```

### OCR Language Not Found
```
Error: Failed to load language 'chi_sim'
Solution: apt-get install -y tesseract-ocr-chi-sim
```

## Canonical Statements

- "Converting PDF to Markdown..."
- "Detecting PDF type (scanned vs digital)..."
- "Using OCR for scanned document with [languages]..."
- "Extracting text from digital PDF..."
- "✓ PDF converted to Markdown: [path]"
- "Ready for ACE knowledge ingestion"

## See Also

- `parse-device-manual` - Specialized version for device manual parsing with ACE-specific formatting
