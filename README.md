# MasterDocs - PDF Management Application.
### Open Source Pdf Management Software
A comprehensive PDF management web application that provides tools for merging, splitting, compressing, and converting PDFs and images. Built with Spring Boot backend and React frontend.

## Features

- **PDF Merge** - Combine multiple PDF files into a single document
- **PDF Split** - Split PDFs by page ranges, every page, or extract specific pages
- **PDF Compress** - Reduce PDF file size with adjustable quality control
- **PDF to Image** - Convert PDF pages to PNG or JPG images with configurable DPI
- **Image to PDF** - Convert multiple images into a single PDF document

## Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **Vite 7.2.4** - Fast build tool and dev server
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **PostCSS** - CSS transformation

### Backend
- **Spring Boot 4.0.2** - Java application framework
- **Java 17** - Programming language
- **Apache PDFBox 2.0.29** - PDF manipulation library
- **Lombok** - Reduce boilerplate code
- **Maven** - Build and dependency management

## Project Structure

```
masterdocs/
├── masterdocs-frontend/       # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PdfMerge.jsx
│   │   │   ├── PdfSplit.jsx
│   │   │   ├── PdfCompress.jsx
│   │   │   ├── PdfToImage.jsx
│   │   │   └── ImageToPdf.jsx
│   │   ├── services/
│   │   │   └── apiService.js # API communication layer
│   │   ├── App.jsx           # Main app with routing
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── package.json
│   └── vite.config.js
│
└── masterdocs-backend/        # Spring Boot backend
    ├── src/
    │   └── main/
    │       ├── java/com/masterdocs/masterdocs/
    │       │   ├── MasterdocsApplication.java
    │       │   ├── config/
    │       │   │   └── WebConfig.java        # CORS configuration
    │       │   ├── controllers/
    │       │   │   └── HomeController.java
    │       │   ├── pdfmerge/
    │       │   │   ├── PdfMergeService.java
    │       │   │   └── PdfMergeController.java
    │       │   ├── pdfsplit/
    │       │   │   ├── PdfSplitService.java
    │       │   │   └── PdfSplitController.java
    │       │   ├── pdfcompress/
    │       │   │   ├── PdfCompressService.java
    │       │   │   └── PdfCompressController.java
    │       │   ├── pdftoimage/
    │       │   │   ├── PdfToImageService.java
    │       │   │   └── PdfToImageController.java
    │       │   └── imagetopdf/
    │       │       ├── ImageToPdfService.java
    │       │       └── ImageToPdfController.java
    │       └── resources/
    │           └── application.properties
    └── pom.xml

```

## Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher) and npm
- **Java 17** or higher
- **Maven** (for building the backend)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd masterdocs-backend
   ```

2. Install dependencies and build:
   ```bash
   mvn clean install
   ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd masterdocs-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install react-router-dom (if not already installed):
   ```bash
   npm install react-router-dom
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173` (or next available port)

## Tool Usage Guide

### 🔗 PDF Merge
Combine multiple PDF files into a single document.

1. Navigate to the **PDF Merge** page from the navbar.
2. Click **Select Files** or drag and drop two or more PDF files.
3. Arrange the files in the desired order.
4. Click **Merge PDFs**.
5. The merged file `merged.pdf` will download automatically.

> **Note:** You must upload at least 2 PDF files for the merge to work.

---

### ✂️ PDF Split
Split a single PDF into multiple parts using three modes:

#### Split by Page Ranges
1. Navigate to the **PDF Split** page.
2. Upload a PDF file.
3. Choose **Split by Ranges** mode.
4. Enter page ranges in the format `1-3,5,7-9` (comma-separated; use a hyphen for a range, or a single number for one page).
5. Click **Split PDF**.
6. A ZIP file `split_pdfs.zip` containing the resulting PDFs will download.

#### Split Every Page
1. Upload a PDF file.
2. Choose **Split Every Page** mode.
3. Click **Split PDF**.
4. A ZIP file `split_pages.zip` with one PDF per page will download.

#### Extract Specific Pages
1. Upload a PDF file.
2. Choose **Extract Pages** mode.
3. Enter individual page numbers in the format `1,3,5`.
4. Click **Extract**.
5. A single PDF `extracted_pages.pdf` containing only the chosen pages will download.

> **Tip:** Use the page count indicator (shown after upload) to know how many pages the document has.

---

### 🗜️ PDF Compress
Reduce the file size of a PDF with adjustable quality.

1. Navigate to the **PDF Compress** page.
2. Upload a PDF file.
3. Adjust the **Quality** slider:
   - `0.1` → Smallest file size, lowest quality
   - `0.7` → Balanced (default)
   - `1.0` → Highest quality, larger file size
4. Click **Compress PDF**.
5. The file `compressed.pdf` will download automatically.

> **Note:** Compression is most effective on PDFs that contain many images.

---

### 🖼️ PDF to Image
Convert each page of a PDF into an image file.

1. Navigate to the **PDF to Image** page.
2. Upload a PDF file.
3. Select the output **Format**:
   - `PNG` – Lossless, larger file size (default)
   - `JPG` – Smaller file size, slight quality loss
4. Select the **DPI** (resolution):
   - `72` – Screen quality
   - `150` – Standard quality (default)
   - `300` – High quality, suitable for printing
