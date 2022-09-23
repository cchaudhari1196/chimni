package com.service;

import com.entities.*;
import com.models.Order;
import com.models.OrderQuantity;
import com.models.Rating;
import com.repository.*;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Service
public class MyOrderService {
	@Autowired
	MyOrderRepository morepo;

	@Autowired
	UserRepository userRepo;

	@Autowired
	ProductRepository productRepo;

	@Autowired
	VendorRepository vendorRepo;

	@Autowired
	AdminRepository adminRepo;

	@Autowired
	MyOrderProductMappingRepository opMappingRepo;

	@Autowired
	MyOrderRepository orderRepo;

	public List<MyOrder> getOrderDataFromUid(int uid) {
		List<MyOrder> orders = morepo.findAll();
		List<MyOrder> ordersForUser = new ArrayList<>();
		for(MyOrder order: orders) {
			if (order != null && order.getUser().getU_id()==uid) {
				ordersForUser.add(order);
				List<MyOrderProductMapping> allMappings = opMappingRepo.findAll();
				List<MyOrderProductMapping> mappings = new ArrayList<>();
				for (MyOrderProductMapping op : allMappings) {
					if (op.getOrder().getOid() == order.getOid()) {
						mappings.add(op);
					}
				}
				order.setProductAssoc(mappings);
			}
		}
		return ordersForUser;
	}

	public MyOrder addMyOrder(Order mo) throws Exception {
		float price = mo.getTotalprice();
		MyOrder orderEntity = new MyOrder();
		orderEntity.setAddress(mo.getAddress());
		orderEntity.setContactno(mo.getO_phone());
		orderEntity.setOstatus(mo.getOstatus());
		orderEntity.setTotalprice(mo.getTotalprice());
		orderEntity.setTotalprice(price);
		orderEntity.setTimestamp(Timestamp.from(Instant.now()));
		User user = userRepo.getById(mo.getU_id());
		orderEntity.setUser(user);

		/*Logic of calculating wallet balance of user*/
		if(!calculateWalletBalances(orderEntity)){
			throw new Exception("Not enough money in the wallet");
		}

		orderRepo.save(orderEntity);

		List<Product> allProducts = productRepo.findAll();
		Map<Integer, Product> productMap = new HashMap();
		for(Product product : allProducts){
			productMap.put(product.getP_id(), product);
		}

		List<Vendor> allVendors = this.vendorRepo.findAll();
		Map<Integer, Vendor> vendorMap = new HashMap();
		for(Vendor vendor : allVendors){
			vendorMap.put(vendor.getV_id(), vendor);
		}

		for (OrderQuantity oq : mo.getProductsQuantity()){
			MyOrderProductMapping myOrderProductMapping = new MyOrderProductMapping();
			Product foundProduct = productMap.get(oq.getProduct_id());
			myOrderProductMapping.setProduct(foundProduct);
			myOrderProductMapping.setQuantity(oq.getQuantity());

			/*Calculate Vendor wallet balance and quanity*/
			calculateWalletForVendor(myOrderProductMapping, vendorMap);
			boolean isQntySuffice = calculateAvailableProductQuantity(myOrderProductMapping);
			if(!isQntySuffice){
				throw new Exception("Quantity not suffice.");
			}

			myOrderProductMapping.setOrder(orderEntity);
			opMappingRepo.save(myOrderProductMapping);
			orderEntity.addProductAssoc(myOrderProductMapping);
		}
		Admin admin = adminRepo.findById(1).get();
		double priceAdminWants = (price / 1.1 ) * 0.1;
		float updatedAdminWallet = (float) (admin.getA_wallet() + priceAdminWants);
		admin.setA_wallet(updatedAdminWallet);
		adminRepo.save(admin);
		return orderEntity;
	}

	private boolean calculateWalletBalances(MyOrder orderEntity){
		User user = orderEntity.getUser();
		float remainingUserBalance = user.getWallet() - orderEntity.getTotalprice();
		if(remainingUserBalance < 0){
			return false;
		}
		user.setWallet(remainingUserBalance);
		this.userRepo.save(user);
		return true;
	}

	private void calculateWalletForVendor(MyOrderProductMapping mapping, Map<Integer, Vendor> vendors){
		float totalPriceForProduct = mapping.getProduct().getPprice() * mapping.getQuantity();
		Vendor requiredVendor = vendors.get(mapping.getProduct().getVdr().getV_id());
		double priceVendorWants = totalPriceForProduct / 1.1;
		float updatedVendorWallet = (float) (requiredVendor.getV_wallet() + priceVendorWants);
		requiredVendor.setV_wallet(updatedVendorWallet);
	}

