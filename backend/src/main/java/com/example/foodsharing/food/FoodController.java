package com.example.foodsharing.food;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food")
public class FoodController {

    private final FoodRepository foods;

    public FoodController(FoodRepository foods) {
        this.foods = foods;
    }

    public record FoodRequest(
            @NotBlank @Size(max = 120) String foodName,
            @NotBlank @Size(max = 1000) String description,
            @NotNull @Min(1) Integer quantity,
            @NotBlank @Size(max = 40) String foodType,
            @NotBlank @Size(max = 255) String pickupLocation,
            @Size(max = 30) String ownerPhone, // Optional phone number
            @NotNull @Future LocalDateTime availableUntil) {}

    private void refreshExpiry(FoodPost food) {
        if ("AVAILABLE".equals(food.getStatus())
                && !food.getAvailableUntil().isAfter(
                        LocalDateTime.now())) {
            food.setStatus("EXPIRED");
            foods.save(food);
        }
    }

    @GetMapping
    public List<FoodPost> all(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type) {

        return foods.findAll().stream()
                .peek(this::refreshExpiry)
                .filter(food ->
                        "AVAILABLE".equals(food.getStatus()))
                .filter(food -> search == null
                        || food.getFoodName().toLowerCase()
                        .contains(search.trim().toLowerCase()))
                .filter(food -> type == null
                        || type.isBlank()
                        || food.getFoodType().equalsIgnoreCase(type))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        return foods.findById(id)
                .map(food -> {
                    refreshExpiry(food);
                    return ResponseEntity.ok((Object) food);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody FoodRequest request,
            Authentication authentication) {

        FoodPost food = new FoodPost();
        food.setFoodName(request.foodName().trim());
        food.setDescription(request.description().trim());
        food.setQuantity(request.quantity());
        food.setFoodType(request.foodType());
        food.setPickupLocation(request.pickupLocation().trim());
        
        if (request.ownerPhone() != null) {
            food.setOwnerPhone(request.ownerPhone().trim());
        }
        
        food.setAvailableUntil(request.availableUntil());
        food.setOwnerUsername(authentication.getName());
        food.setStatus("AVAILABLE");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(foods.save(food));
    }

    @GetMapping("/mine")
    public List<FoodPost> mine(Authentication authentication) {
        return foods.findByOwnerUsernameOrderByCreatedAtDesc(
                authentication.getName());
    }

    @GetMapping("/claimed")
    public List<FoodPost> claimed(Authentication authentication) {
        return foods.findByClaimedByOrderByClaimedAtDesc(
                authentication.getName());
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<?> claim(
            @PathVariable Long id,
            Authentication authentication) {

        return foods.findById(id).map(food -> {
            refreshExpiry(food);

            if (food.getOwnerUsername().equals(
                    authentication.getName())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "You cannot claim your own food post"));
            }

            if (!"AVAILABLE".equals(food.getStatus())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "This food is no longer available"));
            }

            food.setStatus("CLAIMED");
            food.setClaimedBy(authentication.getName());
            food.setClaimedAt(LocalDateTime.now());

            return ResponseEntity.ok((Object) foods.save(food));

        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            Authentication authentication) {

        return foods.findById(id).map(food -> {
            boolean isOwner = food.getOwnerUsername()
                    .equals(authentication.getName());

            boolean isAdmin = authentication.getAuthorities()
                    .stream()
                    .anyMatch(a -> a.getAuthority()
                            .equals("ROLE_ADMIN"));

            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error",
                                "You cannot delete this post"));
            }

            foods.delete(food);
            return ResponseEntity.noContent().build();

        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}