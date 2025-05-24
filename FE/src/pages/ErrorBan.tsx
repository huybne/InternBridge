import { useEffect } from "react";

export default function ErrorBan() {
    useEffect(() => {
        // Xóa token trong localStorage
        localStorage.clear();
    }, []);
    return (
        <>
            <section className="simple-bg-screen big-wrap">
                <div className="container">
                    <div className="error-page">
                        <h2>
                            4<span>0</span>4
                        </h2>
                        <p>You cannot continue using the service due to account lock.</p>
                    </div>
                </div>
            </section>
        </>
    );
}