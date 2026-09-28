package com.bhagya.commerce.common.security;

import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/**
 * Robust Input Sanitizer for HTML/XSS & Prompt Injection Mitigation.
 */
@Component
public class InputSanitizer {

    private static final Pattern SCRIPT_TAG_PATTERN = Pattern.compile("<script.*?>.*?</script>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]+>");
    private static final Pattern JAVASCRIPT_SCHEME_PATTERN = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
    private static final Pattern EVENT_HANDLER_PATTERN = Pattern.compile("on\\w+\\s*=", Pattern.CASE_INSENSITIVE);

    // AI prompt injection delimiter patterns
    private static final Pattern PROMPT_INJECTION_PATTERN = Pattern.compile(
        "(?i)(system:\\s*|<<<system>>>|ignore previous instructions|disregard instructions|you are now a|you are now an|acting as root|sudo mode|developer mode activated)"
    );

    /**
     * Strips dangerous script tags, html tags, event handlers, and javascript pseudo-protocols.
     */
    public String sanitizeText(String input) {
        if (input == null) return null;
        String cleaned = SCRIPT_TAG_PATTERN.matcher(input).replaceAll("");
        cleaned = EVENT_HANDLER_PATTERN.matcher(cleaned).replaceAll("blocked_event=");
        cleaned = JAVASCRIPT_SCHEME_PATTERN.matcher(cleaned).replaceAll("blocked_proto:");
        cleaned = HTML_TAG_PATTERN.matcher(cleaned).replaceAll("");
        return cleaned.trim();
    }

    /**
     * Neutralizes prompt-injection delimiter attacks for AI chat inputs.
     */
    public String sanitizePromptInput(String input) {
        if (input == null) return "";
        String sanitized = sanitizeText(input);
        // Neutralize injection keywords by prefixing quotes
        sanitized = PROMPT_INJECTION_PATTERN.matcher(sanitized).replaceAll("[filtered_command]");
        return sanitized;
    }
}
