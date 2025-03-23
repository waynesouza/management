package com.example.demo.adapter.util;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;

@Component
public class HtmlToPdfConverter {

    public byte[] convert(String html) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ConverterProperties converterProperties = new ConverterProperties();
            HtmlConverter.convertToPdf(html, outputStream, converterProperties);

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error converting HTML to PDF", e);
        }
    }

}
