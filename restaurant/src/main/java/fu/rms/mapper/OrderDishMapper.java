package fu.rms.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import fu.rms.constant.StatusConstant;
import fu.rms.dto.OrderDishCancelDto;
import fu.rms.dto.OrderDishDto;
import fu.rms.entity.Dish;
import fu.rms.entity.Order;
import fu.rms.entity.OrderDish;
import fu.rms.entity.OrderDishCancel;
import fu.rms.entity.OrderDishOption;
import fu.rms.entity.Status;
import fu.rms.newDto.DishOrderDto;
import fu.rms.newDto.OrderDishChef;
import fu.rms.newDto.OrderDishOptionChef;
import fu.rms.newDto.OrderDishOptionDto;
import fu.rms.repository.OptionRepository;
import fu.rms.repository.StatusRepository;
import fu.rms.utils.Utils;

@Component
public class OrderDishMapper {

	@Autowired
	StatusRepository statusRepo;
	
	@Autowired
	OptionRepository optionRepo;
	
	@Autowired
	OrderDishOptionMapper odoMapper;
	
	@Autowired
	OrderDishCancelMapper odcMapper;
	
	public OrderDishDto entityToDto(OrderDish entity) {
		OrderDishDto dto = new OrderDishDto();
		if(entity!=null) {
			dto.setOrderDishId(entity.getOrderDishId());
			dto.setQuantity(entity.getQuantity());
			dto.setSellPrice(entity.getSellPrice());
			dto.setSumPrice(entity.getSumPrice());
			dto.setComment(entity.getComment());
			dto.setCommentCancel(entity.getCommentCancel());
			dto.setOrderOrderId(entity.getOrder().getOrderId());
			dto.setQuantityCancel(entity.getQuantityCancel());
			dto.setQuantityOk(entity.getQuantityOk());
			dto.setCreateBy(entity.getCreateBy());
			dto.setCreateDate(entity.getCreateDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setStatusStatusId(entity.getStatus().getStatusId());
			dto.setStatusStatusValue(entity.getStatus().getStatusValue());
			DishOrderDto dishNew = new DishOrderDto();
			if(entity.getDish() != null) {
				dishNew.setDishId(entity.getDish().getDishId());
				dishNew.setDishName(entity.getDish().getDishName());
				dishNew.setDishUnit(entity.getDish().getDishUnit());
				dishNew.setDefaultPrice(entity.getDish().getDefaultPrice());
				dishNew.setTypeReturn(entity.getDish().getTypeReturn());
				dishNew.setCost(entity.getDish().getCost());
				dishNew.setDishCost(entity.getDish().getDishCost());
			}
			dto.setDish(dishNew);
			List<OrderDishOptionDto> listOdo = new ArrayList<OrderDishOptionDto>();
			if(entity.getOrderDishOptions() != null) {
				if(entity.getOrderDishOptions().size() != 0) {
					listOdo = entity.getOrderDishOptions().stream().map(odoMapper::entityToDto).collect(Collectors.toList());
				}
			}
			dto.setOrderDishOptions(listOdo);
			List<OrderDishCancelDto> listCancel = new ArrayList<OrderDishCancelDto>();
			if(entity.getOrderDishCancels() != null) {
				if(entity.getOrderDishCancels().size() != 0) {
					listCancel = entity.getOrderDishCancels().stream().map(odcMapper::entityToDto).collect(Collectors.toList());
				}
			}
			dto.setOrderDishCancels(listCancel);	
		}
		
		return dto;
	}
	
	public OrderDish dtoToEntity(OrderDishDto dto) {
		
		OrderDish entity = new OrderDish();
		entity.setComment(dto.getComment());
		entity.setSellPrice(dto.getSellPrice());
		Status status = statusRepo.findById(StatusConstant.STATUS_ORDER_DISH_ORDERED).get();
		entity.setStatus(status);
		Order order = new Order();
		order.setOrderId(dto.getOrderOrderId());
		entity.setOrder(order);
		Dish dish = new Dish();
		dish.setDishId(dto.getDish().getDishId());
		dish.setDishName(dto.getDish().getDishName());
		dish.setDishUnit(dto.getDish().getDishUnit());
		dish.setDefaultPrice(dto.getDish().getDefaultPrice());
		entity.setDish(dish);
		List<OrderDishOption> listOdo = new ArrayList<OrderDishOption>();
		List<OrderDishCancel> listCancel = new ArrayList<OrderDishCancel>();
		entity.setOrderDishOptions(listOdo);
		entity.setOrderDishCancels(listCancel);
		
		return entity;
	}
	
	public OrderDishChef entityToChef(OrderDish entity) {
	
		OrderDishChef orderDishChef = new OrderDishChef();
		orderDishChef.setOrderDishId(entity.getOrderDishId());
		orderDishChef.setStatusId(entity.getStatus().getStatusId());
		orderDishChef.setDishId(entity.getDish().getDishId());
		orderDishChef.setDishName(entity.getDish().getDishName());
		orderDishChef.setQuantityOk(entity.getQuantityOk());
		orderDishChef.setComment(entity.getComment());
		orderDishChef.setCreatedDate(entity.getCreateDate());
		if(entity.getCreateDate()!=null) {
			orderDishChef.setOrderTime(Utils.getOrderTime(Utils.getCurrentTime(), entity.getCreateDate()));
		}
		orderDishChef.setTimeToComplete(entity.getDish().getTimeComplete());
		orderDishChef.setStatusValue(entity.getStatus().getStatusValue());
		if(orderDishChef.getCreatedDate() == null) {
			orderDishChef.setCheckNotification(false);
		}else {
			orderDishChef.setCheckNotification(Utils.getTimeToNotification(orderDishChef.getCreatedDate(), orderDishChef.getTimeToComplete()));
		}
		List<OrderDishOptionChef> listDishOptions = new ArrayList<OrderDishOptionChef>();
		if(entity.getOrderDishOptions() != null && entity.getOrderDishOptions().size() != 0) {
			listDishOptions = entity.getOrderDishOptions().stream().map(odoMapper::entityToChef).collect(Collectors.toList());
		}
		orderDishChef.setOrderDishOptions(listDishOptions);
		
		return orderDishChef;
	}
}
