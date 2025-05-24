package com.a2m.profileservice;

import com.netflix.discovery.EurekaClientConfig;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.a2m.profileservice.mapper")
@EnableFeignClients(basePackages = "com.a2m.profileservice.client")
public class ProfileServiceApplication {

    @Autowired
    private EurekaClientConfig eurekaClientConfig;

    public static void main(String[] args) {
//        SpringApplication.run(ProfileServiceApplication.class, args);
//        ConfigurableApplicationContext context = SpringApplication.run(ProfileServiceApplication.class, args);
//        EurekaClientConfig clientConfig = context.getBean(EurekaClientConfig.class);
//        System.out.println("Eureka defaultZone: " + clientConfig.getEurekaServerServiceUrls("defaultZone"));
        ConfigurableApplicationContext context = SpringApplication.run(ProfileServiceApplication.class, args);
        ProfileServiceApplication app = context.getBean(ProfileServiceApplication.class);
        System.out.println("Eureka defaultZone: " + app.eurekaClientConfig.getEurekaServerServiceUrls("defaultZone"));
    }

}
