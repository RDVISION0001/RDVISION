import React, { useState, useEffect } from 'react';

const Sidebarjs = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isContainerActive, setIsContainerActive] = useState(false);

  useEffect(() => {
    const checkViewportSize = () => {
      if (window.innerWidth < 992) {
        setIsSidebarActive(false);
        setIsContainerActive(false);
      } else {
        setIsSidebarActive(true);
        setIsContainerActive(true);
      }
    };

    checkViewportSize();
    window.addEventListener("resize", checkViewportSize);

    return () => {
      window.removeEventListener("resize", checkViewportSize);
    };
  }, []);

  const toggleMenu = () => {
    setIsSidebarActive(!isSidebarActive);
    setIsContainerActive(!isContainerActive);
  };

  return (
    <div>
      <div id="menu-btn" onClick={toggleMenu}>Menu Button</div>
      <div id="sidebar" className={isSidebarActive ? "active-nav" : ""}>Sidebar</div>
      <div className={`my-container ${isContainerActive ? "active-cont" : ""}`}>Container</div>
    </div>
  );
};

export default Sidebarjs;
