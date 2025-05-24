package com.a2m.profileservice.Authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.KeyFactory;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    private String publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvvL9VoryJpgN5oI0JSY7" +
            "Xzld/8eyX8uMeT4PgfPkbLLRSlSml/f4u9vO1aU1mMKUvKXF5ysFaN92MPvBdPoW" +
            "XVDFiS5GaNg6DJ3Yc+8vgxoF1qTMOj5pBYy4MSVnDJ+2EoAikNFSzhg7pC8BWfa1" +
            "RnUdBRS+vCYMI7s6ThdzDPrBDJrmGQUm33iOLw4WLf0h0ttRhhrF06oWbITog3An" +
            "0vb4ZeD+tKjjkit7ka40aIc5+W4FbJfz0Ba7NPqYhsPIyJh5yJP9DdHkwK2m3uJ1" +
            "+lbJUcZ5Sz9erJ8capE2TB4Xr/APg+3s/LslVytAjXedFU+2ygNr+5LBJOcy29S7" +
            "YwIDAQAB";

    // Chuyển chuỗi base64 thành RSAPublicKey
    private RSAPublicKey getPublicKeyFromBase64() {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(publicKey);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return (RSAPublicKey) keyFactory.generatePublic(new java.security.spec.X509EncodedKeySpec(keyBytes));
        } catch (Exception e) {
            throw new RuntimeException("Failed to load public key", e);
        }
    }

    // Lấy claims từ token
    private Claims extractAllClaims(String token) {
        RSAPublicKey rsaPublicKey = getPublicKeyFromBase64();
        Claims claims = Jwts.parser()
                .setSigningKey(rsaPublicKey)  // Dùng RSA public key
                .build()
                .parseClaimsJws(token)
                .getBody();

        // In toàn bộ claims ra để kiểm tra
        System.out.println("Claims: " + claims);
        return claims;
    }

    // Lấy role từ token
    public String extractRoleFromToken(String token) {

        try {
            Claims claims = extractAllClaims(token);
            System.out.println("thanh token"+claims.size());
            return claims.get("role", String.class);  // Lấy 'role' từ claims
        } catch (Exception e) {
            return null;
        }
    }

    public String extractRoleFromToken2(String token) {
        try {
            Claims claims = extractAllClaims(token);
            System.out.println("Kích thước claims: " + claims.size());
            List<String> roles = claims.get("roles", List.class);

            if (roles != null && !roles.isEmpty()) {
                return String.join(", ", roles);
            } else {
                return "";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    


    // Lấy userId từ token
    public String extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        String userId = claims.get("uid", String.class);  // Lấy 'uid' từ claims
        System.out.println("UserId (uid): " + userId);  // In ra giá trị của 'uid'
        return userId;
    }

    public String extractSubject(String token) {
        Claims claims = extractAllClaims(token);
        String subject = claims.get("sub", String.class);  // Lấy 'sub' từ claims
        System.out.println("Subject (sub): " + subject);  // In ra giá trị của 'sub'
        return subject;
    }


    // Lấy issuer từ token
    public String extractIssuer(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("iss", String.class);  // Lấy 'iss' (issuer)
    }

    // Lấy expiration time từ token
    public long extractExpiration(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getExpiration().getTime();  // Lấy 'exp' (expiration time)
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = extractAllClaims(token).getExpiration();
        System.out.println("expirationDate: " + expirationDate);
        boolean expired = expirationDate.before(new Date());
        System.out.println("check"+expired);
        return expired; // So sánh với thời gian hiện tại
    }

}
