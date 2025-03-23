package com.example.demo.application.dto;

import lombok.Data;
import java.util.Map;

@Data
public class PdfRequestDTO {

    private String templateName;
    private Map<String, Object> data;
    private String filename;

}
