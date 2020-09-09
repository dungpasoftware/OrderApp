package fu.rms.service;

import java.util.List;

import fu.rms.dto.LocationTableDto;

public interface ILocationTableService {

	List<LocationTableDto> getAll();
	
	LocationTableDto getById(Long locationId);
	
}
