package com.ist.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class RateLimitConfig {
    
    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> windowStart = new ConcurrentHashMap<>();
    
    @Bean
    public RateLimiter rateLimiter() {
        return new RateLimiter();
    }
    
    public class RateLimiter {
        private static final int MAX_REQUESTS = 10;
        private static final long WINDOW_SIZE_MS = 60000; // 1 minute
        
        public boolean isAllowed(String clientId) {
            long now = System.currentTimeMillis();
            
            windowStart.compute(clientId, (key, startTime) -> {
                if (startTime == null || now - startTime > WINDOW_SIZE_MS) {
                    requestCounts.put(key, new AtomicInteger(0));
                    return now;
                }
                return startTime;
            });
            
            AtomicInteger count = requestCounts.get(clientId);
            return count != null && count.incrementAndGet() <= MAX_REQUESTS;
        }
    }
}