5. Click **Convert to Images**.
6. A ZIP file `pdf_images.zip` with one image per page will download.

---

### 📄 Image to PDF
Combine one or more images into a single PDF document.

1. Navigate to the **Image to PDF** page.
2. Click **Select Files** or drag and drop one or more image files (JPG, PNG).
3. Review the selected images.
4. Click **Convert to PDF**.
5. The file `images_to_pdf.pdf` will download automatically.

> **Note:** Images are placed in the order they are selected. Each image becomes one page in the resulting PDF.

---

## API Endpoints

### PDF Merge
- **POST** `/api/pdfmerge/merge`
- **Body**: `multipart/form-data` with `files` (multiple PDFs)
- **Response**: Merged PDF file (`merged.pdf`)

### PDF Split

#### Split by Ranges
- **POST** `/api/pdfsplit/split-by-ranges`
- **Body**: `multipart/form-data`
  - `file`: PDF file
  - `ranges`: Page ranges string (e.g., `"1-3,5,7-9"`)
- **Response**: ZIP file (`split_pdfs.zip`) with split PDFs

#### Split Every Page
- **POST** `/api/pdfsplit/split-every-page`
- **Body**: `multipart/form-data` with `file`
- **Response**: ZIP file (`split_pages.zip`) with individual pages

#### Extract Pages
- **POST** `/api/pdfsplit/extract-pages`
- **Body**: `multipart/form-data`
  - `file`: PDF file
  - `pages`: Comma-separated page numbers (e.g., `"1,3,5"`)
- **Response**: Single PDF (`extracted_pages.pdf`) with extracted pages

#### Get Page Count
- **POST** `/api/pdfsplit/page-count`
- **Body**: `multipart/form-data` with `file`
- **Response**: Integer page count

### PDF Compress
- **POST** `/api/pdfcompress/compress`
- **Body**: `multipart/form-data` with `file`
- **Query Param**: `quality` (float `0.1`–`1.0`, default `0.7`)
- **Response**: Compressed PDF file (`compressed.pdf`)

### PDF to Image
- **POST** `/api/pdftoimage/convert`
- **Body**: `multipart/form-data` with `file`
- **Query Params**:
  - `format`: `"png"` or `"jpg"` (default `"png"`)
  - `dpi`: `72`, `150`, or `300` (default `150`)
- **Response**: ZIP file (`pdf_images.zip`) with image files

### Image to PDF
- **POST** `/api/imagetopdf/convert`
- **Body**: `multipart/form-data` with `files` (multiple images)
- **Response**: Single PDF file (`images_to_pdf.pdf`)

## Docker

A `Dockerfile` is provided in the `masterdocs-backend/` directory for containerizing the backend.

### Build the Docker image
```bash
cd masterdocs-backend
docker build -t masterdocs-backend .
```

### Run the container
```bash
docker run -p 8080:8080 masterdocs-backend
```

The backend API will be accessible at `http://localhost:8080`.

---

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`
- `http://localhost:5176`

If your frontend runs on a different port, update the `WebConfig.java` file.

## Design Guidelines

The application follows these design principles:
- **Minimal color palette**: Uses Tailwind's red shades (red-700, red-800) for primary actions
- **No shadows**: Clean, flat design aesthetic
- **Rounded corners**: Only `rounded-sm` used for subtle borders
- **Professional look**: Focus on functionality and usability

## Development Notes

### Building for Production

#### Frontend
```bash
cd masterdocs-frontend
npm run build
```
The build output will be in the `dist/` directory.

#### Backend
```bash
cd masterdocs-backend
mvn clean package
```
The JAR file will be in the `target/` directory..

### Running Tests

#### Backend
```bash
cd masterdocs-backend
mvn test
```

#### Frontend
```bash
cd masterdocs-frontend
npm test
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.).

### CORS Errors
Make sure the backend `WebConfig.java` includes your frontend's port in the allowed origins list.

### PDF Processing Errors
- Ensure uploaded files are valid PDFs
- Check file size limits (default Spring Boot limit is 1MB, can be increased in `application.properties`)
- Verify Java 17 or higher is installed

### Build Errors
- Clear Maven cache: `mvn clean`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Open Issues / Roadmap

Here are good first issues and planned improvements for contributors:

- [ ] Add unit tests for all service classes (`PdfMergeService`, `PdfCompressService`, etc.)
- [ ] Improve error handling in controllers with user-friendly error messages
- [ ] Add Swagger / OpenAPI documentation for all backend endpoints
- [ ] Implement file type and size validation on both frontend and backend
- [ ] Add loading spinners / progress indicators for all async operations
- [ ] Refactor frontend into a shared file upload component to reduce code duplication
- [ ] Add a favicon and app branding/logo
- [ ] Optimize the `Dockerfile` for a production multi-stage build
- [ ] Set up a GitHub Actions CI/CD workflow for automated builds and tests
- [ ] Add drag-and-drop reordering for files in PDF Merge and Image to PDF tools
- [ ] Support additional image formats (WEBP, TIFF, BMP) in Image to PDF

## License

This project is for educational and demonstration purposes.

## Contributing

Feel free to submit issues and pull requests! When contributing:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
