package com.a2m.profileservice.service;

import com.a2m.profileservice.model.RequestBusinesses;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RequestBusinessesService {
    RequestBusinesses insertRequestBusiness(String businessId);

    List<RequestBusinesses> getAllRequestBusiness();

    RequestBusinesses getRequestBusinessById(String requestId);

    RequestBusinesses getRequestBusinessByBusinessId(String businessId);

//    int deleteRequestBusinessById(String requestId);

//    int updateRequestBusiness(RequestBusiness requestBusiness);
}
