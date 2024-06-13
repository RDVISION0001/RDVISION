import React from 'react'

function index() {
  return (
   <>
    <div className="index">
      <section className="index-cards m-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <a href="tables.html" className="card p-3"> Tables </a>
            </div>
            <div className="col-md-4">
              <a href="header-cards.html" className="card p-3"> Cards </a>
            </div>
            <div className="col-md-4">
              <a href="modalcomponent.html" className="card p-3"> Popups/Modals </a>
            </div>
          </div>
        </div>
      </section>
    </div>
   </>
  )
}

export default index