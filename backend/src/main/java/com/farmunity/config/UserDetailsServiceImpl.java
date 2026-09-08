package com.farmunity.config;

import com.farmunity.entity.Buyer;
import com.farmunity.entity.Coordinator;
import com.farmunity.entity.Farmer;
import com.farmunity.repository.BuyerRepository;
import com.farmunity.repository.CoordinatorRepository;
import com.farmunity.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final FarmerRepository farmerRepository;
    private final BuyerRepository buyerRepository;
    private final CoordinatorRepository coordinatorRepository;

    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        Optional<Farmer> farmerOpt = farmerRepository.findByPhone(phone);
        if (farmerOpt.isPresent()) {
            Farmer f = farmerOpt.get();
            return new User(f.getPhone(), f.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_FARMER")));
        }

        Optional<Buyer> buyerOpt = buyerRepository.findByPhone(phone);
        if (buyerOpt.isPresent()) {
            Buyer b = buyerOpt.get();
            return new User(b.getPhone(), b.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_BUYER")));
        }

        Optional<Coordinator> coordOpt = coordinatorRepository.findByPhone(phone);
        if (coordOpt.isPresent()) {
            Coordinator c = coordOpt.get();
            return new User(c.getPhone(), c.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_COORDINATOR")));
        }

        throw new UsernameNotFoundException("User not found with phone: " + phone);
    }
}
