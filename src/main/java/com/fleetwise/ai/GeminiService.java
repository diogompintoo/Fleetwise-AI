package com.fleetwise.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${ai.gemini.api-key}")
    private String apiKey;

    @Value("${ai.gemini.url}")
    private String apiUrl;

    private final RestClient restClient = RestClient.create();

    public String generateInsight(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            Map<?, ?> response = restClient.post()
                .uri(apiUrl)
                .header("x-goog-api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

            if (response == null || !response.containsKey("candidates")) {
                return "AI insights temporarily unavailable (empty response).";
            }

            var candidates = (List<?>) response.get("candidates");
            if (candidates.isEmpty()) {
                return "No insights generated for the given fleet data.";
            }

            var first = (Map<?, ?>) candidates.get(0);
            var content = (Map<?, ?>) first.get("content");
            var parts = (List<?>) content.get("parts");
            var part = (Map<?, ?>) parts.get(0);

            return (String) part.get("text");

        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return "AI insights temporarily unavailable.";
        }
    }
}