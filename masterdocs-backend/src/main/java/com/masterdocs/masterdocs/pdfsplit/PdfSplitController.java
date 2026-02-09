package com.masterdocs.masterdocs.pdfsplit;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pdfsplit")
public class PdfSplitController {

    private final PdfSplitService pdfSplitService;

    public PdfSplitController(PdfSplitService pdfSplitService) {
        this.pdfSplitService = pdfSplitService;
    }

    @PostMapping("/split-by-ranges")
    public ResponseEntity<byte[]> splitByRanges(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ranges") String ranges) {
        try {
            // Parse ranges: "1-3,5,7-9" -> ["1-3", "5", "7-9"]
            List<String> rangeList = Arrays.stream(ranges.split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());

            byte[] zipFile = pdfSplitService.splitByRanges(file, rangeList);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "split_pdfs.zip");
            
            return new ResponseEntity<>(zipFile, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/split-every-page")
    public ResponseEntity<byte[]> splitEveryPage(@RequestParam("file") MultipartFile file) {
        try {
            byte[] zipFile = pdfSplitService.splitEveryPage(file);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "split_pages.zip");
            
            return new ResponseEntity<>(zipFile, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/extract-pages")
    public ResponseEntity<byte[]> extractPages(
            @RequestParam("file") MultipartFile file,
            @RequestParam("pages") String pages) {
        try {
            // Parse pages: "1,3,5" -> [1, 3, 5]
            List<Integer> pageList = Arrays.stream(pages.split(","))
                    .map(String::trim)
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());

            byte[] extractedPdf = pdfSplitService.extractPages(file, pageList);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "extracted_pages.pdf");
            
            return new ResponseEntity<>(extractedPdf, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/page-count")
    public ResponseEntity<Integer> getPageCount(@RequestParam("file") MultipartFile file) {
        try {
            int pageCount = pdfSplitService.getPageCount(file);
            return ResponseEntity.ok(pageCount);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
