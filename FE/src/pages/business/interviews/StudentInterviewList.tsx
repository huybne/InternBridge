import React, { useEffect, useState } from "react";
import { Calendar, Button, Badge } from "rsuite";
import moment from "moment";
import { useAppDispatch } from "../../../app/hook";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import {
  fetchInterviews,
  setSelectedDateInterviews,
  updateInterviewStatusThunk,
} from "../../../service/business/interviews/interviewSlice";
import "./InterviewCalendar.css";
import "rsuite/Calendar/styles/index.css";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function StudentInterviewList() {
  const dispatch = useAppDispatch();
  const { interviews, loading, error, selectedDateInterviews } = useSelector(
    (state: RootState) => state.interview
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    dispatch(fetchInterviews({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  const renderCell = (date: Date) => {
    const hasInterview = interviews.some((interview) =>
      moment(interview.interviewTime).isSame(date, "day")
    );
    return hasInterview ? (
      <Badge content="!" className="interview-badge" />
    ) : null;
  };

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    const dayInterviews = interviews.filter((interview) =>
      moment(interview.interviewTime).isSame(date, "day")
    );
    dispatch(setSelectedDateInterviews(dayInterviews));
  };

  const refreshSelectedDateInterviews = (
    updatedInterviews: typeof interviews
  ) => {
    if (selectedDate) {
      const filtered = updatedInterviews.filter((interview) =>
        moment(interview.interviewTime).isSame(selectedDate, "day")
      );
      dispatch(setSelectedDateInterviews(filtered));
    }
  };

  const handleUpdate = async (
    interviewId: string,
    status: "COMPLETED" | "CANCELLED",
    successMessage: string
  ) => {
    try {
      const confirm = await MySwal.fire({
        title: `Confirm ${status === "COMPLETED" ? "Accept" : "Refuse"}`,
        text: `Are you sure you want to ${
          status === "COMPLETED" ? "accept" : "refuse"
        } this interview?`,
        icon: status === "COMPLETED" ? "question" : "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${
          status === "COMPLETED" ? "accept" : "refuse"
        }`,
        confirmButtonColor: status === "CANCELLED" ? "#d33" : undefined,
      });

      if (confirm.isConfirmed) {
        await dispatch(
          updateInterviewStatusThunk({ interviewId, status })
        ).unwrap();
        await MySwal.fire("Success", successMessage, "success");

        const fetchResult = await dispatch(
          fetchInterviews({ page: 1, pageSize: 10 })
        ).unwrap();
        refreshSelectedDateInterviews(fetchResult.data.data);
      }
    } catch (err: any) {
      await MySwal.fire("Error", err.message || "Operation failed", "error");
    }
  };

  return (
    <>
      <div className="clearfix" />
      <section
        className="inner-header-title"
        style={{ backgroundImage: "url(/assets/img/banner-10.jpg)" }}
      >
        <div className="container">
          <h1>Schedule Interview List</h1>
        </div>
      </section>
      <div className="clearfix" />

      <section className="browse-company">
        <div className="calendar-wrapper grid-layout">
          <div className="calendar-section card-box">
            <Calendar
              bordered
              value={selectedDate || new Date()}
              onSelect={handleSelect}
              renderCell={renderCell}
              isoWeek
              className="custom-calendar"
            />
          </div>
          <div className="meeting-section card-box">
            <h3>Meetings</h3>
            {selectedDate && (
              <div>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {interviews.length === 0 && !loading && (
                  <p>No interviews scheduled.</p>
                )}
                {selectedDateInterviews.length > 0 ? (
                  selectedDateInterviews.map((interview) => (
                    <div key={interview.interviewId} className="interview-item">
                      <h4 style={{ fontSize: "1.5rem", lineHeight: "1.5" }}>
                        {interview.jobTitle}
                      </h4>
                      <p style={{ fontSize: "1.3rem", lineHeight: "1.5" }}>
                        {moment(interview.interviewTime).format(
                          "MMMM D, YYYY, h:mm A"
                        )}
                      </p>
                      <p style={{ fontSize: "1.3rem", lineHeight: "1.5" }}>
                        Company: {interview.companyName}
                      </p>
                      <p style={{ fontSize: "1.3rem", lineHeight: "1.5" }}>
                        Location: {interview.location}
                      </p>
                      {interview.status === "scheduled" ? (
                        <div className="interview-actions">
                          <Button
                            appearance="primary"
                            size="sm"
                            onClick={() =>
                              handleUpdate(
                                interview.interviewId,
                                "COMPLETED",
                                "Interview accepted successfully!"
                              )
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            appearance="default"
                            size="sm"
                            color="red"
                            onClick={() =>
                              handleUpdate(
                                interview.interviewId,
                                "CANCELLED",
                                "Interview refused successfully!"
                              )
                            }
                          >
                            Refuse
                          </Button>
                        </div>
                      ) : (
                        <p
                          style={{
                            color:
                              interview.status === "completed"
                                ? "green"
                                : "red",
                            fontWeight: "bold",
                            fontSize: "1.3rem",
                          }}
                        >
                          {interview.status === "completed"
                            ? "✅ You accepted this interview"
                            : "❌ You declined this interview"}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>
                    No interviews on{" "}
                    {moment(selectedDate).format("MMMM D, YYYY")}.
                  </p>
                )}
              </div>
            )}
            {!selectedDate && <p>Click a date to view interviews.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
