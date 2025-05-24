package com.a2m.profileservice.mapper;

import com.a2m.profileservice.model.StudentCard;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StudentCardMapper {
    public List<StudentCard> getStudentCardByStudentId(String id);
    public int CreateStudentCard(StudentCard studentCard);
    public int DeleteStudentCard(String id);
}
