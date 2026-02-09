package com.masterdocs.masterdocs.imagetopdf;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ImageToPdfService {

    /**
     * Convert images to PDF
     * @param files List of image files
     * @return PDF as byte array
     */
    public byte[] convertToPdf(List<MultipartFile> files) throws IOException {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            for (MultipartFile file : files) {
                // Read image
                BufferedImage image = ImageIO.read(file.getInputStream());
                if (image == null) {
                    throw new IOException("Invalid image file: " + file.getOriginalFilename());
                }

                // Create PDImageXObject
                PDImageXObject pdImage = PDImageXObject.createFromByteArray(
                        document, file.getBytes(), file.getOriginalFilename());

                // Calculate page size to fit image
                float imageWidth = pdImage.getWidth();
                float imageHeight = pdImage.getHeight();
                
                // Use A4 size as max, scale down if needed
                float maxWidth = PDRectangle.A4.getWidth();
                float maxHeight = PDRectangle.A4.getHeight();
                
                float scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
                if (scale > 1) scale = 1; // Don't scale up
                
                float scaledWidth = imageWidth * scale;
                float scaledHeight = imageHeight * scale;

                // Create page
                PDPage page = new PDPage(new PDRectangle(scaledWidth, scaledHeight));
                document.addPage(page);

                // Add image to page
                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    contentStream.drawImage(pdImage, 0, 0, scaledWidth, scaledHeight);
                }
            }

            document.save(baos);
            return baos.toByteArray();
        }
    }
}
