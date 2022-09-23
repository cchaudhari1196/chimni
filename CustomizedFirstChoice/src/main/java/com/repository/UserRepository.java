package com.repository;

import com.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface UserRepository extends JpaRepository<User, Integer> 
{
	@Query(value="select * from User  WHERE u_email=? AND u_password=?",nativeQuery = true)
	User findByEmail(String u_email, String u_password);

	@Query(value="select u from User u WHERE u.u_email=?1")
	User findUserByEmail(String u_email);

}
