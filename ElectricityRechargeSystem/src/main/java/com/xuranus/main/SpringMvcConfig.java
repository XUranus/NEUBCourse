package com.xuranus.main;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class SpringMvcConfig extends WebMvcConfigurerAdapter {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        LoginInterceptor loginInterceptor = new LoginInterceptor();

        registry.addInterceptor(loginInterceptor).addPathPatterns("/user/**");
        registry.addInterceptor(loginInterceptor).addPathPatterns("/reader/**");
        registry.addInterceptor(loginInterceptor).addPathPatterns("/admin/**");

        super.addInterceptors(registry);
    }
    
}