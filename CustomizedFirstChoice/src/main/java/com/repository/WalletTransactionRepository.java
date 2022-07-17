package com.repository;

import com.entities.WalletHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletHistory, Integer>
{
}
