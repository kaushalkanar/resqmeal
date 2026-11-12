package com.example.foodsharing.food;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodRepository
        extends JpaRepository<FoodPost, Long> {

    List<FoodPost> findByOwnerUsernameOrderByCreatedAtDesc(
            String username);

    List<FoodPost> findByClaimedByOrderByClaimedAtDesc(
            String username);
}