package com.internship.recruitment_service.configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "notification.exchange";
    public static final String STUDENT_QUEUE = "profile.student.updated.queue";
    public static final String BUSINESS_QUEUE = "profile.business.updated.queue";


    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }

    @Bean
    public TopicExchange profileExchange(){
        return new TopicExchange(EXCHANGE);
    }
    @Bean
    public Queue studentQueue(){
        return new Queue(STUDENT_QUEUE);
    }

    @Bean
    public Queue businessQueue(){
        return new Queue(BUSINESS_QUEUE);
    }

    @Bean
    public Binding studentBinding(){
        return BindingBuilder.bind(studentQueue()).to(profileExchange()).with(EXCHANGE);
    }

    @Bean
    public Binding businessBinding(){
        return BindingBuilder.bind(businessQueue()).to(profileExchange()).with(EXCHANGE);
    }


}
