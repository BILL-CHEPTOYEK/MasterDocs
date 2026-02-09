package com.masterdocs.masterdocs.pdftoimage;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/pdftoimage")
public class PdfToImageController {

    private final PdfToImageService pdfToImageService;

    public PdfToImageController(PdfToImageService pdfToImageService) {
        this.pdfToImageService = pdfToImageService;
    }

    @PostMapping("/convert")
    public ResponseEntity<byte[]> convertToImages(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "format", defaultValue = "png") String format,
            @RequestParam(value = "dpi", defaultValue = "150") int dpi) {
        try {
            byte[] zipFile = pdfToImageService.convertToImages(file, format, dpi);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "pdf_images.zip");
            
            return new ResponseEntity<>(zipFile, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
