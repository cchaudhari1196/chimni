package com.controller;

import com.entities.MyOrder;
import com.models.Order;
import com.models.Rating;
import com.service.MyOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
public class MyOrderController {
	
	@Autowired
	MyOrderService moservice;
	
	@PostMapping("/saveMyOrder")
	public ResponseEntity addMyOrder(@RequestBody Order mo) {
		try{
			MyOrder order = moservice.addMyOrder(mo);
			return new ResponseEntity(order, HttpStatus.OK);
		}
		catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
		}
	}
	
	@GetMapping("/getMyOrder/{o_id}")
	public MyOrder getMyOrder(@PathVariable int o_id) {
		return moservice.findById(o_id);
	}

	@GetMapping("/getAllOrders")
	public List<MyOrder> getAllOrder() {
		return moservice.getAllOrders();
	}

	@GetMapping("/getorderdatafromuid/{u_id}")
	public List<MyOrder> getOrderDataFromUid(@PathVariable("u_id") int uid)
	{
		return moservice.getOrderDataFromUid(uid);
	}

	@PostMapping("/rateMyOrder")
	public ResponseEntity<Boolean> rateOrder(@RequestBody Rating rating)
	{
		Boolean isSucceed = moservice.rateMyOrder(rating);
		moservice.calculateProductRating(rating.getProduct_id());
		return ResponseEntity.ok().body(isSucceed);
	}

	@PostMapping("/cancelOrder/{orderId}")
	public ResponseEntity<MyOrder> cancelOrder(@PathVariable("orderId") Integer orderId)
	{
		MyOrder order = moservice.cancelOrder(orderId);
		return ResponseEntity.ok().body(order);
	}
}
