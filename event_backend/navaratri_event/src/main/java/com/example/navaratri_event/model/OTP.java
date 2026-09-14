package com.example.navaratri_event.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="otp")
public class OTP {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	Integer ID;
	String email;
	String otp;
	LocalDateTime expiryTime;
	
	public OTP() {
		
	}
	
	public OTP(String email,String otp,LocalDateTime expiryTime) {
		this.email=email;
		this.otp=otp;
		this.expiryTime=expiryTime;
	}

	public Integer getID() {
		return ID;
	}

	public void setID(Integer iD) {
		ID = iD;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

	public LocalDateTime getExpiryTime() {
		return expiryTime;
	}

	public void setExpiryTime(LocalDateTime expiryTime) {
		this.expiryTime = expiryTime;
	}
}
