package com.ist.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {
    
    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of("status", "UP", "service", "IST Auth System");
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}