package com.example.demo.adapter.controller;

import com.example.demo.application.dto.PdfRequestDTO;
import com.example.demo.infrastructure.service.PdfService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    public static Logger logger = LoggerFactory.getLogger(PdfController.class);

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generatePdf(@RequestBody PdfRequestDTO request) {
        try {
            byte[] pdfBytes = pdfService.generatePdf(request.getTemplateName(), request.getData());

            String filename = request.getFilename() != null ?
                    request.getFilename() : request.getTemplateName() + ".pdf";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error generating PDF: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/templates")
    public ResponseEntity<Object> getAvailableTemplates() {
        return new ResponseEntity<>(pdfService.getAvailableTemplates(), HttpStatus.OK);
    }

}
