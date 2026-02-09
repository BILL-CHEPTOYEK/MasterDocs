package com.masterdocs.masterdocs.pdfsplit;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfSplitService {

    /**
     * Split PDF by page ranges
     * @param file The PDF file to split
     * @param ranges List of page ranges (e.g., "1-3", "5", "7-9")
     * @return ZIP file containing split PDFs
     */
    public byte[] splitByRanges(MultipartFile file, List<String> ranges) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream());
             ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            int totalPages = document.getNumberOfPages();

            for (int i = 0; i < ranges.size(); i++) {
                String range = ranges.get(i).trim();
                int[] pageRange = parseRange(range, totalPages);
                
                if (pageRange[0] > totalPages || pageRange[1] > totalPages) {
                    throw new IllegalArgumentException("Page range " + range + " exceeds document page count: " + totalPages);
                }

                try (PDDocument splitDoc = new PDDocument()) {
                    for (int pageNum = pageRange[0]; pageNum <= pageRange[1]; pageNum++) {
                        splitDoc.addPage(document.getPage(pageNum - 1));
                    }

                    ByteArrayOutputStream pdfBaos = new ByteArrayOutputStream();
                    splitDoc.save(pdfBaos);

                    String fileName = String.format("split_%d_pages_%d-%d.pdf", i + 1, pageRange[0], pageRange[1]);
                    zos.putNextEntry(new ZipEntry(fileName));
                    zos.write(pdfBaos.toByteArray());
                    zos.closeEntry();
                }
            }

            zos.finish();
            return baos.toByteArray();
        }
    }

    /**
     * Split PDF into individual pages
     * @param file The PDF file to split
     * @return ZIP file containing individual page PDFs
     */
    public byte[] splitEveryPage(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream());
             ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            int totalPages = document.getNumberOfPages();

            for (int i = 0; i < totalPages; i++) {
                try (PDDocument singlePageDoc = new PDDocument()) {
                    singlePageDoc.addPage(document.getPage(i));

                    ByteArrayOutputStream pdfBaos = new ByteArrayOutputStream();
                    singlePageDoc.save(pdfBaos);

                    String fileName = String.format("page_%d.pdf", i + 1);
                    zos.putNextEntry(new ZipEntry(fileName));
                    zos.write(pdfBaos.toByteArray());
                    zos.closeEntry();
                }
            }

            zos.finish();
            return baos.toByteArray();
        }
    }

    /**
     * Extract specific pages from PDF
     * @param file The PDF file
     * @param pages List of page numbers to extract (1-indexed)
     * @return Single PDF containing extracted pages
     */
    public byte[] extractPages(MultipartFile file, List<Integer> pages) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream());
             PDDocument extractedDoc = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            int totalPages = document.getNumberOfPages();

            for (Integer pageNum : pages) {
                if (pageNum < 1 || pageNum > totalPages) {
                    throw new IllegalArgumentException("Page number " + pageNum + " is out of range (1-" + totalPages + ")");
                }
                extractedDoc.addPage(document.getPage(pageNum - 1));
            }

            extractedDoc.save(baos);
            return baos.toByteArray();
        }
    }

    /**
     * Get total page count of PDF
     * @param file The PDF file
     * @return Number of pages
     */
    public int getPageCount(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            return document.getNumberOfPages();
        }
    }

    /**
     * Parse page range string (e.g., "1-3", "5") into start and end page numbers
     */
    private int[] parseRange(String range, int totalPages) {
        if (range.contains("-")) {
            String[] parts = range.split("-");
            int start = Integer.parseInt(parts[0].trim());
            int end = Integer.parseInt(parts[1].trim());
            return new int[]{start, end};
        } else {
            int page = Integer.parseInt(range.trim());
            return new int[]{page, page};
        }
    }
}
