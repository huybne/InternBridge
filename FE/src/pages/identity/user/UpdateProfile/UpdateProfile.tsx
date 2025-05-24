import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../../app/store';
import { StudentVerifycationService } from '../../../../services/user/StudentVerifycation/StudentVerifycationService';
import Swal from 'sweetalert2';
import { StudentProfileService } from '../../../../services/user/StudentProfile/StudentProfileService';
import { StudentProfile as StudentProfileModel } from "../../../../services/user/StudentProfile/StudentProfile";
import { RequestStudents } from '../../../../services/user/StudentProfile/StudentProfileService';
import { StudentProfileDTOForUpdate, UpdateProfileService } from '../../../../services/user/UpdateProfile/UpdateProfileService';
export default function UpdateProfile() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState<StudentProfileModel | null>(null);
  const [request, setRequest] = useState<RequestStudents | null>(null);

  const [selectedImages, setSelectedImages] = useState<{ url: string }[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>('/assets/img/can-1.png');
  const [avatarUrlUpload, setAvatarUrlUpload] = useState<string | null>(null);
  const [fileAvatar, setfileAvatar] = useState<File>();
  const [fileStudentCard, setfileStudentCard] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>(''); // ISO format: yyyy-mm-dd
  const [address, setAddress] = useState<string>('');
  const [university, setUniversity] = useState<string>('');
  //const [avatarUrl, setAvatarUrl] = useState<string>(''); // hoặc default: '/assets/img/can-1.png'
  const [academicYearStart, setAcademicYearStart] = useState<string>(''); // yyyy-mm-dd
  const [academicYearEnd, setAcademicYearEnd] = useState<string>(''); // yyyy-mm-dd
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [studentCardUrl, setStudentCardUrl] = useState<string[]>([]);
  const [isCreate, setisCreate] = useState<boolean>(false);

  const [cardid, setcardid] = useState<string[]>([]);

  const { user } = useSelector((state: RootState) => state.auth);
  console.log("🧠 Component user:", user);

  function formatDateForInput(date: Date | string | null | undefined): string {
    if (!date) return '';

    const parsed = typeof date === 'string' ? new Date(date) : date;

    return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
  }

  function convertDDMMYYYYtoYYYYMMDD(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }


  //setAvatarUrl(user?.picture??'');
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const service = new StudentProfileService();
        const data = await service.getStudentProfile();
        console.log("newToken: " + localStorage.getItem('accessToken'));
        console.log(data);
        setcardid(data?.getStudentCardDTOS()?.map(card => card.getCardId()) || []);

        setFullName(data?.getFullName() || '');
        setDateOfBirth(data?.getDateOfBirth() || '');
        setUniversity(data?.getUniversity() || '');
        setMajor(data?.getMajor() || '');
        setAcademicYearStart(data?.getAcademicYearStart() || "");
        setAcademicYearEnd(data?.getAcademicYearEnd() || '');


        setAddress(data?.getAddress() || '');
        setPhoneNumber(data?.getPhoneNumber() || '');
        setAvatarUrl(data?.getAvatarUrl() || '/assets/img/can-1.png');

        console.log(avatarUrl);
        const cardDtos = data?.getStudentCardDTOS() || [];

        setStudentCardUrl(cardDtos.map(dto => dto.getStudentCardUrl()));
        setSelectedImages(cardDtos.map(dto => ({ url: dto.getStudentCardUrl() })));
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch student profile:", error);
      }
    };

    fetchProfile();
  }, []); // chỉ chạy khi load component

  const handleImageupload = async () => {
    const service = new StudentVerifycationService();
    if (fileAvatar) {
      const url = await service.uploadAvatar(fileAvatar);
      setAvatarUrlUpload(url);
      return url;
    } else {
      const check = service.updateAvatarUrl(avatarUrl);
      return "sang";
    }
  }

  const handleImageStudentcardupload = async () => {
    const service = new StudentVerifycationService();
    console.log(fileStudentCard.length);
    if (fileStudentCard && fileStudentCard.length > 0) {
      // ✅ Có file, gọi API
      const urls = await service.uploadStudentCard(fileStudentCard);
      return urls;
    } else {
      console.warn('⚠️ Không có file student card để upload');
      return null;
    }

  }

  const handleConfirm = () => {
    Swal.fire({
      text: "Are you sure you want to submit a request?",
      icon: 'question',
      confirmButtonColor: '#28a745', // xanh lá cây đậm
      cancelButtonColor: '#d33',      // đỏ
      confirmButtonText: 'Yes, send it!',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handSendRequest();
      }
    });
  };

  const handleConfirmDraft = () => {
    Swal.fire({
      text: "Are you sure you want to save draft profile?",
      icon: 'question',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handSaveDraft();
      }
    });
  };

  const handleError = (error: string) => {
    Swal.fire({
      text: error,
      icon: 'warning',
      confirmButtonColor: '#28a745', // xanh lá cây đậm
      cancelButtonColor: '#d33',      // đỏ
      confirmButtonText: 'ok!',
    }).then(async (result) => {
      if (result.isConfirmed) {
      }
    });
  };

  const handSaveDraft = async () => {
    try {
      const service = new UpdateProfileService();

      // 1. Upload avatar nếu có
      let finalAvatarUrl = avatarUrl;
      if (fileAvatar) {
        const uploaded = await handleImageupload();
        if (uploaded && typeof uploaded === 'string') {
          finalAvatarUrl = uploaded;
        }
      }



      // 3. Tạo payload update
      const payload: StudentProfileDTOForUpdate = new StudentProfileDTOForUpdate({
        fullName,
        major,
        dateOfBirth,
        address,
        university,
        academicYearStart,
        academicYearEnd: academicYearEnd || null,
        phoneNumber,
        studentCardUrlId: cardid,
      });

      // 4. Gửi API
      const success = await service.updateStudentProfile(payload);

      let uploadedStudentCardUrls: string[] = [];
      if (fileStudentCard.length > 0) {
        const uploaded = await handleImageStudentcardupload();
        if (uploaded && Array.isArray(uploaded)) {
          uploadedStudentCardUrls = uploaded;
        }
      }

      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Draft profile saved successfully!',
          confirmButtonColor: '#28a745'
        });
      } else {
        throw new Error("Update API failed");
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: 'An error occurred while saving the profile.',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handSendRequest = async () => {
    try {
      const service = new UpdateProfileService();
      const verifyService = new StudentVerifycationService();

      // 1. Upload avatar nếu có
      let finalAvatarUrl = avatarUrl;
      if (fileAvatar) {
        const uploaded = await handleImageupload();
        if (uploaded && typeof uploaded === 'string') {
          finalAvatarUrl = uploaded;
        }
      }

      // 2. Upload ảnh student card mới


      // 3. Tạo payload update
      const payload: StudentProfileDTOForUpdate = new StudentProfileDTOForUpdate({
        fullName,
        major,
        dateOfBirth,
        address,
        university,
        academicYearStart,
        academicYearEnd: academicYearEnd || null,
        phoneNumber,
        studentCardUrlId: cardid,
      });

      // 4. Gửi API update
      const success = await service.updateStudentProfile(payload);


      let uploadedStudentCardUrls: string[] = [];
      if (fileStudentCard.length > 0) {
        const uploaded = await handleImageStudentcardupload();
        if (uploaded && Array.isArray(uploaded)) {
          uploadedStudentCardUrls = uploaded;
        }
      }
      if (!success) throw new Error("Update API failed");

      // 5. Gửi request sau khi update thành công
      const sent = await verifyService.sendStudentRequest();

      if (sent) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated and request sent successfully!',
          confirmButtonColor: '#28a745'
        });
      } else {
        throw new Error("Send request failed");
      }
    } catch (error) {
      console.error('❌ Error during update & request:', error);
      Swal.fire({
        icon: 'error',
        title: 'Action failed',
        text: 'An error occurred while updating or sending the request.',
        confirmButtonColor: '#d33'
      });
    }
  };


  const handleImageRemove = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setcardid(prev => prev.filter((_, i) => i !== index));
    setfileStudentCard(prev => prev.filter((_, i) => i !== index));
  };


  const handleEditAvatar = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setfileAvatar(file);
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setAvatarUrl(newUrl);
    }
  };

  return (
    <div className="user-profile">
      <div className="clearfix"></div>

      <section className="inner-header-title" style={{ backgroundImage: "url(/assets/img/banner-10.jpg)" }}>
        <div className="container">
          <h1>Update Profile</h1>
        </div>
      </section>
      <div className="clearfix"></div>

      <div className="detail-desc section" style={{ textAlign: 'center' }}>
        <div style={{ width: '700px', textAlign: 'center', margin: 'auto' }}  >
          <div className="row">
            <div className="detail-pic js" style={{ width: '240px', height: '240px' }}>
              <div className="box">
                <img
                  style={{ width: '220px', height: '220px' }}
                  src={avatarUrl}
                  className="avatar-img"
                  alt="Avatar"
                />
                <a
                  href="#"
                  className="edit-avatar"
                  title="Edit"
                  onClick={handleEditAvatar}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fa fa-pencil"></i>
                </a>

                {/* Input file ẩn */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="row bottom-mrg">
            <form className="add-feild">
              <div className="col-md-6 col-sm-6">
                <div className="input-group">
                  <label style={{ textAlign: 'start' }}>Full Name <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" className="form-control" required placeholder="Full Name" value={fullName} onChange={(e) => { setFullName(e.target.value) }} />
                </div>
              </div>



              <div className="col-md-6 col-sm-6">
                <div className="input-group">
                  <label style={{ textAlign: 'start' }}>Date Of Birth <span style={{ color: 'red' }}>*</span></label>
                  <input type="date" className="form-control" required placeholder="Date Of Birth" value={dateOfBirth} onChange={(e) => { setDateOfBirth(e.target.value) }} />
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <div className="input-group">
                  <label style={{ textAlign: 'start' }}>University <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" className="form-control" required placeholder="University" value={university} onChange={(e) => { setUniversity(e.target.value) }} />
                </div>
              </div>

              <div className="col-md-6 col-sm-6">
                <div className="input-group">
                  <label style={{ textAlign: 'start' }}>Major <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" className="form-control" required placeholder="Major" value={major} onChange={(e) => { setMajor(e.target.value) }} />
                </div>
              </div>

              <div className="col-md-6 col-sm-6">
                <div className="input-group">
                  <label style={{ textAlign: 'start' }}>Start Time <span style={{ color: 'red' }}>*</span></label>
                  <input type="date" className="form-control" required placeholder="Start Time" value={academicYearStart} onChange={(e) => { setAcademicYearStart(e.target.value) }} />
                </div>
              </div>

              <div className="col-md-6 col-sm-6">
                <div className="input-group">
                  <label style={{ textAlign: 'start' }}>End Time</label>
                  <input type="date" className="form-control" placeholder="End Time" value={academicYearEnd} onChange={(e) => { setAcademicYearEnd(e.target.value) }} />
                </div>
              </div>

              <div className="col-md-12 col-sm-12">
                <div className="input-group">
                  <label style={{ textAlign: 'start' }}>Address <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" className="form-control" required placeholder="Address" value={address} onChange={(e) => { setAddress(e.target.value) }} />
                </div>
              </div>

              <div className="col-md-12 col-sm-12">
                <div className="input-group">
                  <label style={{ textAlign: 'start' }}>Phone number <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" className="form-control" required placeholder="Phone number" value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value) }} />
                </div>
              </div>
              <div className="col-md-12 col-sm-12">
                <label style={{ textAlign: 'start' }} >Image Stduent Card  <span style={{ color: 'red' }}>*</span></label>
                <div className="image-upload-container" style={{
                  display: 'flex',
                  flexDirection: 'row', // đảm bảo các items nằm ngang
                  alignItems: 'center',
                  gap: '10px', // khoảng cách giữa các ảnh
                  flexWrap: 'nowrap', // ngăn không cho wrap xuống dòng
                  overflowX: 'auto', // cho phép scroll ngang nếu nhiều ảnh
                  padding: '10px 0'
                }}>
                  {selectedImages.map((image, index) => (
                    <div key={index} className="image-preview" style={{
                      position: 'relative',
                      minWidth: '100px', // đảm bảo kích thước tối thiểu
                      height: '100px',
                      flexShrink: 0 // ngăn không cho ảnh co lại
                    }}>
                      <img
                        src={image.url}
                        alt={`Preview ${index}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                      <button
                        type="button" // ✅ Thêm dòng này để ngăn submit form
                        onClick={() => handleImageRemove(index)}
                        style={{
                          position: 'absolute',
                          top: '1px',
                          right: '1px',
                          border: 'none',
                          background: 'red',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {selectedImages.length < 5 && (
                    <label
                      className="upload-button"
                      style={{
                        minWidth: '100px',
                        height: '100px',
                        border: '2px dashed #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '30px',
                        flexShrink: 0,
                        borderRadius: '4px'
                      }}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            const newImages = Array.from(files).map(file => ({
                              url: URL.createObjectURL(file),
                              id: ""
                            }));
                            setSelectedImages(prev => [...prev, ...newImages].slice(0, 5)); // tối đa 5 ảnh
                            setfileStudentCard(prev => [...prev, ...files].slice(0, 5))
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      +
                    </label>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="row no-padd">
            <div className="detail pannel-footer">
              <div className="col-md-12 col-sm-12">
                <div className="detail-pannel-footer-btn pull-right">
                  <button className="footer-btn choose-cover" disabled={isCreate} onClick={handleConfirm}>Send Request</button>
                </div>
                <div className="detail-pannel-footer-btn pull-right">
                  <button style={{ backgroundColor: 'blue' }} disabled={isCreate} onClick={handleConfirmDraft} className="footer-btn choose-cover">Save Draft</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
