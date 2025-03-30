package com.example.demo.application.dto;

import java.util.Map;

public class PdfRequestDTO {

    private String templateName;
    private Map<String, Object> data;
    private String filename;

    public PdfRequestDTO() { }

    public PdfRequestDTO(String templateName, Map<String, Object> data, String filename) {
        this.templateName = templateName;
        this.data = data;
        this.filename = filename;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

}
