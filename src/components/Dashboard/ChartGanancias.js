import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Row } from "reactstrap";

const janEarningData = [
    31, 40, 36, 51, 49, 72, 69, 56, 68, 82, 68, 76
];

const decEarningData = [
    42, 19, 32, 51, 49, 44, 14, 56, 68, 82, 68, 76
];

const novEarningData = [
    31, 40, 36, 51, 49, 72, 69, 12, 35, 42, 18, 76
];

const octEarningData = [
    31, 40, 49, 44, 14, 56, 69, 31, 40, 36, 51
];

export default function ChartGanancias(){
    const [seletedMonth, setSeletedMonth] = useState("jan");
    const [data, setData] = useState(janEarningData)
    const onChangeMonth = value => {
      setSeletedMonth(value);
      switch(value){
        case 'jan':
          setData(janEarningData);
          break;
        case 'dec':
          setData(decEarningData);
          break;
        case 'nov':
          setData(novEarningData);
          break;
        case 'oct':
          setData(octEarningData);
          break;
        default:
          break;
      }
    };

    const options = {
        chart: {
          toolbar: "false",
          dropShadow: {
            enabled: !0,
            color: "#000",
            top: 18,
            left: 7,
            blur: 8,
            opacity: 0.2,
          },
        },
        dataLabels: {
          enabled: !1,
        },
        colors: ["#556ee6"],
        stroke: {
          curve: "smooth",
          width: 3,
        },
    };

    const series = [
        {
          name: "Series 1",
          data: [...data],
        },
    ];

    return (
        <>
            <Card>
              <CardBody>
                <div className="clearfix">
                  <div className="float-end">
                    <div className="input-group input-group-sm">
                      <select
                        className="form-select form-select-sm"
                        value={seletedMonth}
                        onChange={(e) => {
                          onChangeMonth(e.target.value);
                        }}
                      >
                        <option value="jan">Enero</option>
                        <option value="dec">Febrero</option>
                        <option value="nov">Marzo</option>
                        <option value="oct">Abril</option>
                      </select>
                      {/* <div className="input-group-append"> */}
                      <label className="input-group-text">Mes</label>
                      {/* </div> */}
                    </div>
                  </div>
                  <h4 className="card-title mb-4">Ganancia</h4>
                </div>
    
                <Row>
                  <Col lg="4">
                    <div className="text-muted">
                      <div className="mb-4">
                        <p>Este mes</p>
                        <h4>$2453.35</h4>
                        <div>
                          <span className="badge badge-soft-success font-size-12 me-1">
                            {" "}
                            + 0.2%{" "}
                          </span>{" "}
                          Del mes anterior
                        </div>
                      </div>
    
                      <div className="mt-4">
                        <p className="mb-2">Ultimo mes</p>
                        <h5>$2281.04</h5>
                      </div>
                    </div>
                  </Col>
    
                  <Col lg="8">
                    <div id="line-chart" dir="ltr">
                      <ReactApexChart
                        series={series}
                        options={options}
                        type="line"
                        height={320}
                        className="apex-charts"
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
        </>
      );
}