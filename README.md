# MasterDocs - PDF Management Application

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

## API Endpoints

### PDF Merge
- **POST** `/api/pdf/merge`
- **Body**: `multipart/form-data` with `files` (multiple PDFs)
- **Response**: Merged PDF file

### PDF Split

#### Split by Ranges
- **POST** `/api/pdf/split/ranges`
- **Body**: `multipart/form-data`
  - `file`: PDF file
  - `ranges`: Page ranges (e.g., "1-3", "5", "7-9")
- **Response**: ZIP file with split PDFs

#### Split Every Page
- **POST** `/api/pdf/split/every-page`
- **Body**: `multipart/form-data` with `file`
- **Response**: ZIP file with individual pages

#### Extract Pages
- **POST** `/api/pdf/split/extract`
- **Body**: `multipart/form-data`
  - `file`: PDF file
  - `pages`: Page numbers to extract (e.g., "1,3,5")
- **Response**: Single PDF with extracted pages

#### Get Page Count
- **POST** `/api/pdf/split/page-count`
- **Body**: `multipart/form-data` with `file`
- **Response**: JSON with page count

### PDF Compress
- **POST** `/api/pdf/compress?quality={0.1-1.0}`
- **Body**: `multipart/form-data` with `file`
- **Query Param**: `quality` (0.1 = lowest quality, 1.0 = highest quality)
- **Response**: Compressed PDF file

### PDF to Image
- **POST** `/api/pdf/to-image?format={format}&dpi={dpi}`
- **Body**: `multipart/form-data` with `file`
- **Query Params**:
  - `format`: "png" or "jpg"
  - `dpi`: 72, 150, or 300
- **Response**: ZIP file with image files

### Image to PDF
- **POST** `/api/image/to-pdf`
- **Body**: `multipart/form-data` with `files` (multiple images)
- **Response**: Single PDF file

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
The JAR file will be in the `target/` directory.

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

## License

This project is for educational and demonstration purposes.

## Contributing

Feel free to submit issues and enhancement requests!