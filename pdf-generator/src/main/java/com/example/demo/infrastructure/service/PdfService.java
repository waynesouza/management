package com.example.demo.infrastructure.service;

import com.example.demo.adapter.util.HtmlToPdfConverter;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PdfService {

    private final SpringTemplateEngine templateEngine;
    private final HtmlToPdfConverter htmlToPdfConverter;
    private final ResourceLoader resourceLoader;

    private static final String TEMPLATES_PATH = "classpath:templates/";
    private List<String> availableTemplates;

    public PdfService(SpringTemplateEngine templateEngine, HtmlToPdfConverter htmlToPdfConverter, ResourceLoader resourceLoader) {
        this.templateEngine = templateEngine;
        this.htmlToPdfConverter = htmlToPdfConverter;
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void init() {
        try {
            Resource resource = resourceLoader.getResource(TEMPLATES_PATH);
            availableTemplates = Arrays.stream(Objects.requireNonNull(resource.getFile().listFiles()))
                    .filter(file -> file.getName().endsWith(".html"))
                    .map(file -> file.getName().replace(".html", ""))
                    .collect(Collectors.toList());
        } catch (IOException e) {
            availableTemplates = Arrays.asList("invoice", "report", "certificate");
        }
    }

    public byte[] generatePdf(String templateName, Map<String, Object> data) {
        if (!availableTemplates.contains(templateName)) {
            throw new IllegalArgumentException("Template not found: " + templateName);
        }

        Context context = new Context();
        if (data != null) {
            context.setVariables(data);
        }

        String processedHtml = templateEngine.process(templateName, context);

        return htmlToPdfConverter.convert(processedHtml);
    }

    public Map<String, Object> getAvailableTemplates() {
        Map<String, Object> response = new HashMap<>();
        response.put("templates", availableTemplates);
        return response;
    }

}
