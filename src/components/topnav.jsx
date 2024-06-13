import React from 'react'

function topnav() {
    return (
        <>

            {/* <!-- Top Nav --> */}
            <nav className="navbar top-navbar navbar-light bg-white container-fluid">
                <div className="left-part">
                    <a className="btn border-0 ms-2" id="menu-btn"><i className="fa-solid fa-bars"></i></a>
                    <span className="page-title">Dashboard</span>
                </div>
                <div className="right-part">
                    <div className="global-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" name="search" id="globalSearch" className="form-control" placeholder="Search" />
                    </div>
                    <a href="#" className="notification">
                        <i className="fa-solid fa-bell"></i>
                    </a>
                </div>
            </nav>
        </>
    )
}

export default topnav