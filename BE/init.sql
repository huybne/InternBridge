-- ==============================
-- ✅ Identity Service Database
-- ==============================
CREATE DATABASE IF NOT EXISTS identity_service;
USE identity_service;

-- Table: roles
CREATE TABLE IF NOT EXISTS roles (
                                     role_id INT AUTO_INCREMENT PRIMARY KEY,
                                     role_name VARCHAR(50) UNIQUE NOT NULL,
                                     permissions TEXT,
                                     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: users (bỏ role_id trực tiếp)
CREATE TABLE IF NOT EXISTS users (
                                     user_id CHAR(36) PRIMARY KEY,
                                     email VARCHAR(255) UNIQUE NOT NULL,
                                     username VARCHAR(255),
                                     password TEXT NOT NULL,
                                     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                     status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
                                     is_deleted BOOLEAN DEFAULT FALSE,
                                     provider VARCHAR(255)
);

-- Table: user_roles (bảng trung gian)
CREATE TABLE IF NOT EXISTS user_roles (
                                          user_id CHAR(36),
                                          role_id INT,
                                          PRIMARY KEY (user_id, role_id),
                                          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                                          FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_tokens (
                                           token_id CHAR(36) PRIMARY KEY,
                                           user_id CHAR(36) NOT NULL,
                                           token TEXT NOT NULL,
                                           expires_at DATETIME NOT NULL,
                                           created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                           revoked BOOLEAN DEFAULT FALSE,
                                           FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_users_status_deleted ON users(status, is_deleted);
CREATE INDEX idx_auth_tokens_revoked_deleted ON auth_tokens(revoked);

-- ==============================
-- ✅ Profile Service Database (new clean version)
-- ==============================
CREATE DATABASE IF NOT EXISTS profile_service;
USE profile_service;

CREATE TABLE IF NOT EXISTS student_profiles (
                                                profile_id CHAR(36) PRIMARY KEY, -- profile_id chính là userId
                                                full_name VARCHAR(255),
                                                major VARCHAR(255),
                                                date_of_birth DATETIME,
                                                address VARCHAR(500),
                                                university VARCHAR(255),
                                                avatar_url TEXT,
                                                academic_year_start DATE,
                                                academic_year_end DATE,
                                                phone_number VARCHAR(20),
                                                is_approved BOOLEAN DEFAULT FALSE,
                                                status ENUM('active', 'inactive') DEFAULT 'active',
                                                is_deleted BOOLEAN DEFAULT FALSE,
                                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                FOREIGN KEY (profile_id) REFERENCES identity_service.users(user_id)
);

CREATE TABLE IF NOT EXISTS business_profiles (
                                                 profile_id CHAR(36) PRIMARY KEY, -- profile_id chính là userId
                                                 company_name VARCHAR(255),
                                                 industry VARCHAR(255),
                                                 company_info TEXT,
                                                 website_url TEXT,
                                                 tax_code VARCHAR(50),
                                                 email VARCHAR(255),
                                                 phone_number VARCHAR(20),
                                                 address VARCHAR(500),
                                                 is_approved BOOLEAN DEFAULT FALSE,
                                                 status ENUM('active', 'inactive') DEFAULT 'active',
                                                 is_deleted BOOLEAN DEFAULT FALSE,
                                                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                 FOREIGN KEY (profile_id) REFERENCES identity_service.users(user_id)
);

CREATE TABLE IF NOT EXISTS cvs (
                                   cv_id CHAR(36) PRIMARY KEY,
                                   student_id CHAR(36),
                                   title VARCHAR(255),
                                   cv_detail TEXT,
                                   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                   status ENUM('draft', 'published') DEFAULT 'draft',
                                   is_deleted BOOLEAN DEFAULT FALSE,
                                   FOREIGN KEY (student_id) REFERENCES student_profiles(profile_id)
);

CREATE TABLE IF NOT EXISTS student_cards (
                                             card_id CHAR(36) PRIMARY KEY,
                                             student_id CHAR(36),
                                             student_card_url TEXT,
                                             is_deleted BOOLEAN DEFAULT FALSE,
                                             FOREIGN KEY (student_id) REFERENCES student_profiles(profile_id)
);

CREATE TABLE IF NOT EXISTS student_favorite_jobs (
                                                     id CHAR(36) PRIMARY KEY,
                                                     student_id CHAR(36),
                                                     job_id CHAR(36),
                                                     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                     is_deleted BOOLEAN DEFAULT FALSE,
                                                     FOREIGN KEY (student_id) REFERENCES student_profiles(profile_id)
);

CREATE TABLE IF NOT EXISTS images_business (
                                               image_id CHAR(36) PRIMARY KEY,
                                               business_id CHAR(36),
                                               image_url TEXT,
                                               is_deleted BOOLEAN DEFAULT FALSE,
                                               FOREIGN KEY (business_id) REFERENCES business_profiles(profile_id)
);

CREATE TABLE IF NOT EXISTS request_students (
                                                request_id CHAR(36) PRIMARY KEY,
                                                student_id CHAR(36),
                                                reason TEXT,
                                                send_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                status ENUM('pending', 'approve', 'reject') DEFAULT 'pending',
                                                is_deleted BOOLEAN DEFAULT FALSE,
                                                FOREIGN KEY (student_id) REFERENCES student_profiles(profile_id)
);

CREATE TABLE IF NOT EXISTS request_businesses (
                                                  request_id CHAR(36) PRIMARY KEY,
                                                  business_id CHAR(36),
                                                  reason TEXT,
                                                  send_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                  status ENUM('pending', 'approve', 'reject') DEFAULT 'pending',
                                                  is_deleted BOOLEAN DEFAULT FALSE,
                                                  FOREIGN KEY (business_id) REFERENCES business_profiles(profile_id)
);

-- Các index để tối ưu tìm kiếm
CREATE INDEX idx_student_profiles_status_deleted ON student_profiles(status, is_deleted);
CREATE INDEX idx_business_profiles_status_deleted ON business_profiles(status, is_deleted);
CREATE INDEX idx_cvs_status_deleted ON cvs(status, is_deleted);
CREATE INDEX idx_request_students_status_deleted ON request_students(status, is_deleted);
CREATE INDEX idx_request_businesses_status_deleted ON request_businesses(status, is_deleted);

-- Các View tiện lấy dữ liệu
CREATE VIEW active_student_profiles AS SELECT * FROM student_profiles WHERE is_deleted = FALSE;
CREATE VIEW active_business_profiles AS SELECT * FROM business_profiles WHERE is_deleted = FALSE;
CREATE VIEW active_cvs AS SELECT * FROM cvs WHERE is_deleted = FALSE;

-- ==============================
-- ✅ Recruitment Service Database
-- ==============================
CREATE DATABASE IF NOT EXISTS recruitment_service;
USE recruitment_service;

CREATE TABLE IF NOT EXISTS job_postings (
                                            job_id CHAR(36) PRIMARY KEY,
                                            business_id CHAR(36),
                                            title TEXT,
                                            description TEXT,
                                            location TEXT,
                                            number_employees INT,
                                            company_name VARCHAR(255) NOT NULL,
                                            avatar_url TEXT,
                                            status INT DEFAULT NULL,
                                            isUrgentRecruitment BIT(1) DEFAULT NULL COMMENT 'Việc có phải tuyển gấp không',
                                            expirationDate DATETIME DEFAULT NULL COMMENT 'Hạn nộp CV',
                                            reasonReject TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lý do admin không duyệt',

                                            is_deleted BOOLEAN DEFAULT FALSE,
                                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS apply_jobs (
                                            apply_id CHAR(36) PRIMARY KEY,
                                            job_id CHAR(36),
                                            student_id CHAR(36),
                                            cv_id CHAR(36),
                                            student_name VARCHAR(255) NOT NULL, -- Tên sinh viên
                                            student_date_of_birth DATETIME, -- Ngày sinh sinh viên
                                            student_university VARCHAR(255), -- Trường học của sinh viên
                                            student_avatar_url TEXT, -- Avatar của sinh viên
                                            status ENUM('pending', 'viewed', 'accepted', 'rejected') DEFAULT 'pending',
                                            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                            viewed_at DATETIME,
                                            is_deleted BOOLEAN DEFAULT FALSE,
                                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                            FOREIGN KEY (job_id) REFERENCES job_postings(job_id)
);

CREATE TABLE IF NOT EXISTS interviews (
                                          interview_id CHAR(36) PRIMARY KEY,
                                          apply_id CHAR(36),
                                          scheduled_at DATETIME,
                                          status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
                                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                          is_deleted BOOLEAN DEFAULT FALSE,
                                          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          FOREIGN KEY (apply_id) REFERENCES apply_jobs(apply_id)
);

CREATE TABLE IF NOT EXISTS categories (
                                          category_id INT AUTO_INCREMENT PRIMARY KEY,
                                          name VARCHAR(255),
                                          description TEXT,
                                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS job_categories (
                                              job_category_id INT AUTO_INCREMENT PRIMARY KEY,
                                              job_id CHAR(36),
                                              category_id INT,
                                              is_deleted BOOLEAN DEFAULT FALSE,
                                              FOREIGN KEY (job_id) REFERENCES job_postings(job_id),
                                              FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE INDEX idx_job_postings_status_deleted ON job_postings(status, is_deleted);
CREATE INDEX idx_apply_jobs_status_deleted ON apply_jobs(status, is_deleted);
CREATE INDEX idx_interviews_status_deleted ON interviews(status, is_deleted);

CREATE VIEW active_job_postings AS SELECT * FROM job_postings WHERE is_deleted = FALSE;
CREATE VIEW active_apply_jobs AS SELECT * FROM apply_jobs WHERE is_deleted = FALSE;
CREATE VIEW active_interviews AS SELECT * FROM interviews WHERE is_deleted = FALSE;
