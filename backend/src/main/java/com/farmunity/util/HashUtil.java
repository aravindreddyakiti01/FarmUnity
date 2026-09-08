package com.farmunity.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;

@Slf4j
public final class HashUtil {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private HashUtil() {}

    /**
     * Creates a deterministic SHA-256 hash using TreeMap for alphabetical canonical key ordering.
     */
    public static String sha256CanonicalJson(Map<String, Object> data) {
        try {
            TreeMap<String, Object> sortedMap = new TreeMap<>(data);
            String json = OBJECT_MAPPER.writeValueAsString(sortedMap);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(json.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            log.error("Failed to generate canonical SHA-256 hash", e);
            throw new RuntimeException("Hash generation error", e);
        }
    }
}
