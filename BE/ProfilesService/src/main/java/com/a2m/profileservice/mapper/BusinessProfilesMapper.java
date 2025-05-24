package com.a2m.profileservice.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.a2m.profileservice.model.BusinessProfiles;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BusinessProfilesMapper {

    void businessVerifycation(@Param("businessProfiles") BusinessProfiles businessProfiles,
                              @Param("profileId") String profileId);

    Optional<String> findByTaxCode(@Param("taxCode") String taxCode);

    BusinessProfiles getBusinessProfileById(@Param("profileId") String profileId);

    int updateBusinessProfile(BusinessProfiles businessProfiles);

    String getCompanyNameById(@Param("profileId") String profileId);


    boolean checkProfileExist(@Param("profileId") String profileId);


    int updateBusinessProfileAfterFix(BusinessProfiles businessProfiles);

    List<BusinessProfiles> getAllBusinessProfiles(@Param("search") String search,
                                                  @Param("isApproved") int isApproved,
                                                  @Param("offset") int offset,
                                                  @Param("limit") int limit);

    int CountAllBusinessProfiles(@Param("search") String search,
                                 @Param("isApproved") int isApproved);

    String getStatusBusinessProfileById(@Param("profileId") String profileId);

    int updateStatusBusinessProfileById(@Param("profileId") String profileId,@Param("status") String status);

    int addImagevatrBusinessProfile(@Param("profileId") String profileId,@Param("images") String images);
}
