package com.example.demo.infrastructure.service;

import com.example.demo.adapter.util.HtmlToPdfConverter;
import com.example.demo.application.dto.DataDTO;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PdfService {

    public static Logger logger = LoggerFactory.getLogger(PdfService.class);

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
            availableTemplates = List.of("budget");
        }
    }

    public byte[] generatePdf(String templateName, Map<String, Object> data) throws IOException {
        if (!availableTemplates.contains(templateName)) {
            throw new IllegalArgumentException("Template not found: " + templateName);
        }

        Context context = new Context();
        if (data != null) {
            context.setVariable("data", data);
            context.setVariable("logo", convertImageToBase64());
            context.setVariable("currentDate", getCurrentDate());
        }

        String processedHtml = templateEngine.process(templateName, context);

        return htmlToPdfConverter.convert(processedHtml);
    }

    public Map<String, Object> getAvailableTemplates() {
        Map<String, Object> response = new HashMap<>();
        response.put("templates", availableTemplates);
        return response;
    }

    private String convertImageToBase64() throws IOException {
        Resource resource = resourceLoader.getResource("classpath:static/images/logo.png");
        byte[] imageBytes = StreamUtils.copyToByteArray(resource.getInputStream());

        String logo = Base64.getEncoder().encodeToString(imageBytes);
        logger.info("Logo converted to base64: {}", logo);

        return logo;
    }

    private String getCurrentDate() {
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", Locale.forLanguageTag("pt-BR"));

        return currentDate.format(formatter);
    }

}
