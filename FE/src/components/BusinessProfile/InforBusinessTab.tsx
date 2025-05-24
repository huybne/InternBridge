import { useEffect, useState } from 'react';
import { getMyBusiness } from '../../service/business/MyBusinessService';
import {
  deleteBusinessImage,
  getBusinessImages,
} from '../../service/business/imageBusinessService';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import '../../pages/identity/user/business/BusinessProfile.css';
import Loading from '../../common/Loading';
import { Navigate, useNavigate } from 'react-router-dom';

const InformationTab = ({ }) => {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [businessImages, setBusinessImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getMyBusiness();
        setBusinessInfo(response.data);
        console.log(response.data);
      } catch (err: any) {
        if (err.message?.includes('not found')) {
          setBusinessInfo(null); // chưa có business
        } else {
          setError(err.message || 'Error fetching business info');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const images = await getBusinessImages();
        setBusinessImages(images);
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    };

    fetchBusiness();
    fetchImages();
  }, []);

  const handleDeleteImage = async (imageId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this image?',
      text: 'The image will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      width: '500px',
      customClass: {
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel',
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteBusinessImage(imageId);
        Swal.fire({
          icon: 'success',
          title: 'Delete image successfully',
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          navigate('/profile');
        }, 1500);

        const updatedImages = await getBusinessImages();
        setBusinessImages(updatedImages);
      } catch (error) {
        toast.error('Failed to delete photo');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="tab-pane active">
      <h3>Business Information</h3>
      <div className="business-info-container">
        <div className="business-details">
          <h4>Company Information</h4>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <strong>Company Name</strong>
                </td>
                <td>{businessInfo?.companyName || '-'}</td>
              </tr>
              <tr>
                <td>
                  <strong>Industry</strong>
                </td>
                <td>{businessInfo?.industry || '-'}</td>
              </tr>
              <tr>
                <td>
                  <strong>Company Info</strong>
                </td>
                <td>{businessInfo?.companyInfo || '-'}</td>
              </tr>
              <tr>
                <td>
                  <strong>Website URL</strong>
                </td>
                <td>{businessInfo?.websiteUrl || '-'}</td>
              </tr>
              <tr>
                <td>
                  <strong>Tax Code</strong>
                </td>
                <td>{businessInfo?.taxCode || '-'}</td>
              </tr>
              <tr>
                <td>
                  <strong>Email</strong>
                </td>
                <td>{businessInfo?.email || '-'}</td>
              </tr>
              <tr>
                <td>
                  <strong>Phone Number</strong>
                </td>
                <td>{businessInfo?.phoneNumber || '-'}</td>
              </tr>
              <tr>
                <td>
                  <strong>Address</strong>
                </td>
                <td>{businessInfo?.address || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-12 col-sm-12" style={{ paddingLeft: '0px' }}>
          <label style={{ textAlign: 'start', fontSize: '20px', fontWeight: 'bold' }}  >Company Avatar :</label>
          <img style={{
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '0px',
            margin: '0px',
            maxWidth: `100%`
          }} src={businessInfo?.image_Avatar_url} />
        </div>
        {businessImages.length > 0 ? (
          <div className="col-md-12 col-sm-12" style={{ paddingLeft: '0px' }}>
            <label style={{ textAlign: 'start', fontSize: '20px', fontWeight: 'bold' }}  >Company Image :</label>
            <div className="image-upload-container" style={{
              display: 'flex',
              flexDirection: 'row', // đảm bảo các items nằm ngang
              alignItems: 'center',
              gap: '10px', // khoảng cách giữa các ảnh
              flexWrap: 'nowrap', // ngăn không cho wrap xuống dòng
              overflowX: 'auto', // cho phép scroll ngang nếu nhiều ảnh
              padding: '10px 0'
            }}>
              {businessImages.map((image, index) => (
                <div key={index} className="image-preview" style={{
                  position: 'relative',
                  minWidth: '100px', // đảm bảo kích thước tối thiểu
                  height: '100px',
                  flexShrink: 0 // ngăn không cho ảnh co lại
                }}>
                  <img
                    src={image.imageUrl}
                    alt={`Preview ${index}`}
                    onClick={() => setSelectedImage(image.imageUrl)}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '0px',
                      margin: '0px',
                      maxWidth: `100%`
                    }}
                  />
                </div>
              ))}

            </div>
          </div>
        ) : (
          <p>No images available.</p>
        )}

        {selectedImage && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <img
              src={selectedImage}
              alt="Full View"
              style={{
                maxHeight: '90%',
                maxWidth: '90%',
                objectFit: 'contain',
                borderRadius: '0px',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InformationTab;
