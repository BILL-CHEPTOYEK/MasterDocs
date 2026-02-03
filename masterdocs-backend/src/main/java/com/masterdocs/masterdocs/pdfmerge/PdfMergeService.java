package com.masterdocs.masterdocs.pdfmerge;

import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class PdfMergeService {
    public byte[] mergePdfs(List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("No PDF files provided");
        }
        PDFMergerUtility merger = new PDFMergerUtility();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        merger.setDestinationStream(outputStream);
        for (MultipartFile file : files) {
            if (file.isEmpty() || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
                throw new IllegalArgumentException("All files must be non-empty PDFs");
            }
            merger.addSource(file.getInputStream());
        }
        merger.mergeDocuments(null);
        return outputStream.toByteArray();
    }
}
