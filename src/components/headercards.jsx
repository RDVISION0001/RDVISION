import React from 'react'

function headercards() {
  return (
   <>
   <div className="cards-components">
      <section className="header-cards m-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <a href="tables.html" className="card p-3"> Tables </a>
            </div>
            <div className="col-md-4">
              <a href="admin/" className="card p-3"> Admin </a>
            </div>
            <div className="col-md-4">
              <a href="admin/" className="card p-3"> Manager </a>
            </div>
          </div>
        </div>
      </section>
    </div>
   </>
  )
}

export default headercards