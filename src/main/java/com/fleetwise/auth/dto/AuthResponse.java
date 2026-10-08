package com.fleetwise.auth.dto;

public record AuthResponse(String token, String username, String role) {}