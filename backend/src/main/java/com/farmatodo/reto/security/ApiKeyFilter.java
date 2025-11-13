package com.farmatodo.reto.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.lang.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;

@Component
public class ApiKeyFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(ApiKeyFilter.class);

  @Value("${app.api-key}")
  private String apiKey;

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain) throws ServletException, IOException {

    String path = request.getRequestURI();
    String method = request.getMethod();
    log.debug("Processing request to: {} [{}]", path, method);

    // Allow OPTIONS requests (CORS preflight) to pass through
    if ("OPTIONS".equals(method)) {
      filterChain.doFilter(request, response);
      return;
    }

    // Allow public endpoints without API key
    if ("/ping".equals(path) || "/error".equals(path) || path.startsWith("/h2-console") 
        || path.startsWith("/actuator") || path.startsWith("/auth/") 
        || ("GET".equals(method) && path.startsWith("/products"))) {
      filterChain.doFilter(request, response);
      return;
    }

    String header = request.getHeader("X-API-KEY");
    log.debug("API Key header: {}, Expected: {}", header != null ? "[PRESENT]" : "[MISSING]",
        apiKey != null ? "[CONFIGURED]" : "[NOT CONFIGURED]");

    if (header != null && header.equals(apiKey)) {
      log.debug("API Key valid, setting authentication");
      var auth = new UsernamePasswordAuthenticationToken(
          "api-key-user", null, List.of(new SimpleGrantedAuthority("ROLE_API")));
      auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

      var context = SecurityContextHolder.createEmptyContext();
      context.setAuthentication(auth);
      SecurityContextHolder.setContext(context);
      log.debug("Authentication set, proceeding with filter chain");
      filterChain.doFilter(request, response);
      return;
    }

    log.debug("API Key invalid, returning 401");
    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid API key");
  }
}
