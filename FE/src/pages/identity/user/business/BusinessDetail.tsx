import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { BusinessProfilesDTO } from '../../../../services/admin/ListBussinessAccountService';
import { BusinessDetailService, JobPostingsResponseDTO } from '../../../../service/business/BusinessDetailService';
import { responsiveFontSizes } from '@mui/material';
import Error404 from '../../../Error404';
import { getBusinessImages } from '../../../../service/business/imageBusinessService';

export default function BusinessDetail() {
    const { id } = useParams();
    const [selectedBusiness, setselectedBusiness] = useState<BusinessProfilesDTO | null>(null);
    const navigate = useNavigate();
    const [pageIndex, setpageIndex] = useState<number>(1);
    const [pageSize, setpageSize] = useState<number>(10);
    const [ListJob, setListJob] = useState<JobPostingsResponseDTO[] | null>(null);
    const [businessImages, setBusinessImages] = useState<string[]>([]);
    const [totalPage, settotalPage] = useState<number>(0);
    const [selectedImage, setSelectedImage] = useState<string | null>();
    console.log(id);
    useEffect(() => {
        const getdetails = async () => {
            const service = new BusinessDetailService();
            const response = await service.GetBusinessDetail(id);
            console.log(response?.imageBusiness);
            setBusinessImages(response?.imageBusiness ?? []);
            setselectedBusiness(response);
            console.log(response);
        }

        getdetails();

        const getListJob = async () => {
            const service = new BusinessDetailService();
            const response = await service.GetListJob(id, pageIndex, pageSize);
            setListJob(response?.data ?? []);
            settotalPage(response?.totalPages ?? 0);
            setpageIndex(response?.currentPage ?? 1);
            console.log(response);
        }
        getListJob();

        const fetchImages = async () => {
            try {
                const images = await getBusinessImages();
                setBusinessImages(images);
            } catch (err) {
                console.error('Error fetching images:', err);
            }
        };
        fetchImages();

    }, [])

    if (selectedBusiness === null) {
        return (
            <div>
                <Error404 />
            </div>
        );
    }

    async function handleSearchpaging(arg0: number) {
        if (arg0 < 1) {
            return;
        }
        setpageIndex(arg0);
        const service = new BusinessDetailService();
        const response = await service.GetListJob(id, pageIndex, pageSize);
        setListJob(response?.data ?? []);
        settotalPage(response?.totalPages ?? 0);
        setpageIndex(response?.currentPage ?? 1);
        console.log(response);
    }

    return (
        <>
            <div className="clearfix"></div>

            <section className="inner-header-title" style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}>
                <div className="container">
                    <h1>{selectedBusiness?.companyName}</h1>
                </div>
            </section>
            <div className="clearfix"></div>

            <section className="detail-desc">
                <div className="container white-shadow">
                    <div className="row bottom-mrg">
                        <div className="detail-pic">
                            <img src={selectedBusiness.image_Avatar_url} className="img" alt="image" />
                        </div>
                        <div className="col-md-5 col-sm-5">
                            <div className="detail-desc-caption">
                                <h4>{selectedBusiness?.companyName}</h4>
                                <span className="designation">{selectedBusiness.industry}</span>
                                <p>{selectedBusiness.createdAt.split('T')[0]}</p>
                            </div>
                        </div>

                        <div className="col-md-7 col-sm-7">
                            <div className="get-touch">
                                <h4>Get in Touch</h4>
                                <ul>
                                    <li><i className="fa fa-map-marker"></i><span>{selectedBusiness.address}</span></li>
                                    <li><i className="fa fa-envelope"></i><span>{selectedBusiness.email}</span></li>
                                    <li><i className="fa fa-globe"></i><span>{selectedBusiness.websiteUrl}</span></li>
                                    <li><i className="fa fa-phone"></i><span>{selectedBusiness.phoneNumber}</span></li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="row no-padd">
                        <div className="detail pannel-footer">

                            <div className="col-md-5 col-sm-5">

                            </div>

                            <div className="col-md-7 col-sm-7">

                            </div>

                        </div>
                    </div>

                </div>
            </section>
            <section className="full-detail-description full-detail">
                <div className="container">
                    <div className="row row-bottom">
                        <h2 className="detail-title">About Company</h2>
                        <p>{selectedBusiness.companyInfo}</p>
                    </div>
                    <div className="row row-bottom">
                        <h2 className="detail-title">Image Company</h2>
                        {businessImages.length > 0 ? (
                            <div className="col-md-12 col-sm-12" style={{ paddingLeft: '0px' }}>
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
                                                src={image}
                                                alt={`Preview ${index}`}
                                                onClick={() => setSelectedImage(image)}
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
                    <div className="row row-bottom">
                        <h2 className="detail-title">List job of company</h2>

                        {ListJob ? (ListJob.map((job) => {
                            return (<article onClick={() => {
                                console.log(job.jobId)
                                navigate("/detail-job/" + job.jobId);
                            }}>
                                <div className="brows-job-list">
                                    <div className="col-md-1 col-sm-2 small-padding">
                                        <div className="brows-job-company-img">
                                            <a href="job-detail.html">
                                                <img
                                                    src={job.avatarUrl}
                                                    style={{ height: '80px', width: '90px', borderRadius: '50%' }}
                                                    className="img-responsive img-circle"
                                                    alt=""
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-5">
                                        <div className="brows-job-position">
                                            <a>
                                                <h3>{job.title}</h3>
                                            </a>
                                            <p>
                                                <span>{job.companyName}</span>
                                                <span className="brows-job-sallery">
                                                    <i className="fa fa-money" />
                                                    {job.salary}
                                                </span>
                                                <span className="job-type cl-success bg-trans-success">
                                                    Full Time
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hiển thị các category */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px',
                                            marginTop: '8px',
                                        }}
                                    >
                                        {job.categoryNames?.map((cat, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    backgroundColor: '#e9ecef',
                                                    color: '#333',
                                                    fontSize: '12px',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                }}
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="col-md-3 col-sm-3">
                                        <div className="brows-job-location">
                                            <p>
                                                <i className="fa fa-map-marker" />
                                                {job.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-2 col-sm-2">
                                        <div
                                            className="brows-job-link"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: '10px',
                                            }}
                                        >
                                            <button
                                                className="btn"
                                                style={{
                                                    backgroundColor: '#f8f9fa',
                                                    color: '#000',
                                                    border: '1px solid #ccc',
                                                    padding: '10px 15px',
                                                    borderRadius: '4px',
                                                    transition:
                                                        'background-color 0.3s ease, color 0.3s ease',
                                                    cursor: 'pointer',
                                                    flex: 1,
                                                }}
                                                onMouseOver={(e) => {
                                                    const target = e.target as HTMLElement;
                                                    target.style.backgroundColor = '#07b107';
                                                    target.style.color = '#fff';
                                                }}
                                                onMouseOut={(e) => {
                                                    const target = e.target as HTMLElement;
                                                    target.style.backgroundColor = '#f8f9fa';
                                                    target.style.color = '#000';
                                                }}
                                            >
                                                Apply Now
                                            </button>

                                            <button
                                                className="btn"
                                                style={{
                                                    backgroundColor: '#fff',
                                                    color: '#dc3545',
                                                    border: '2px solid #dc3545',
                                                    padding: '10px',
                                                    borderRadius: '50%',
                                                    width: '42px',
                                                    height: '42px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'border-color 0.3s ease',
                                                    cursor: 'pointer',
                                                }}
                                                onMouseOver={(e) => {
                                                }}
                                                onMouseOut={(e) => {

                                                }}
                                                title="Save Job"
                                            >
                                                <i className="fa fa-heart" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {job.isUrgentRecruitment ? (<span className="tg-themetag tg-featuretag">Premium</span>) : ("")}

                            </article>)
                        })) : (<p>List job no items</p>)}

                        {ListJob !== null && ListJob.length > 0

                            ? (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '15px' }}>
                                <span
                                    style={{
                                        color: 'gray',
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        padding: '5px',
                                        borderRadius: '50%',
                                        border: '2px solid #ddd',
                                        marginRight: '10px',
                                        width: '37px',
                                        textAlign: 'center'
                                    }}
                                    onClick={async () => {
                                        // Your async logic here
                                        await handleSearchpaging(pageIndex - 1);
                                        // Other logic (if necessary)
                                    }}
                                >
                                    &lt;
                                </span>
                                <span
                                    style={{
                                        fontSize: '16px',
                                        marginRight: '10px',
                                        color: 'gray'
                                    }}
                                >
                                    {pageIndex} / {totalPage} Pages
                                </span>
                                <span
                                    style={{
                                        color: 'gray',
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        padding: '5px',
                                        borderRadius: '50%',
                                        border: '2px solid green',
                                        width: '37px',
                                        textAlign: 'center'
                                    }}

                                    onClick={async () => {
                                        // Your async logic here
                                        await handleSearchpaging(pageIndex + 1);
                                        // Other logic (if necessary)
                                    }}
                                >
                                    &gt;
                                </span>
                            </div>) : ("")}
                    </div>
                </div>
            </section>
        </>
    )
}
