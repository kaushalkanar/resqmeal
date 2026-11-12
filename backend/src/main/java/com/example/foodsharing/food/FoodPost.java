package com.example.foodsharing.food;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_posts")
public class FoodPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String foodName;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, length = 40)
    private String foodType;

    @Column(nullable = false, length = 255)
    private String pickupLocation;

    @Column(nullable = false)
    private LocalDateTime availableUntil;

    @Column(nullable = false, length = 100)
    private String ownerUsername;

    @Column(length = 30)
    private String ownerPhone; // Added owner phone number

    @Column(length = 100)
    private String claimedBy;

    private LocalDateTime claimedAt;

    @Column(nullable = false, length = 20)
    private String status = "AVAILABLE";

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FoodPost() {}

    @PrePersist
    public void beforeSave() {
        if (status == null) status = "AVAILABLE";
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getFoodName() { return foodName; }
    public void setFoodName(String value) { foodName = value; }
    public String getDescription() { return description; }
    public void setDescription(String value) { description = value; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer value) { quantity = value; }
    public String getFoodType() { return foodType; }
    public void setFoodType(String value) { foodType = value; }
    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String value) { pickupLocation = value; }
    public LocalDateTime getAvailableUntil() { return availableUntil; }
    public void setAvailableUntil(LocalDateTime value) {
        availableUntil = value;
    }
    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String value) {
        ownerUsername = value;
    }
    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String value) { ownerPhone = value; }
    public String getClaimedBy() { return claimedBy; }
    public void setClaimedBy(String value) {
        claimedBy = value;
    }
    public LocalDateTime getClaimedAt() { return claimedAt; }
    public void setClaimedAt(LocalDateTime value) {
        claimedAt = value;
    }
    public String getStatus() { return status; }
    public void setStatus(String value) { status = value; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}