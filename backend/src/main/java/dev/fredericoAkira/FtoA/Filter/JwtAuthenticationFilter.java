package dev.fredericoAkira.FtoA.Filter;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import dev.fredericoAkira.FtoA.Service.JwtService;
import dev.fredericoAkira.FtoA.Service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    JwtService jwtService;

    @Autowired
    UserService userService;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
    
        // ✅ Skip JWT validation for login & register routes
        if (requestURI.startsWith("/login") || requestURI.startsWith("/register") || requestURI.startsWith("/list-of-values")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = getJwtFromCookies(request); // Get JWT from cookies

        if (token == null) {
            // filterChain.doFilter(request, response);
            sendUnauthorizedResponse(response, "Missing token");
            return;
        }

        try {
            String username = jwtService.extractUsername(token);
    
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userService.loadUserByUsername(username);
    
                if (jwtService.isValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    sendUnauthorizedResponse(response, "Invalid or expired JWT token");
                    return;
                }
            }
    
            filterChain.doFilter(request, response);
    
        } catch (Exception e) {
            sendUnauthorizedResponse(response, "Unauthorized - " + e.getMessage());
        }
    }

    // Helper function to get JWT from cookies
    private String getJwtFromCookies(HttpServletRequest request) {
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                .filter(cookie -> "accessToken".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
        }
        return null;
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.setContentType("application/json");
        response.getWriter().write("{\"message\": \"" + message + "\"}");
    }
}
