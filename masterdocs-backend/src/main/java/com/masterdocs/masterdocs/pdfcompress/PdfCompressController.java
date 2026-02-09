package com.masterdocs.masterdocs.pdfcompress;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/pdfcompress")
public class PdfCompressController {

    private final PdfCompressService pdfCompressService;

    public PdfCompressController(PdfCompressService pdfCompressService) {
        this.pdfCompressService = pdfCompressService;
    }

    @PostMapping("/compress")
    public ResponseEntity<byte[]> compressPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "quality", defaultValue = "0.7") float quality) {
        try {
            byte[] compressedPdf = pdfCompressService.compressPdf(file, quality);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "compressed.pdf");
            
            return new ResponseEntity<>(compressedPdf, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
