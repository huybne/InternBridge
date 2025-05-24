package com.a2m.profileservice.service.Impl;

import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.Paging.PageResult;
import com.a2m.profileservice.dto.StudentCardDTO.StudentCardDTO;
import com.a2m.profileservice.dto.message.StudentProfileUpdateMessage;
import com.a2m.profileservice.dto.response.PageResponse;
import com.a2m.profileservice.dto.student_profilesDTOs.student_profilesDTO;
import com.a2m.profileservice.dto.student_profilesDTOs.student_profilesDTOForCreate;
import com.a2m.profileservice.dto.student_profilesDTOs.student_profilesDTOForUpdate;
import com.a2m.profileservice.exception.AppException;
import com.a2m.profileservice.exception.ErrorCode;
import com.a2m.profileservice.mapper.RequestStudentMapper;
import com.a2m.profileservice.mapper.StudentCardMapper;
import com.a2m.profileservice.mapper.StudentProfilesMapper;
import com.a2m.profileservice.model.StudentCard;
import com.a2m.profileservice.model.student_profiles;
import com.a2m.profileservice.service.StudentProfileService;
import com.a2m.profileservice.util.ProfileUpdatePublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentProfileServiceImpl implements StudentProfileService {


    private final StudentProfilesMapper mapper;
    private final StudentCardMapper studentCardMapper;
    private final RequestStudentMapper requestStudentMapper;
    private final ProfileUpdatePublisher profileUpdatePublisher;
    @Autowired
    public StudentProfileServiceImpl(StudentProfilesMapper mapper, StudentCardMapper studentCardMapper, RequestStudentMapper requestStudentMapper, ProfileUpdatePublisher profileUpdatePublisher) {
        this.mapper = mapper;
        this.studentCardMapper = studentCardMapper;
        this.requestStudentMapper = requestStudentMapper;
        this.profileUpdatePublisher = profileUpdatePublisher;
    }


    @Override
    public ApiResponse<List<student_profilesDTO>> getAll() {
        List<student_profiles> student_profiles = mapper.getAll();
        System.out.println("student_profiles is null" + student_profiles);
        List<student_profilesDTO> student_profilesDTOs = new ArrayList<student_profilesDTO>();
        System.out.println("student_profiles is null" + student_profiles);
        if (student_profiles.size() == 0) {
            System.out.println("student_profiles is null");
            throw new AppException(ErrorCode.STUDENT_NOT_FOUND);
        }

        for (student_profiles profile : student_profiles) {
            student_profilesDTO profileDTO = new student_profilesDTO();

            // Chuyển đổi các trường từ entity sang DTO
            profileDTO.setProfileId(profile.getProfileId());
            profileDTO.setFullName(profile.getFullName());
            profileDTO.setMajor(profile.getMajor());
            profileDTO.setDateOfBirth(profile.getDateOfBirth());
            profileDTO.setAddress(profile.getAddress());
            profileDTO.setUniversity(profile.getUniversity());
            profileDTO.setAvatarUrl(profile.getAvatarUrl());
            profileDTO.setAcademicYearStart(profile.getAcademicYearStart());
            profileDTO.setAcademicYearEnd(profile.getAcademicYearEnd());
            profileDTO.setPhoneNumber(profile.getPhoneNumber());
            profileDTO.setApproved(profile.isApproved());
            profileDTO.setStatus(profile.getStatus());
            profileDTO.setDeleted(profile.isDeleted());
            profileDTO.setCreatedAt(profile.getCreatedAt());
            profileDTO.setUpdatedAt(profile.getUpdatedAt());

            // Thêm vào danh sách DTO
            student_profilesDTOs.add(profileDTO);
        }

        System.out.println("student_profiles is not null");
        ApiResponse<List<student_profilesDTO>> apiResponse = new ApiResponse<>();
        apiResponse.setData(student_profilesDTOs);
        apiResponse.setMessage("Success");
        apiResponse.setCode(200);
        return apiResponse;
    }

    @Override
    public ApiResponse<student_profilesDTO> getProfileStudentById(String id) {
        student_profiles student_profiles = mapper.getById(id);
        if (student_profiles == null) {
            throw new AppException(ErrorCode.STUDENT_NOT_FOUND);
        }
        ApiResponse<student_profilesDTO> apiResponse = new ApiResponse<>();
        student_profilesDTO studentProfiles = new student_profilesDTO();
        studentProfiles.setProfileId(student_profiles.getProfileId());
        studentProfiles.setFullName(student_profiles.getFullName());
        studentProfiles.setMajor(student_profiles.getMajor());
        studentProfiles.setDateOfBirth(student_profiles.getDateOfBirth());
        studentProfiles.setAddress(student_profiles.getAddress());
        studentProfiles.setUniversity(student_profiles.getUniversity());
        studentProfiles.setAvatarUrl(student_profiles.getAvatarUrl());
        studentProfiles.setAcademicYearStart(student_profiles.getAcademicYearStart());
        studentProfiles.setAcademicYearEnd(student_profiles.getAcademicYearEnd());
        studentProfiles.setPhoneNumber(student_profiles.getPhoneNumber());
        studentProfiles.setApproved(student_profiles.isApproved());
        studentProfiles.setStatus(student_profiles.getStatus());
        studentProfiles.setDeleted(student_profiles.isDeleted());
        studentProfiles.setCreatedAt(student_profiles.getCreatedAt());
        studentProfiles.setUpdatedAt(student_profiles.getUpdatedAt());

        List<StudentCard> studentCards = studentCardMapper.getStudentCardByStudentId(id);
        List<StudentCardDTO> studentCardDTOS = studentCards.stream().map(stc -> new StudentCardDTO(stc.getCardId(), stc.getStudentCardUrl(), stc.isDeleted())).collect(Collectors.toList());
        studentProfiles.setStudentCardDTOS(studentCardDTOS);
        apiResponse.setData(studentProfiles);
        apiResponse.setMessage("Success");
        apiResponse.setCode(200);
        return apiResponse;
    }


    @Override
    public ApiResponse<student_profilesDTO> GetProfileStudentByUpdate(String id) {
        student_profiles student_profiles = mapper.getById(id);
        if (student_profiles == null) {
            throw new AppException(ErrorCode.STUDENT_NOT_FOUND);
        }
        ApiResponse<student_profilesDTO> apiResponse = new ApiResponse<>();
        student_profilesDTO studentProfiles = new student_profilesDTO();
        studentProfiles.setProfileId(student_profiles.getProfileId());
        studentProfiles.setFullName(student_profiles.getFullName());
        studentProfiles.setMajor(student_profiles.getMajor());
        studentProfiles.setDateOfBirth(student_profiles.getDateOfBirth());
        studentProfiles.setAddress(student_profiles.getAddress());
        studentProfiles.setUniversity(student_profiles.getUniversity());
        studentProfiles.setAvatarUrl(student_profiles.getAvatarUrl());
        studentProfiles.setAcademicYearStart(student_profiles.getAcademicYearStart());
        studentProfiles.setAcademicYearEnd(student_profiles.getAcademicYearEnd());
        studentProfiles.setPhoneNumber(student_profiles.getPhoneNumber());
        studentProfiles.setApproved(student_profiles.isApproved());
        studentProfiles.setStatus(student_profiles.getStatus());
        studentProfiles.setDeleted(student_profiles.isDeleted());
        studentProfiles.setCreatedAt(student_profiles.getCreatedAt());
        studentProfiles.setUpdatedAt(student_profiles.getUpdatedAt());
        apiResponse.setData(studentProfiles);
        apiResponse.setMessage("Success");
        apiResponse.setCode(200);
        return apiResponse;
    }

    @Override
    public ApiResponse<Object> UpdateProfileStudent(student_profilesDTOForUpdate student_profilesDTO, String id) {
        boolean check = requestStudentMapper.checkRequestStudentAlreadyRegistered(id);
        if (check) {
            throw new AppException(ErrorCode.REQUEST_STUDENT_ALREADY_REGISTERED);
        }

        student_profiles studentProfiles = mapper.getById(id);
        if (studentProfiles == null) {
            throw new AppException(ErrorCode.STUDENT_NOT_FOUND);
        }
        studentProfiles.setFullName(student_profilesDTO.getFullName());
        studentProfiles.setMajor(student_profilesDTO.getMajor());
        studentProfiles.setDateOfBirth(student_profilesDTO.getDateOfBirth());
        studentProfiles.setAddress(student_profilesDTO.getAddress());
        studentProfiles.setUniversity(student_profilesDTO.getUniversity());
        studentProfiles.setPhoneNumber(student_profilesDTO.getPhoneNumber());
        studentProfiles.setAcademicYearStart(student_profilesDTO.getAcademicYearStart());

        studentProfiles.setAcademicYearEnd(student_profilesDTO.getAcademicYearEnd().orElse(null));


        int row = mapper.updateStudentProfile(studentProfiles);
        if (row <= 0) {
            throw new AppException(ErrorCode.DATABASE_CONNECTION_FAILED);
        }
        StudentProfileUpdateMessage msg = new StudentProfileUpdateMessage(
                studentProfiles.getProfileId(),
                studentProfiles.getFullName(),
                studentProfiles.getDateOfBirth(),
                studentProfiles.getUniversity(),
                studentProfiles.getAvatarUrl()
        );
        profileUpdatePublisher.sendStudentProfileUpdate(msg);

        // logic has big problem !!!!
//        if ((student_profilesDTO.getStudentCardUrlNew() == null ||
//            !student_profilesDTO.getStudentCardUrlNew().isPresent() || student_profilesDTO.getStudentCardUrlNew().get().size() == 0)&&) {
//            ApiResponse<Object> apiResponse = new ApiResponse<>();
//            apiResponse.setCode(200);
//            apiResponse.setMessage("Update Success");
//            return apiResponse;
//        }
        var stdcard = studentCardMapper.getStudentCardByStudentId(id);
        List<String> studentcardidsold = new ArrayList<>();
        studentcardidsold = stdcard.stream().map(s -> s.getCardId()).collect(Collectors.toList());
        System.out.println("cardid old" + studentcardidsold);
        List<String> studentCardUrlId = student_profilesDTO.getStudentCardUrlId();
        if (studentCardUrlId == null) {
            studentCardUrlId = new ArrayList<>(); // hoặc return luôn nếu null là hợp lệ
        }
        List<String> diff = getDifference(studentcardidsold, studentCardUrlId);

        System.out.println("cardid diff: " + diff.size());
        for (String s : diff) {
            int r = studentCardMapper.DeleteStudentCard(s);
            if (r != 1) {
                throw new AppException(ErrorCode.DATABASE_CONNECTION_FAILED);
            }
        }


        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Update Success");
        return apiResponse;
    }

    private List<String> getDifference(List<String> oldid, List<String> newids) {
        // Tạo một bản sao của list1 để giữ nguyên list1 ban đầu
        List<String> difference = new ArrayList<>(oldid);
        // Loại bỏ tất cả các phần tử có trong list2 khỏi difference
        difference.removeAll(newids);
        return difference;
    }

    @Override
    public ApiResponse<student_profilesDTOForCreate> CreateProfileStudent(student_profilesDTOForCreate student_profiles, String id) {
        int check = mapper.checkExits(id);
        if (check == 1) {
            throw new AppException(ErrorCode.STUDENT_ALREADY_REGISTERED);
        }

        student_profiles studentProfiles = new student_profiles();
        studentProfiles.setProfileId(id);
        studentProfiles.setFullName(student_profiles.getFullName());
        studentProfiles.setMajor(student_profiles.getMajor());
        studentProfiles.setDateOfBirth(student_profiles.getDateOfBirth());
        studentProfiles.setAddress(student_profiles.getAddress());
        studentProfiles.setUniversity(student_profiles.getUniversity());
//        studentProfiles.setAvatarUrl(student_profiles.getAvatarUrl());
        studentProfiles.setAcademicYearStart(student_profiles.getAcademicYearStart());
        studentProfiles.setAcademicYearEnd(student_profiles.getAcademicYearEnd().orElse(null));

        studentProfiles.setPhoneNumber(student_profiles.getPhoneNumber());

        var u = mapper.createStudentProfile(studentProfiles);

        ApiResponse<student_profilesDTOForCreate> apiResponse = new ApiResponse<>();
        apiResponse.setData(student_profiles);
        apiResponse.setMessage("Create Success");
        apiResponse.setCode(200);
        return apiResponse;
    }

    @Override
    public ApiResponse<?> updateAvatar(String id, String url) {
        int row = mapper.UpdateAvatar(id, url);
        StudentProfileUpdateMessage msg = new StudentProfileUpdateMessage(
                id,
                null,
                null,
                null,
                url
        );
        profileUpdatePublisher.sendStudentProfileUpdate(msg);
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Update Success");
        return apiResponse;
    }

    @Override
    public ApiResponse<Integer> checkIfExists(String id) {
        var check = mapper.checkIfExists(id);
        if (!check) {
            throw new AppException(ErrorCode.STUDENT_NOT_PROFILE);
        }

        var user = mapper.getById(id);
        ApiResponse<Integer> apiResponse = new ApiResponse<>();
        if(user.getStatus().equals("inactive")){
            apiResponse.setData(0);
        }else{
            apiResponse.setData(1);
        }
        apiResponse.setMessage("Check Success");
        apiResponse.setCode(200);

        return apiResponse;
    }

    public ApiResponse<?> checkExits(String id) {
        int check = mapper.checkExits(id);
        if (check == 0) {
            throw new AppException(ErrorCode.STUDENT_NOT_FOUND);
        }
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Student is exist");

        return apiResponse;
    }

    @Override
    public ApiResponse<PageResult<student_profilesDTO>> GetStudentProfile(String search,
                                                                          int isApproved,
                                                                          int offset,
                                                                          int limit) {
        List<student_profiles> student_profiles = mapper.GetAllStudentProfiles(search, isApproved, offset, limit);
        int count = mapper.CountAllStudentProfiles(search, isApproved);
        List<student_profilesDTO> studentProfilesDTOS = student_profiles.stream().map(st ->
                student_profilesDTO.builder().profileId(st.getProfileId())
                        .fullName(st.getFullName())
                        .major(st.getMajor())
                        .dateOfBirth(st.getDateOfBirth())
                        .address(st.getAddress())
                        .university(st.getUniversity())
                        .avatarUrl(st.getAvatarUrl())
                        .academicYearStart(st.getAcademicYearStart())
                        .academicYearEnd(st.getAcademicYearEnd())
                        .phoneNumber(st.getPhoneNumber())
                        .isApproved(st.isApproved())
                        .status(st.getStatus())
                        .isDeleted(st.isDeleted())
                        .createdAt(st.getCreatedAt())
                        .updatedAt(st.getUpdatedAt()).build()
        ).toList();
        PageResult<student_profilesDTO> pageResult = new PageResult<>();
        pageResult.setItems(studentProfilesDTOS);
        pageResult.setTotalCount(count);
        int totalPage = (int) Math.ceil((double) count / (double) limit);
        pageResult.setTotalPages(totalPage);
        pageResult.setOffset(offset+1);
        pageResult.setLimit(limit);
        ApiResponse<PageResult<student_profilesDTO>> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Get Success");
        apiResponse.setData(pageResult);
        return apiResponse;
    }

    @Override
    public boolean updateStatusStudent(String id) {
        String status = mapper.getStatusStudent(id);
        if (status == null) {
            throw new AppException(ErrorCode.STUDENT_NOT_FOUND);
        }
        int r = 0;
        if (status.equals("active")) {
            r = mapper.updateStatusStudent(id, "inactive");
        } else if (status.equals("inactive")) {
            r = mapper.updateStatusStudent(id, "active");
        }

        if (r == 0) {
            throw new AppException(ErrorCode.STUDENT_NOT_PROFILE);
        }
        return true;
    }

    @Override
    public boolean checkApproveStatus(String id) {
        Integer count  = mapper.checkApproveStatus(id);
        return count > 0;
    }
}
