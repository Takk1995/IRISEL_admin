import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from 'react-router-dom';
import "./Header.css"

const Header = () => {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div className="flex justify-content-between align-items-center w-full" style={{ height: '80px' }}>
            <Button
                onClick={() => setVisible(true)}
                className="mr-2 hamburger-button"
                style={{ color: 'white' }}
            >
                <span className="hamburger-icon"></span>
            </Button>
            <Sidebar visible={visible} onHide={() => setVisible(false)} className="w-full md:w-15rem lg:w-20rem">
                <div className='flex justify-content-center'>
                    <h2>Menu</h2>
                </div>
                <hr />
                <div>
                    <div className='flex align-items-center' style={{ padding: '10px', margin:'15px 0px', cursor: 'pointer' }} onClick={() => {if(location.pathname === '/admin'){setVisible(false)} else {navigate('/admin')}}}>
                        <i className="pi pi-box" style={{ fontSize: '24px', marginRight: '8px' }}></i>
                        <h3 style={{ margin: 0 }}>產品</h3>
                    </div>
                    <div className='flex align-items-center' style={{ padding: '10px', margin:'15px 0px', cursor: 'pointer' }} onClick={() => {navigate('/')}}>
                        <i className="pi pi-sign-out" style={{ fontSize: '24px', marginRight: '8px' }}></i>
                        <h3 style={{ margin: 0 }}>登出</h3>
                    </div>
                </div>
            </Sidebar>
            <div className="flex justify-content-center align-items-center" style={{ flexGrow: 1 }}>
                <img src="/Img/logo.png" alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
            </div>
        </div>
    )
}

export default Header