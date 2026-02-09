package com.masterdocs.masterdocs.pdftoimage;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfToImageService {

    /**
     * Convert PDF pages to images
     * @param file The PDF file
     * @param format Image format (png, jpg)
     * @param dpi Resolution (default 150)
     * @return ZIP file containing images
     */
    public byte[] convertToImages(MultipartFile file, String format, int dpi) throws IOException {
        if (dpi < 72) dpi = 72;
        if (dpi > 300) dpi = 300;

        try (PDDocument document = PDDocument.load(file.getInputStream());
             ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            PDFRenderer renderer = new PDFRenderer(document);
            int totalPages = document.getNumberOfPages();

            for (int i = 0; i < totalPages; i++) {
                BufferedImage image = renderer.renderImageWithDPI(i, dpi, ImageType.RGB);
                
                ByteArrayOutputStream imageBaos = new ByteArrayOutputStream();
                ImageIO.write(image, format, imageBaos);
                
                String fileName = String.format("page_%d.%s", i + 1, format);
                zos.putNextEntry(new ZipEntry(fileName));
                zos.write(imageBaos.toByteArray());
                zos.closeEntry();
            }

            zos.finish();
            return baos.toByteArray();
        }
    }
}
