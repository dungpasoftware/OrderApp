package fu.rms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import fu.rms.entity.Dish;

public interface DishRepository extends JpaRepository<Dish, Long> {

	
	//get all dish by status of dish
	@Query(name="Dish.findByStatusId")
	List<Dish> findByStatusId(Long statusId);
	
	// get all dish by categoryId
	@Query(name="Dish.findByCategoryId")
	List<Dish> findByCategoryId(Long categoryId);

	// get all dish by category and status of dish
	@Query(name = "Dish.findByCategoryIdAndStatusId")
	List<Dish> findByCategoryIdAndStatusId(Long categoryId, Long statusId);
	
	long countByDishCodeStartingWith(String dishCode);
	
	// update status of dish
	@Modifying
	@Query(name = "Dish.updateStatusId")
	int updateStatus(Long dishId, Long statusId);

	// when ordered dish, update remainQuantity
	@Modifying
	@Query(name = "Dish.updateRemainQuantity")
	int updateRemainQuantity(Long dishId, int remainQuantity);
	
	@Query(	value = "SELECT DISTINCT d.* FROM dishes AS d INNER JOIN dish_category AS dc ON d.dish_id = dc.dish_id",
			countQuery = "SELECT DISTINCT COUNT(*) from dishes",
			nativeQuery = true)
	Page<Dish> search(String dishName,Pageable pageable);

}
