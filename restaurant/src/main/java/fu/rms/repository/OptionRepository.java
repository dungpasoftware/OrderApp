package fu.rms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fu.rms.entity.Option;

public interface OptionRepository extends JpaRepository<Option, Long>{

	@Query(name = "Option.findByDishId")
	List<Option> findByDishId(Long dishId);
	
}
