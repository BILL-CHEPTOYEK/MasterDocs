package com.masterdocs.masterdocs.pdfcompress;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
// import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

@Service
public class PdfCompressService {

    /**
     * Compress PDF by re-rendering pages with lower quality images
     * @param file The PDF file to compress
     * @param quality Compression quality (0.0 to 1.0, where 1.0 is highest quality)
     * @return Compressed PDF as byte array
     */
    public byte[] compressPdf(MultipartFile file, float quality) throws IOException {
        if (quality < 0.1f) quality = 0.1f;
        if (quality > 1.0f) quality = 1.0f;

        try (PDDocument originalDoc = PDDocument.load(file.getInputStream());
             PDDocument compressedDoc = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDFRenderer renderer = new PDFRenderer(originalDoc);
            int totalPages = originalDoc.getNumberOfPages();

            for (int i = 0; i < totalPages; i++) {
                // Render page as image
                BufferedImage image = renderer.renderImageWithDPI(i, 150, ImageType.RGB);
                
                // Compress image
                byte[] compressedImageBytes = compressImage(image, quality);
                
                // Get original page size
                PDPage originalPage = originalDoc.getPage(i);
                PDRectangle mediaBox = originalPage.getMediaBox();
                
                // Create new page with compressed image
                PDPage newPage = new PDPage(mediaBox);
                compressedDoc.addPage(newPage);
                
                PDImageXObject pdImage = PDImageXObject.createFromByteArray(
                        compressedDoc, compressedImageBytes, "compressed");
                
                try (PDPageContentStream contentStream = new PDPageContentStream(
                        compressedDoc, newPage)) {
                    contentStream.drawImage(pdImage, 0, 0, 
                            mediaBox.getWidth(), mediaBox.getHeight());
                }
            }

            compressedDoc.save(baos);
            return baos.toByteArray();
        }
    }

    /**
     * Compress image using JPEG compression
     */
    private byte[] compressImage(BufferedImage image, float quality) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        if (!writers.hasNext()) {
            throw new IllegalStateException("No JPEG writer found");
        }
        
        ImageWriter writer = writers.next();
        ImageWriteParam param = writer.getDefaultWriteParam();
        
        if (param.canWriteCompressed()) {
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(quality);
        }
        
        try (ImageOutputStream ios = ImageIO.createImageOutputStream(outputStream)) {
            writer.setOutput(ios);
            writer.write(null, new IIOImage(image, null, null), param);
        } finally {
            writer.dispose();
        }
        
        return outputStream.toByteArray();
    }
}