	private boolean calculateAvailableProductQuantity(MyOrderProductMapping mapping){
		Product product = mapping.getProduct();
		int updatedProductQuantity = product.getPqty() - mapping.getQuantity();
		if(updatedProductQuantity < 0){
			return false;
		}
		product.setPqty(updatedProductQuantity);
		productRepo.save(product);
		return true;
	}

	public MyOrder findById(int oid){
		MyOrder order = morepo.findById(oid).get();
		if(order!=null){
			List<MyOrderProductMapping> allMappings = opMappingRepo.findAll();
			List<MyOrderProductMapping> mappings = new ArrayList<>();
			for(MyOrderProductMapping op:allMappings){
				if(op.getOrder().getOid() == oid){
					mappings.add(op);
				}
			}
			order.setProductAssoc(mappings);

		}
		return order;
	}

	public List<MyOrder> getAllOrders(){
		List<MyOrder> orders = morepo.findAll();
		for(MyOrder order: orders) {
			if (order != null) {
				List<MyOrderProductMapping> allMappings = opMappingRepo.findAll();
				List<MyOrderProductMapping> mappings = new ArrayList<>();
				for (MyOrderProductMapping op : allMappings) {
					if (op.getOrder().getOid() == order.getOid()) {
						mappings.add(op);
					}
				}
				order.setProductAssoc(mappings);
			}
		}
		return orders;
	}

	public List<MyOrder> findAll() {
		List<MyOrder> orders = morepo.findAll();
		// TODO Auto-generated method stub
		if(orders!=null)
		{
			return orders;
		}
		else
		{
			return null;
		}
	}

	public Boolean rateMyOrder(Rating rating){
		MyOrder order = orderRepo.getById(rating.getOrder_id());
		Optional productOrderMappingOptional = order.getProductAssoc().stream().filter(e -> e.getProduct().getP_id() == rating.getProduct_id()).findFirst();
		MyOrderProductMapping productOrderMapping = (MyOrderProductMapping) productOrderMappingOptional.get();
		productOrderMapping.setRating(rating.getRatings());
		orderRepo.save(order);
		return true;
	}

	public boolean calculateProductRating(Integer product_id){
		List<Integer> mapping = opMappingRepo.getAllOrderProductRatingForProduct(product_id);
		Double averageRating = mapping.stream().filter(e -> e > 5).mapToInt(e-> e).average().orElse(10);
		Product product = productRepo.getById(product_id);
		product.setPrating(averageRating.intValue());
		productRepo.save(product);
		return true;
	}

	public MyOrder cancelOrder(Integer orderId){
		MyOrder order = orderRepo.getById(orderId);

		User user = userRepo.getById(order.getUser().getU_id());
		user.setWallet(user.getWallet() + order.getTotalprice());


		List<Product> products = new ArrayList<>();
		List<Vendor> vendors = new ArrayList<>();
		for(MyOrderProductMapping mapping : order.getProductAssoc()){
			Product prod = productRepo.getById(mapping.getProduct().getP_id());
			prod.setPqty(prod.getPqty() + mapping.getQuantity());
			products.add(prod);

			Vendor vendor = vendorRepo.getById(prod.getVdr().getV_id());
			Float costOfProductOrdered = mapping.getProduct().getPprice() * mapping.getQuantity();
			vendor.setV_wallet(vendor.getV_wallet() - (costOfProductOrdered*0.9f));
			vendors.add(vendor);
		}

		Admin admin = adminRepo.findById(1).get();
		float updatedAdminWallet = admin.getA_wallet() - (order.getTotalprice() *0.1f);
		admin.setA_wallet(updatedAdminWallet);

		order.setOstatus("order_cancelled");

		/*Save all data once everything is calculated. otherwise No data will be modified*/
		adminRepo.save(admin);
		productRepo.saveAll(products);
		vendorRepo.saveAll(vendors);
		userRepo.save(user);
		orderRepo.save(order);

		if(order instanceof HibernateProxy){
			HibernateProxy orderProxy = (HibernateProxy) order;
			order = (MyOrder) orderProxy.getHibernateLazyInitializer().getImplementation();
		}
		return order;
	}
}