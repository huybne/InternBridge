package com.a2m.profileservice.mapper;

import com.a2m.profileservice.model.ImagesBusiness;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ImagesBusinessMapper {

    int insertImagesBusiness(ImagesBusiness imagesBusiness);
    int deleteImagesBusinessById(@Param("imageId") String imageId);

    List<ImagesBusiness> getImagesBusinessByBusinessId(@Param("businessId") String businessId);
    ImagesBusiness getFirstImageBusinessByBusinessId(@Param("businessId") String businessId);
    ImagesBusiness getImagesBusinessByImageId(@Param("imageId") String imageId);


}
