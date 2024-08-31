import React from 'react';

//highchart
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options = {
    chart: { type: 'column' },
    title: false,
    credits: { text: "CEO: Anuj Partap Singh", href: "https://wa.me/917080906913" },
    xAxis: {
        categories: ['A', 'B', 'C', 'D', 'E', '5'],
        crosshair: true,
        accessibility: { description: 'Countries' }
    },
    yAxis: { min: 0, title: { text: 'Values' } },
    tooltip: { valueSuffix: ' (1000 MT)' },
    plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
    series: [
        { name: 'Approach', data: [406292, 260000, 107000, 68300, 27500, 14500] },
        { name: 'Sale', data: [51086, 136000, 5500, 141000, 107180, 77000] }
    ]
};

function Chart() {
    return (
        <section className="map-and-rankings">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-8">
                        <div className="graph-wrapper">
                            <h3 className="title">Weekly Report</h3>
                            <div id="map-container" className="highchart-wrapper" style={{ width: "100%", height: "100%", minHeight: "555px" }}>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="rank-card top-rankers">
                            <h3 className="heading">Best Selling Teams</h3>
                            <div className="table-wrapper">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="profile-wrapper">
                                                    <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                </div>
                                            </td>
                                            <td>Flotsam</td>
                                            <td>40k+ sales</td>
                                            <td>$1.4m revenue</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="profile-wrapper">
                                                    <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                </div>
                                            </td>
                                            <td>Flotsam</td>
                                            <td>40k+ sales</td>
                                            <td>$1.4m revenue</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="profile-wrapper">
                                                    <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                </div>
                                            </td>
                                            <td>Flotsam</td>
                                            <td>40k+ sales</td>
                                            <td>$1.4m revenue</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="rank-card top-rankers">
                            <h3 className="heading">Best Selling Department</h3>
                            <div className="table-wrapper">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="profile-wrapper">
                                                    <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                </div>
                                            </td>
                                            <td>Flotsam</td>
                                            <td>40k+ sales</td>
                                            <td>$1.4m revenue</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="profile-wrapper">
                                                    <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                </div>
                                            </td>
                                            <td>Flotsam</td>
                                            <td>40k+ sales</td>
                                            <td>$1.4m revenue</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="profile-wrapper">
                                                    <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                </div>
                                            </td>
                                            <td>Flotsam</td>
                                            <td>40k+ sales</td>
                                            <td>$1.4m revenue</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Chart;
