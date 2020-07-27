package fu.rms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import fu.rms.dto.GroupMaterialDto;
import fu.rms.service.IGroupMaterialService;

@RestController
public class GroupMaterialController {

	@Autowired
	IGroupMaterialService groupMaterialService;
	
	@GetMapping("/group-material/all")
	public List<GroupMaterialDto> getAll() {
		return groupMaterialService.getAll();
	}
}