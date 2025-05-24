package com.internship.recruitment_service.consumer;

import com.internship.recruitment_service.dto.message.BusinessProfileUpdateMessage;
import com.internship.recruitment_service.dto.message.StudentProfileUpdateMessage;
import com.internship.recruitment_service.service.ApplyJobsService;
import com.internship.recruitment_service.service.JobPostingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProfileUpdateConsumer {

    private final ApplyJobsService applyJobsService;
    private final JobPostingsService jobPostingsService;

    @RabbitListener
    public void handleStudent(StudentProfileUpdateMessage msg){
        applyJobsService.updateStudentInfoFromProfile(msg);
    }

    @RabbitListener
    public void handleBussiness(BusinessProfileUpdateMessage msg){
        jobPostingsService.updateBusinessInfoFromProfile(msg);
    }

}
