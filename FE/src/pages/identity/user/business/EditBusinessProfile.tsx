import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../app/store';
import { BusinessProfilesForUpdate, updateBusiness } from '../../../../service/business/MyBusinessService';
import './EditBusinessProfile.css';
import Swal from 'sweetalert2';
import { getBusinessImages, uploadImagesBusiness2 } from '../../../../service/business/imageBusinessService';
import { uploadAvatar } from '../../../../service/business/uploadImageBusinessService';
import { sendRequest } from '../../../../service/business/verifyBusinessService';

interface BusinessProfile {
  companyName: string;
  industry: string;
  companyInfo: string;
  websiteUrl: string;
  taxCode: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const EditBusinessProfile: React.FC = () => {
  const business = useSelector((state: RootState) => state.business.data);
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<{ url: string }[]>([]);
  const [formData, setFormData] = useState<BusinessProfilesForUpdate>(business);
  const [images, setImages] = useState<File[]>([]);
  const [cardid, setcardid] = useState<string[]>([]);


  const [avatar, setavatar] = useState<File | null>();
  const [avatar_url, setavatarurl] = useState<{ url: string }>();

  useEffect(() => {
    const fecthImage = async () => {
      const img = await getBusinessImages();
      console.log(img);
      const imageUrls = img.map((item: any) => ({
        url: item.imageUrl
      }));

      const imgid = img.map((item: any) => ({
        url: item.imageId
      }));

      setSelectedImages(imageUrls);
      setcardid(imgid);
      setavatarurl({ url: business.image_Avatar_url });
    }

    fecthImage();

    console.log(business);
    console.log(formData);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleImageRemove = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setcardid(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const result = await Swal.fire({
      title: 'Are you sure you want to save?',
      text: 'Data will be updated.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      width: '500px',
      customClass: {
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel',
      },
    });

    if (result.isConfirmed) {
      try {
        const imagesOldImg = Array.isArray(cardid) ? cardid : [cardid];


        // Create the updated form data object
        const updatedFormData = {
          ...formData,
          imagesOldImg,    // Add old images to the data
        };

        const filteredPayload = {
          companyName: updatedFormData.companyName,
          industry: updatedFormData.industry,
          companyInfo: updatedFormData.companyInfo,
          websiteUrl: updatedFormData.websiteUrl,
          taxCode: updatedFormData.taxCode,
          email: updatedFormData.email,
          phoneNumber: updatedFormData.phoneNumber,
          address: updatedFormData.address,
          imagesOldImg: updatedFormData.imagesOldImg.map((img: any) => img.url),
        };

        await updateBusiness(filteredPayload);
        if (images.length > 0) {
          await uploadImagesBusiness2(images); // Upload images if needed
        }

        await sendRequest();

        if (avatar) {
          await uploadAvatar(avatar);
        }


        await Swal.fire({
          title: 'Success!',
          text: 'Updated successfully.',
          icon: 'success',
          width: '500px',
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          navigate('/businessprofile');
        }, 1500);
      } catch (err: any) {
        console.error(err);
        await Swal.fire({
          title: 'Failed!',
          text: 'An error occurred while updating.',
          icon: 'error',
          width: '500px',
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          navigate('/businessprofile');
        }, 1500);
      }
    }
  };


  const handleCancel = async () => {
    const result = await Swal.fire({
      title: 'Are you sure you want to cancel?',
      text: 'The changes will not be saved.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cancel',
      cancelButtonText: 'Go back',
      width: '500px',
      customClass: {
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel',
      },
    });

    if (result.isConfirmed) {
      navigate('/profile');
    }
  };

  const handleImageRemoveAvatar = () => {
    console.log("sang");
    setavatar(null);
    setavatarurl({ url: "" });
  }

  return (
    <div className="user-profile"
    >

      <div className="clearfix"></div>

      <section className="inner-header-title" style={{ backgroundImage: "url(/assets/img/banner-10.jpg)" }}>
        <div className="container">
          <h1>Update business information</h1>
        </div>
      </section>
      <div className="clearfix"></div>

      {/* --- Các form input giữ nguyên --- */}
      <div className="edit-container"
        style={{ marginBottom: '100px', marginTop: '50px' }}>

        <div className="form-group">
          <label>Image avatar</label>
          <div className="image-upload-container" style={{
            display: 'flex',
            flexDirection: 'row', // đảm bảo các items nằm ngang
            alignItems: 'center',
            gap: '10px', // khoảng cách giữa các ảnh
            flexWrap: 'nowrap', // ngăn không cho wrap xuống dòng
            overflowX: 'auto', // cho phép scroll ngang nếu nhiều ảnh
            padding: '10px 0'
          }}>

            {avatar || avatar_url?.url !== "" ? (<div className="image-preview" style={{
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

            {!avatar && avatar_url?.url === "" ? (<label
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
            </label>) : ("")}

          </div>
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Industry</label>
          <input
            name="industry"
            value={formData.industry}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Company Info</label>
          <textarea
            name="companyInfo"
            value={formData.companyInfo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Website URL</label>
          <input
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Tax Code</label>
          <input
            name="taxCode"
            value={formData.taxCode}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Image Business</label>
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

        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBusinessProfile;
