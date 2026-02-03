package com.masterdocs.masterdocs.pdfmerge;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pdfmerge")
public class PdfMergeController {

    private final PdfMergeService pdfMergeService;

    public PdfMergeController(PdfMergeService pdfMergeService) {
        this.pdfMergeService = pdfMergeService;
    }

    @PostMapping("/merge")
    public ResponseEntity<byte[]> mergePdfs(@RequestParam("files") List<MultipartFile> files) {
        try {
            byte[] mergedPdf = pdfMergeService.mergePdfs(files);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "merged.pdf");
            return new ResponseEntity<>(mergedPdf, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
