import React, { useState, useEffect } from 'react';
import './InterviewCalendar.css';
import { getInterviewScheduleListByBusinessId } from '../../../service/business/interviews/InterviewService';
import { useNavigate } from 'react-router-dom';

// Define types
interface InterviewEvent {
  interviewId: string;
  jobTitle: string;
  locationCompany: string;
  date: string;
  scheduledAt: string;
  attendees: Attendee[];
  applyStatus: string;
  jobId: string;
  applyId: string;
}

interface Attendee {
  studentId: string;
  studentName: string;
  studentAvatarUrl: string;
}

interface CalendarDay {
  date: number;
  month: 'current' | 'prev' | 'next';
  events: InterviewEvent[];
  hasEvents: boolean;
}

// Format date to 'yyyy-mm-dd'
const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format date to display format (e.g., "Thursday October 23rd, 2014")
const formatDisplayDate = (date: Date): string => {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let daySuffix = 'th';
  if (day === 1 || day === 21 || day === 31) daySuffix = 'st';
  else if (day === 2 || day === 22) daySuffix = 'nd';
  else if (day === 3 || day === 23) daySuffix = 'rd';

  return `${dayOfWeek} ${month} ${day}${daySuffix}, ${year}`;
};

// Format time from ISO string to display format (e.g., "10:28am")
const formatTimeFromISO = (isoString: string): string => {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${hours}:${minutes.toString().padStart(2, '0')}${ampm}`;
};

const InterviewCalendar: React.FC = () => {
  // Use current date as default
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [interviewEvents, setInterviewEvents] = useState<
    Record<string, InterviewEvent[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch interview schedule data
  useEffect(() => {
    const fetchInterviewSchedules = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await getInterviewScheduleListByBusinessId();
        const data = response.data;

        if (data.code === 1000) {
          // Transform API data to our format
          const transformedData: Record<string, InterviewEvent[]> = {};

          data.data.forEach((schedule) => {
            const scheduledDate = new Date(schedule.scheduledAt);
            const dateKey = formatDateString(scheduledDate);

            const event: InterviewEvent = {
              interviewId: schedule.interviewId,
              jobTitle: schedule.jobTitle,
              locationCompany: schedule.locationCompany,
              date: formatDisplayDate(scheduledDate),
              scheduledAt: schedule.scheduledAt,
              attendees: [
                {
                  studentId: schedule.studentId,
                  studentName: schedule.studentName,
                  studentAvatarUrl: schedule.studentAvatarUrl,
                },
              ],
              applyStatus: schedule.applyStatus,
              jobId: schedule.jobId,
              applyId: schedule.applyId,
            };

            if (!transformedData[dateKey]) {
              transformedData[dateKey] = [];
            }

            transformedData[dateKey].push(event);
          });

          setInterviewEvents(transformedData);
        } else {
          setError('Failed to fetch interview data');
        }
      } catch (err) {
        setError('Error fetching interview schedules');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewSchedules();
  }, []);

  // Generate calendar days based on interview events
  const generateCalendarDays = (year: number, month: number): CalendarDay[] => {
    // Create date for the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startingDayOfWeek = firstDay.getDay();
    // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
    const startDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Get days from previous month to display
    const lastMonthLastDay = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // Add days from previous month
    for (let i = 0; i < startDay; i++) {
      const prevMonthDay = lastMonthLastDay - startDay + i + 1;
      const date = new Date(year, month - 1, prevMonthDay);
      const dateStr = formatDateString(date);

      days.push({
        date: prevMonthDay,
        month: 'prev',
        events: interviewEvents[dateStr] || [],
        hasEvents: !!interviewEvents[dateStr],
      });
    }

    // Add days of current month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDateString(date);

      days.push({
        date: i,
        month: 'current',
        events: interviewEvents[dateStr] || [],
        hasEvents: !!interviewEvents[dateStr],
      });
    }

    // Calculate how many days from next month are needed to complete the grid
    const remainingSlots = 42 - days.length; // 6 rows * 7 days = 42 total slots

    // Add days from next month
    for (let i = 1; i <= remainingSlots; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = formatDateString(date);

      days.push({
        date: i,
        month: 'next',
        events: interviewEvents[dateStr] || [],
        hasEvents: !!interviewEvents[dateStr],
      });
    }

    return days;
  };

  // Generate calendar days for the current month
  const calendarDays = generateCalendarDays(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  // Days of the week header
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Current month name and year
  const monthYearString = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // Get events for selected date
  const selectedDateEvents = selectedDate
    ? interviewEvents[formatDateString(selectedDate)] || []
    : [];

  // Handle month navigation
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Handle date selection
  const handleDateClick = (day: CalendarDay) => {
    let newDate: Date;

    if (day.month === 'prev') {
      newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        day.date,
      );
    } else if (day.month === 'next') {
      newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        day.date,
      );
    } else {
      newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day.date,
      );
    }

    setSelectedDate(newDate);

    // Only show popup if there are events for this date
    if (day.hasEvents) {
      setShowPopup(true);
    }
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Calculate time range from scheduledAt
  const getTimeRange = (scheduledAt: string): string => {
    const startTime = formatTimeFromISO(scheduledAt);

    // Assume interview lasts 1 hour
    const endDate = new Date(scheduledAt);
    endDate.setHours(endDate.getHours() + 1);
    const endTime = formatTimeFromISO(endDate.toISOString());

    return `${startTime}`;
  };

  if (loading) {
    return <div className="loading">Loading interview schedules...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="">
      <div className="clearfix" />
      {/* Title Header Start */}
      <section
        className="inner-header-title"
        style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
      >
        <div className="container">
          <h1>Interview Calendar</h1>
        </div>
      </section>
      <div className="clearfix" />

      <div className="container-calendar">
        <div className="calendar-navigation">
          <button className="nav-button" onClick={prevMonth}>
            &lt; {/* Simple text arrow instead of Font Awesome */}
          </button>
          <h2 className="current-month">{monthYearString}</h2>
          <button className="nav-button" onClick={nextMonth}>
            &gt; {/* Simple text arrow instead of Font Awesome */}
          </button>
        </div>

        <div className="calendar-wrapper">
          <div className="weekdays-header">
            {weekDays.map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => (
              <div
                key={`${day.month}-${day.date}-${index}`}
                className={`calendar-day ${
                  day.month !== 'current' ? 'other-month' : ''
                } ${day.hasEvents ? 'has-events' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <span className="day-number">{day.date}</span>
                {day.hasEvents && (
                  <span className="event-indicator">{day.events.length}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup for interview details */}
      {showPopup && selectedDate && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: '0',
                  padding: '0.8rem 0',
                  color: '#333',
                  borderRadius: '8px',
                }}
              >
                {formatDisplayDate(selectedDate)}
              </p>
              <button className="close-button" onClick={closePopup}>
                ×
              </button>
            </div>

            <div className="events-container">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div key={event.interviewId} className="event-card">
                    <div className="event-content">
                      <div className="event-header">
                        <div className="event-title">
                          <p>
                            Interview for{' '}
                            <span className="position-title">
                              {event.jobTitle}
                            </span>
                          </p>

                          {event.locationCompany && (
                            <div className="event-location">
                              <span>📍</span>{' '}
                              {/* Unicode map pin instead of Font Awesome */}
                              <span>{event.locationCompany}</span>
                            </div>
                          )}

                          <div className="event-time">
                            <span>🕒</span>{' '}
                            {/* Unicode clock instead of Font Awesome */}
                            <span>{getTimeRange(event.scheduledAt)}</span>
                          </div>
                        </div>
                      </div>

                      {event.attendees.length > 0 && (
                        <>
                          <div className="attendees-section">
                            <p className="with-label">with...</p>
                            <div className="attendee-avatars">
                              {event.attendees.map((attendee) => (
                                <div
                                  key={attendee.studentId}
                                  className="avatar"
                                  title={attendee.studentName}
                                >
                                  <img
                                    src={
                                      attendee.studentAvatarUrl ||
                                      '/api/placeholder/30/30'
                                    }
                                    alt={attendee.studentName}
                                    onError={(e) => {
                                      // Fallback if the image fails to load
                                      e.currentTarget.src =
                                        '/api/placeholder/30/30';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="action-buttons">
                            <div className="button-group">
                              <button
                                className="accept-button"
                                onClick={() =>
                                  navigate(
                                    `/business/detail-apply-job/${event.applyId}`,
                                  )
                                }
                              >
                                Detail Apply Job
                              </button>
                              <button
                                className="refuse-button"
                                onClick={() =>
                                  navigate(`/detail-job/${event.jobId}`)
                                }
                              >
                                Detail Job
                              </button>
                            </div>
                            <p
                              className={`status-label ${event.applyStatus}`}
                              style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                              }}
                            >
                              Status: {event.applyStatus}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-events">
                  <p>No interviews scheduled for this day.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCalendar;
