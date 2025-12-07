package com.ultex.crm.service;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * Service responsible for storing and removing user avatar files.
 */
@Service
@Transactional
public class AvatarService {

    private static final Logger LOG = LoggerFactory.getLogger(AvatarService.class);

    private static final long AVATAR_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        MediaType.IMAGE_JPEG_VALUE,
        "image/jpg",
        MediaType.IMAGE_PNG_VALUE,
        "image/webp",
        "image/gif"
    );

    private final Path avatarDirectory;
    private final Path runtimeStaticDirectory;

    public AvatarService(@Value("${application.avatar.folder:src/main/webapp/content/profile}") String avatarFolder) {
        this.avatarDirectory = Paths.get(avatarFolder).toAbsolutePath().normalize();
        this.runtimeStaticDirectory = Paths.get("target/classes/static/content/profile").toAbsolutePath().normalize();
    }

    /**
     * Stores the avatar file on disk and returns the public URL to be persisted.
     *
     * @param file  the uploaded file
     * @param login the current user's login
     * @return a URL such as /content/profile/{login}.jpg
     */
    public String storeAvatar(MultipartFile file, String login) {
        validateFile(file);
        String safeLogin = sanitizeLogin(login);
        try {
            Path preferredDir = resolveWritableDirectory(avatarDirectory, runtimeStaticDirectory);
            deleteExistingAvatarFiles(preferredDir, safeLogin);

            String extension = resolveExtension(file);
            String filename = safeLogin + extension;
            byte[] bytes = file.getBytes();
            writeAvatarFile(bytes, filename, preferredDir);
            mirrorToOtherLocation(bytes, filename, safeLogin, preferredDir);
            LOG.debug("Stored avatar for {} at {}", login, preferredDir.resolve(filename));
            return "/content/profile/" + filename;
        } catch (IOException e) {
            LOG.error("Error storing avatar for user {}", login, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to save avatar", e);
        }
    }

    /**
     * Deletes any stored avatar for the given user.
     *
     * @param login the current user's login
     */
    public void deleteAvatar(String login) {
        String safeLogin = sanitizeLogin(login);
        deleteExistingAvatarFiles(avatarDirectory, safeLogin);
        deleteExistingAvatarFiles(runtimeStaticDirectory, safeLogin);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Avatar file is empty");
        }
        if (file.getSize() > AVATAR_MAX_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Avatar file exceeds 2MB");
        }
        String contentType = StringUtils.defaultIfBlank(file.getContentType(), MediaType.APPLICATION_OCTET_STREAM_VALUE);
        boolean allowed = ALLOWED_CONTENT_TYPES.stream().anyMatch(allowedType -> allowedType.equalsIgnoreCase(contentType));
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Only image uploads are allowed");
        }
    }

    private String resolveExtension(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        String extension = null;
        if (StringUtils.isNotBlank(originalName) && originalName.lastIndexOf('.') != -1) {
            extension = originalName.substring(originalName.lastIndexOf('.'));
        }
        if (StringUtils.isBlank(extension)) {
            extension = mapContentTypeToExtension(file.getContentType());
        }
        if (StringUtils.isBlank(extension)) {
            extension = ".jpg";
        }
        return extension.toLowerCase(Locale.ROOT);
    }

    private String mapContentTypeToExtension(String contentType) {
        if (StringUtils.isBlank(contentType)) {
            return null;
        }
        if (contentType.toLowerCase(Locale.ROOT).contains("png")) {
            return ".png";
        }
        if (contentType.toLowerCase(Locale.ROOT).contains("gif")) {
            return ".gif";
        }
        if (contentType.toLowerCase(Locale.ROOT).contains("webp")) {
            return ".webp";
        }
        return ".jpg";
    }

    private void mirrorToOtherLocation(byte[] bytes, String filename, String safeLogin, Path primaryDir) {
        Path targetDir = primaryDir.equals(avatarDirectory) ? runtimeStaticDirectory : avatarDirectory;
        try {
            Files.createDirectories(targetDir);
            if (!Files.isWritable(targetDir)) {
                LOG.warn("Mirror directory {} is not writable, skipping avatar mirror", targetDir);
                return;
            }
            deleteExistingAvatarFiles(targetDir, safeLogin);
            writeAvatarFile(bytes, filename, targetDir);
        } catch (IOException e) {
            LOG.warn("Could not mirror avatar to {}", targetDir, e);
        }
    }

    private void deleteExistingAvatarFiles(Path directory, String safeLogin) {
        if (directory == null || Files.notExists(directory)) {
            return;
        }
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory, safeLogin + ".*")) {
            for (Path path : stream) {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException e) {
                    LOG.warn("Could not delete existing avatar {}", path, e);
                }
            }
        } catch (IOException e) {
            LOG.warn("Could not scan avatar directory {} for cleanup", directory, e);
        }
    }

    private Path resolveWritableDirectory(Path preferred, Path fallback) {
        Path target = preferred;
        try {
            Files.createDirectories(target);
            if (!Files.isWritable(target)) {
                LOG.warn("Avatar directory {} is not writable, falling back to {}", target, fallback);
                target = fallback;
            }
        } catch (IOException e) {
            LOG.warn("Cannot prepare avatar directory {}, falling back to {}", target, fallback, e);
            target = fallback;
        }

        try {
            Files.createDirectories(target);
            if (!Files.isWritable(target)) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Avatar directory is not writable");
            }
        } catch (IOException e) {
            LOG.error("Cannot prepare fallback avatar directory {}", target, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to prepare avatar directory", e);
        }
        return target;
    }

    private void writeAvatarFile(byte[] bytes, String filename, Path directory) throws IOException {
        Path target = directory.resolve(filename).normalize();
        if (!target.startsWith(directory)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid avatar path");
        }
        Files.write(target, bytes);
    }

    private String sanitizeLogin(String login) {
        String safeLogin = login.replaceAll("[^a-zA-Z0-9_-]", "");
        if (safeLogin.isEmpty()) {
            safeLogin = "user";
        }
        return safeLogin;
    }
}
