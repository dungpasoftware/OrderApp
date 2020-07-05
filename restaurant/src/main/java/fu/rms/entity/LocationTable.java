package fu.rms.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "location_table")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationTable {

	@Id
	@Column(name="location_table_id")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long locationTableId;
	
	@Column(name = "location_code")
	private String locationCode;
	
	@Column(name = "location_name")
	private String locationName;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="status_id")
	private Status status;
	
	@OneToMany(mappedBy = "locationTable")
	private List<Tables> tables;
}
