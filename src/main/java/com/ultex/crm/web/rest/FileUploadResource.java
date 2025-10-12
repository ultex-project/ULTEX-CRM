package com.ultex.crm.web.rest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileUploadResource {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, "image/jpg");

    private static final Path UPLOAD_ROOT = Paths.get("src/main/webapp/content/uploads");

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "EMPTY_FILE"));
        }

        final String contentType = file.getContentType();
        if (contentType == null || ALLOWED_CONTENT_TYPES.stream().noneMatch(contentType::equalsIgnoreCase)) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(Map.of("error", "INVALID_TYPE"));
        }

        final String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload");
        final String extension = getExtension(originalFilename);
        if (!extension.matches("(?i)png|jpe?g")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(Map.of("error", "INVALID_EXTENSION"));
        }

        final String generatedName = Instant.now().toEpochMilli() + "-" + originalFilename.replaceAll("\\s+", "-");
        final Path targetLocation = UPLOAD_ROOT.resolve(generatedName);

        try {
            Files.createDirectories(UPLOAD_ROOT);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "UPLOAD_FAILED"));
        }

        return ResponseEntity.ok(Map.of("url", "/content/uploads/" + generatedName));
    }

    private String getExtension(String filename) {
        final int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1) {
            return "";
        }
        return filename.substring(lastDot + 1);
    }
}
