package com.controller;

import com.models.RazorpayOrder;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/payment")
public class PaymentController {

    @PostMapping(value = "/razorpay/{amount}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RazorpayOrder> razorPay(@PathVariable("amount") String amount){
        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount); // amount in the smallest currency unit
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcptid_11");
            RazorpayClient razorpay = new RazorpayClient("rzp_test_7Q02Vr6vMkAWGi", "Qm45uG4Jcqij7i1ahHZ778hA");
            Order order = razorpay.orders.create(orderRequest);
            return ResponseEntity.ok(new RazorpayOrder(order.get("id"), order.get("currency"), orderRequest.getLong("amount")));
        } catch (RazorpayException e) {
            // Handle Exception
            System.out.println(e.getMessage());
        }
        return (ResponseEntity<RazorpayOrder>) ResponseEntity.internalServerError();
    }
}
