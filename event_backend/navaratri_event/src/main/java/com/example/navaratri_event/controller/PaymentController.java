package com.example.navaratri_event.controller;

import com.example.navaratri_event.model.Payment;
import com.example.navaratri_event.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    String razorpayKeySecret;

    @Autowired
    PaymentRepository paymentRepository;

    @PostMapping("/create-order")
    public String createOrder(@RequestBody PaymentRequest request)
            throws Exception {

        RazorpayClient razorpay =
                new RazorpayClient(
                        razorpayKeyId,
                        razorpayKeySecret
                );

        JSONObject orderRequest = new JSONObject();

        orderRequest.put(
                "amount",
                request.getAmount() * 100
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "event_booking_" +
                System.currentTimeMillis()
        );
        Order order =
                razorpay.orders.create(orderRequest);

        return order.toString();
    }

    @PostMapping("/save")
    public Payment savePayment(@RequestBody Payment payment) {
        return paymentRepository.save(payment);
    }

    @GetMapping
    public java.util.List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }


    public static class PaymentRequest {
         double amount;

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }
    }
}