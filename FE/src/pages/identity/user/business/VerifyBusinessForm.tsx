import { useEffect, useState } from 'react';
import { sendRequest, verifyBusiness } from '../../../../service/business/verifyBusinessService';
import { getMyBusiness } from '../../../../service/business/MyBusinessService';
import { uploadAvatar, uploadBusinessImages } from '../../../../service/business/uploadImageBusinessService';
import { useNavigate } from 'react-router-dom';
//import './VerifyBusinessForm.css';
import Loading from '../../../../common/Loading';
import Swal from 'sweetalert2';
import ImagePreview from './ImagePreview';

interface BusinessData {
  companyName: string;
  industry: string;
  companyInfo: string;
  websiteUrl: string;
  taxCode: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export default function VerifyBusinessForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<{ url: string }[]>([]);


  const [avatar, setavatar] = useState<File | null>();
  const [avatar_url, setavatarurl] = useState<{ url: string }>();
  const [formData, setFormData] = useState<BusinessData>({
    companyName: '',
    industry: '',
    companyInfo: '',
    websiteUrl: '',
    taxCode: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessData, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // clear error on change
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleImageRemove = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
    console.log(images.length);
  };

  const handleImageRemoveAvatar = () => {
    setavatar(null);
  }

  useEffect(() => {
    const checkBusinessVerified = async () => {
      try {
        const getInfoBusiness = await getMyBusiness();
        console.log(getInfoBusiness);
        console.log(getInfoBusiness.data.status === "inactive");
        if (getInfoBusiness.data.status === 'inactive') {
          navigate('/401');
          return;
        }

        if (getInfoBusiness&& getInfoBusiness.data.status === 'active') {
          navigate('/businessprofile', { replace: true });
        } else {
          setLoading(false); // đã có business
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra business:', error);
        setLoading(false);
      }
    };

    checkBusinessVerified();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    for (const key in formData) {
      if (!formData[key as keyof BusinessData]) {
        newErrors[key as keyof BusinessData] = 'Không được để trống trường này';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    const confirmResult = await Swal.fire({
      title: 'Are you sure you want to submit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });

    if (!confirmResult.isConfirmed) {
      // Người dùng bấm hủy hoặc đóng popup
      return;
    }

    try {
      // const result = await verifyBusiness(formData);
      // 1. Gửi dữ liệu doanh nghiệp
      const result = await verifyBusiness(formData);
      const check = await sendRequest();
      if (avatar) {
        await uploadAvatar(avatar);
      }

      // 2. Nếu có ảnh thì upload ảnh
      if (images.length > 0) {
        console.log(images[0] instanceof File);
        await uploadBusinessImages(images);
      }

      console.log(result);
      console.log(check);

      setTimeout(() => {
        Swal.fire({
          title: 'Xác thực doanh nghiệp thành công!',
          icon: 'success',
          showConfirmButton: true,  // Hiển thị nút xác nhận
          confirmButtonText: 'OK',  // Text trên nút xác nhận
        }).then((result) => {
          // Kiểm tra xem người dùng đã nhấn "OK"
          if (result.isConfirmed) {
            // Nếu nhấn OK, chuyển hướng đến trang profile
            navigate('/businessprofile');
          }
        });
      }, 3000);

    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <Loading />;

  return (

    <div className="user-profile">
      <div className="clearfix"></div>

      <section className="inner-header-title" style={{ backgroundImage: "url(/assets/img/banner-10.jpg)" }}>
        <div className="container">
          <h1>Business Verifycation</h1>
        </div>
      </section>
      <div className="clearfix"></div>


      <div className="verify-business-container" style={{ width: '700px', margin: 'auto', marginTop: "50px", marginBottom: "50px" }} >
        <form className="verify-form" onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key}</label>
              {key === 'companyInfo' || key === 'address' ? (
                <textarea
                  name={key}
                  id={key}
                  value={value}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  id={key}
                  value={value}
                  onChange={handleChange}
                />
              )}
              {errors[key as keyof BusinessData] && (
                <span className="error-text">
                  {errors[key as keyof BusinessData]}
                </span>
              )}
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="images">Image avatar</label>
            <div className="image-upload-container" style={{
              display: 'flex',
              flexDirection: 'row', // đảm bảo các items nằm ngang
              alignItems: 'center',
              gap: '10px', // khoảng cách giữa các ảnh
              flexWrap: 'nowrap', // ngăn không cho wrap xuống dòng
              overflowX: 'auto', // cho phép scroll ngang nếu nhiều ảnh
              padding: '10px 0'
            }}>
              {avatar ? (<div className="image-preview" style={{
                position: 'relative',
                minWidth: '100px', // đảm bảo kích thước tối thiểu
                height: '100px',
                flexShrink: 0 // ngăn không cho ảnh co lại
              }}>
                <img
                  src={avatar_url?.url}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <button
                  onClick={() => handleImageRemoveAvatar()}
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
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
              </div>) : ("")}


              {!avatar && (
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
                        // const newImages = Array.from(files).map(file => ({
                        //   url: URL.createObjectURL(file)
                        // }));
                        const newImages = URL.createObjectURL(files[0])
                        // setSelectedImages(prev => [...prev, ...newImages].slice(0, 5)); // tối đa 5 ảnh
                        setavatarurl({ url: newImages });

                        if (files && files.length > 0) {
                          setavatar(files[0]); // setFile kiểu File | null | undefined
                        } else {
                          setavatar(null);
                        }
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  +
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="images">Image business</label>
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
                    onClick={() => handleImageRemove(index)}
                    style={{
                      position: 'absolute',
                      top: '0px',
                      right: '0px',
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
                          url: URL.createObjectURL(file)
                        }));
                        setSelectedImages(prev => [...prev, ...newImages].slice(0, 5)); // tối đa 5 ảnh
                        setImages(prev => [...prev, ...files].slice(0, 5))
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  +
                </label>
              )}
            </div>
          </div>
          <div className="detail-pannel-footer-btn pull-right">
            <button style={{ backgroundColor: 'green', color: 'white' }} type="submit" className="footer-btn choose-cover">

              Send request to verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
