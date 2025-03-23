package com.example.demo.application.dto;

import java.util.Map;

public class PdfRequestDTO {

    private String templateName;
    private DataDTO data;
    private String filename;

    public PdfRequestDTO() { }

    public PdfRequestDTO(String templateName, DataDTO data, String filename) {
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

    public DataDTO getData() {
        return data;
    }

    public void setData(DataDTO data) {
        this.data = data;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

}
