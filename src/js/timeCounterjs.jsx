import React, { useState, useEffect } from 'react';

const TimeCounterjs = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isContainerActive, setIsContainerActive] = useState(false);

  const checkViewportSize = () => {
    if (window.innerWidth < 992) {
      setIsSidebarActive(false);
      setIsContainerActive(false);
    } else {
      setIsSidebarActive(true);
      setIsContainerActive(true);
    }
  };

  useEffect(() => {
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
      {/* Your HTML elements */}
      <div id="menu-btn" onClick={toggleMenu}>Menu Button</div>
      <div id="sidebar" className={isSidebarActive ? "active-nav" : ""}>Sidebar</div>
      <div className={`my-container ${isContainerActive ? "active-cont" : ""}`}>Container</div>
    </div>
  );
};

export default TimeCounterjs;
