package com.ultex.crm.web.rest;

import com.ultex.crm.security.AuthoritiesConstants;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/files")
public class FileUploadResource {

    private static final Logger LOG = LoggerFactory.getLogger(FileUploadResource.class);

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("png", "jpg", "jpeg", "pdf");
    private static final Pattern SAFE_FILENAME_PATTERN = Pattern.compile("[^a-zA-Z0-9._-]");
    private static final Path UPLOAD_ROOT = Paths.get("src/main/webapp/content/uploads/documents/clients");

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadClientDocument(
        @RequestParam("clientId") Long clientId,
        @RequestParam("file") MultipartFile file
    ) {
        if (clientId == null || clientId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid client identifier");
        }

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must not be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "File exceeds maximum allowed size");
        }

        final String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload");
        final String extension = extractExtension(originalFilename);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported file type");
        }

        final String sanitizedBaseName = sanitizeFilename(originalFilename);
        final String generatedName = Instant.now().toEpochMilli() + "_" + sanitizedBaseName;
        final Path clientDirectory = UPLOAD_ROOT.resolve(clientId.toString());
        final Path target = clientDirectory.resolve(generatedName);

        try {
            Files.createDirectories(clientDirectory);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            LOG.info("Stored document for client {} at {}", clientId, target.toAbsolutePath());
        } catch (IOException ex) {
            LOG.error("Failed to store document for client {}", clientId, ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file", ex);
        }

        return ResponseEntity.ok(Map.of("url", "/content/uploads/documents/clients/" + clientId + "/" + generatedName));
    }

    private String extractExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(dotIndex + 1);
    }

    private String sanitizeFilename(String filename) {
        String name = filename;
        int separatorIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
        if (separatorIndex != -1) {
            name = name.substring(separatorIndex + 1);
        }
        return SAFE_FILENAME_PATTERN.matcher(name).replaceAll("_");
    }
}
