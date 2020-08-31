package fu.rms.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import fu.rms.constant.StatusConstant;
import fu.rms.dto.CategoryDto;
import fu.rms.entity.Category;
import fu.rms.entity.Status;
import fu.rms.exception.NotFoundException;
import fu.rms.repository.CategoryRepository;
import fu.rms.repository.StatusRepository;


@SpringBootTest
public class CategoryServiceTest {

	@Autowired
	private CategoryService categoryService;

	@MockBean
	private CategoryRepository categoryRepo;

	@MockBean
	private StatusRepository statusRepo;


	@Test
	@DisplayName("Get Category By Id")
	public void testWhenGetById() {

		// expect
		Category categoryExpect = new Category();
		categoryExpect.setCategoryId(1L);
		categoryExpect.setCategoryName("Ăn aaaa");
		categoryExpect.setDescription("Đây là đồ ăn sáng");
		categoryExpect.setPriority(1);
		categoryExpect.setCreatedBy("NhanNTK");
		categoryExpect.setCreatedDate(LocalDateTime.now().minusDays(1));
		categoryExpect.setLastModifiedBy("NhanNTK");
		categoryExpect.setLastModifiedDate(LocalDateTime.now());

		Status status = new Status();
		status.setStatusId(StatusConstant.STATUS_CATEGORY_AVAILABLE);
		status.setStatusName("Status");
		status.setStatusDescription("Status Category");
		status.setStatusValue("AVAILABLE");
		categoryExpect.setStatus(status);
		
		when(categoryRepo.findById(Mockito.anyLong())).thenReturn(Optional.of(categoryExpect));
		
		// actual
		CategoryDto categoryActual = categoryService.getById(1L);

		// test
		assertThat(categoryActual).isNotNull();	
		assertThat(categoryActual.getCategoryId()).isEqualTo(categoryExpect.getCategoryId());	
		assertThat(categoryActual.getCategoryName()).isEqualTo(categoryExpect.getCategoryName());
		assertThat(categoryActual.getDescription()).isEqualTo(categoryExpect.getDescription());
		assertThat(categoryActual.getPriority()).isEqualTo(categoryExpect.getPriority());
	}
	
	@Test
	@DisplayName("Get Category NotFound")
	public void testWhenGetByIdThrowNotFoundException() {
		
		when(categoryRepo.findById(Mockito.anyLong())).thenReturn(Optional.empty());	
		
		Assertions.assertThrows(NotFoundException.class, () -> categoryService.getById(1L));
	
			
	}
	
	@Test
	@DisplayName("Get All Category")
	public void testWhenGetAll() {
		

		// expect
		Category category1 = new Category();
		category1.setCategoryId(1L);
		category1.setCategoryName("Ăn Sáng");
		category1.setDescription("Đây là đồ ăn sáng");
		category1.setPriority(1);
		category1.setCreatedBy("NhanNTK");
		category1.setCreatedDate(LocalDateTime.now().minusDays(1));
		category1.setLastModifiedBy("NhanNTK");
		category1.setLastModifiedDate(LocalDateTime.now());
		
		Category category2 = new Category();
		category2.setCategoryId(1L);
		category2.setCategoryName("Ăn Tối");
		category2.setDescription("Đây là đồ ăn tối");
		category2.setPriority(1);
		category2.setCreatedBy("NhanNTK");
		category2.setCreatedDate(LocalDateTime.now().minusDays(2));
		category2.setLastModifiedBy("NhanNTK");
		category2.setLastModifiedDate(LocalDateTime.now());

		Status status = new Status();
		status.setStatusId(StatusConstant.STATUS_CATEGORY_AVAILABLE);
		status.setStatusName("Status");
		status.setStatusDescription("Status Category");
		status.setStatusValue("AVAILABLE");
		category1.setStatus(status);
		category2.setStatus(status);
		
		List<Category> categoriesExpect=new ArrayList<>();
		categoriesExpect.add(category1);
		categoriesExpect.add(category2);
		
	
		when(categoryRepo.findByStatusId(StatusConstant.STATUS_CATEGORY_AVAILABLE)).thenReturn(categoriesExpect);
		
		// actual
		List<CategoryDto> categoryActuals= categoryService.getAll();
		
		//test
		assertThat(categoriesExpect.size()).isEqualTo(categoryActuals.size());		
		
		
		
	}

}
