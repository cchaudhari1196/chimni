package com.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.proxy.HibernateProxy;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "myorder")
public class MyOrder {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int o_id;

	private String address;
	private String contactno;
	private float totalprice;
	private String ostatus="Placed";

	private Timestamp timestamp;

	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "u_id")
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	private User user;

	@OneToMany(mappedBy = "order")
	private List<MyOrderProductMapping> productAssoc;

	public MyOrder() {
		super();
		// TODO Auto-generated constructor stub
	}

	public MyOrder( String address, String contactno, float totalprice, String ostatus,
			User user) {
		super();
		this.address = address;
		this.contactno = contactno;
		this.totalprice = totalprice;
		this.ostatus = ostatus;
		this.user = user;
	}

	

	public int getOid() {
		return o_id;
	}


	public void setOid(int oid) {
		this.o_id = oid;
	}


	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getContactno() {
		return contactno;
	}

	public void setContactno(String contactno) {
		this.contactno = contactno;
	}


	public float getTotalprice() {
		return totalprice;
	}

	public void setTotalprice(float totalprice) {
		this.totalprice = totalprice;
	}

	public String getOstatus() {
		return ostatus;
	}

	public void setOstatus(String ostatus) {
		this.ostatus = ostatus;
	}

	public int getO_id() {
		return o_id;
	}

	public void setO_id(int o_id) {
		this.o_id = o_id;
	}

	public User getUser() {
		if(user instanceof HibernateProxy){
			return (User) ((HibernateProxy) user).getHibernateLazyInitializer().getImplementation();
		}
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<MyOrderProductMapping> getProductAssoc() {
		return productAssoc;
	}

	public void setProductAssoc(List<MyOrderProductMapping> productAssoc) {
		this.productAssoc = productAssoc;
	}

	public Timestamp getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Timestamp timestamp) {
		this.timestamp = timestamp;
	}

	public void addProductAssoc(MyOrderProductMapping productAssoc) {
		if(this.productAssoc==null)
			this.productAssoc = new ArrayList<>();
		this.productAssoc.add(productAssoc);
	}


	@Override
	public String toString() {
		return "MyOrder [oid=" + o_id + ", address=" + address + ", contactno=" + contactno
				+ ", totalprice=" + totalprice +  ", ostatus=" + ostatus  + "]";
	}
}
