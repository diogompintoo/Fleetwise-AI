package com.fleetwise.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class AiInsightService {

    @Value("${ai.groq.api-key}")
    private String apiKey;

    @Value("${ai.groq.url}")
    private String apiUrl;

    @Value("${ai.groq.model}")
    private String modelName;

    private final RestClient restClient = RestClient.create();

    public String generateInsight(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                "model", modelName,
                "messages", List.of(
                    Map.of("role", "user", "content", prompt)
                )
            );

            Map<?, ?> response = restClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

            if (response == null || !response.containsKey("choices")) {
                return "AI insights temporarily unavailable.";
            }

            var choices = (List<?>) response.get("choices");
            if (choices.isEmpty()) {
                return "No insights generated.";
            }

            var firstChoice = (Map<?, ?>) choices.get(0);
            var message = (Map<?, ?>) firstChoice.get("message");

            return (String) message.get("content");

        } catch (RestClientResponseException e) {
            System.err.println("Groq API Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return "AI Insights temporarily unavailable due to upstream provider error.";
        } catch (Exception e) {
            System.err.println("Unexpected error calling Groq API: " + e.getMessage());
            return "Unable to process AI fleet insights.";
        }
    }
}