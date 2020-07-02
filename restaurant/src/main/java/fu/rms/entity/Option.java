package fu.rms.entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "options")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Option {

	@Id
	@Column(name="option_id")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long optionId;
	
	@Column(name="option_name")
	private String optionName;
	
	@Column(name="option_type")
	private String optionType;
	
	@Column(name="unit")
	private String unit;
	
	@Column(name="price")
	private Double price;
	
	@ManyToOne
	@JoinColumn(name="status_id")
	private Status status;
	
	@ManyToOne
	@JoinColumn(name="dish_id")
	private Dish dish;
}
