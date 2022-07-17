package com.models;

public class RazorpayOrder {
    private String id;
    private String currency;
    private Long amount;

    public RazorpayOrder(String id, String currency, Long amount) {
        this.id = id;
        this.currency = currency;
        this.amount = amount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }
}
