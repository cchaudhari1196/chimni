package com.service;


import com.entities.User;
import com.models.ChangePasswordModel;
import com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService
{
	@Autowired
	private UserRepository userrepo;

	//register
	public User registerUser(User user) throws Exception {
		User foundUser = userrepo.findUserByEmail(user.getU_email());
		if(foundUser != null){
			throw new Exception("User already exists");
		}
		// TODO Auto-generated method stub
			return userrepo.save(user);
	}

	public User getUserById(int id)
	{
		// TODO Auto-generated method stub
		return userrepo.findById(id).get();
	}

	//login
	public User loginUser(User user) {
		// TODO Auto-generated method stub
		
		User user1=userrepo.findByEmail(user.getU_email(),user.getU_password());
		
		if(user1!=null && user1.getU_email().equals(user.getU_email())&& user1.getU_password().equals(user.getU_password()))
			return user1 ;
		else
			return null;
	}


	//update
	public User addWalletMoney(User user) {
		// TODO Auto-generated method stub
		User existinguser;
		existinguser=userrepo.findById(user.getU_id()).orElse(null);
		if(existinguser != null) {
			float existingWallet = existinguser.getWallet() > 0 ? existinguser.getWallet() : 0;
			existinguser.setWallet(existingWallet + user.getWallet());
		}
		return userrepo.save(existinguser);
	}



	//update
	public User updateUser(User user) {
		// TODO Auto-generated method stub
		User existinguser;
		existinguser=userrepo.findById(user.getU_id()).orElse(null);
		if(existinguser != null) {
			existinguser.setU_fname(user.getU_fname());
			existinguser.setU_lname(user.getU_lname());
			existinguser.setU_phone(user.getU_phone());
			existinguser.setU_email(user.getU_email());
			existinguser.setU_password(user.getU_password());
			existinguser.setU_address(user.getU_address());
		}
		
		return userrepo.save(existinguser);
	}


	public boolean deleteUser(int u_id) {
		// TODO Auto-generated method stub
		
		userrepo.deleteById(u_id);
		return true;
		
	}


	public User singleUser(int u_id) {
		// TODO Auto-generated method stub
		return userrepo.findById(u_id).orElse(null);
	}


	public java.util.List<User> allUser() {
		// TODO Auto-generated method stub
		return userrepo.findAll();
	}

	public User changePassword(ChangePasswordModel changePasswordModel) {
		User user = userrepo.findUserByEmail(changePasswordModel.getEmail());
		user.setU_password(changePasswordModel.getPassword());
		userrepo.save(user);
		return user;
	}
}

