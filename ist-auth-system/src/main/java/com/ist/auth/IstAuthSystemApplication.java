package com.ist.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = "com.ist.auth")
@EnableJpaAuditing
public class IstAuthSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(IstAuthSystemApplication.class, args);
	}

}
