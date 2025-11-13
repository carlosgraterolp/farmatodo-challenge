package com.farmatodo.reto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RetoFarmatodoApplication {

	public static void main(String[] args) {
		SpringApplication.run(RetoFarmatodoApplication.class, args);
	}

}