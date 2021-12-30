import { useState } from "react";

import { CSVLink } from "react-csv";
import NumberFormat from "react-number-format";

import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Table from "react-bootstrap/Table";
import {
  getFinancialReports,
  getFullFinanceReports,
  getFundamental,
  getFinancialIndicators
} from "./api/symbols";

interface FinancialReport {
  columns: any[];
  rows: any[];
}
function App() {
  const [csvData, setCSVData] = useState<any[]>([
    ["Quý", "Doanh thu (tỷ vnd)", "LNST (tỷ vnd)"]
  ]);
  const [loading, setLoading] = useState(false);
  const [quarter, setQuarter] = useState("3");
  const [year, setYear] = useState("2021");
  const [limit, setLimit] = useState("6");
  const [stockCode, setStockCode] = useState("HPG");
  const [accessKey, setAccessKey] = useState(
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTM1ODE1Njc0LCJuYmYiOjE2MzU4MTU2NzQsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiJkYmMxYzdiNC01N2FhLTRhYTItYmJkYy1kZjJjYTRiMDJkYTgiLCJhdXRoX3RpbWUiOjE2MzU4MTU2NzQsImlkcCI6Ikdvb2dsZSIsIm5hbWUiOiJ1bmhhbmcxMUBnbWFpbC5jb20iLCJzZWN1cml0eV9zdGFtcCI6ImIyYzQyOWM5LTdlYzMtNDJiNC1hOTYzLThjZTE3MDg3NjdjZiIsInByZWZlcnJlZF91c2VybmFtZSI6InVuaGFuZzExQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidW5oYW5nMTFAZ21haWwuY29tIiwiZnVsbF9uYW1lIjoiSGFuIE5oYXQiLCJlbWFpbCI6InVuaGFuZzExQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImp0aSI6IjViZGM3YjUzN2UxY2NlMDgwZjk2NzYyMjFmMTRiOWNjIiwiYW1yIjpbImV4dGVybmFsIl19.rfACh8wHTOZ4QdUa7X4x8ZByQdJU9AaWp9Xzxc6sADjR6Sx1KJkWH1zNXgBT4Zs6RxawdaolQzOI5k2AF1Zk45jzZjbkyUDoJ-utm6Dc_qGW3415rHhSyPT4uPk1MWimwVJsz_ic-mbFVshmcx7t2hoeRo1D0Fhw0LUd1qRVQ8SUcC4pO3NdzTG2mAIU9lvqJdhPzBzbReHz6xP2_BZj3l9LfVVbaPCwxoNJxnhJbhL5R_w-lHIsO3yOK37pqiv473qwOh86BaCtyLOlYHn6spEDQ9gbCKsdN2jRM984A8JhkCEiA5OlnBtjfqhKzSl5IViesfoY1bTEUpHeZhp9eg"
  );

  const [financialReport, setFinancialReport] = useState<FinancialReport>({
    rows: [],
    columns: []
  });
  const [financialReportC, setFinancialReportC] = useState<FinancialReport>({
    rows: [],
    columns: []
  });
  const [indicators, setIndicators] = useState<any[]>([]);

  const mapData = (data: any[]) => {
    const tmpCsvData: any[][] = [
      ["Quý", "Doanh thu (tỷ vnd)", "LNST (tỷ vnd)"]
    ];
    data[0].values.forEach((item: any, index: number) => {
      const row = [
        item["period"],
        item["value"],
        data[19].values[index]["value"]
      ];
      tmpCsvData.push(row);
    });
    setCSVData(tmpCsvData);
  };

  const fetchData = async () => {
    setLoading(true);

    // let fullFinancialReports;
    let financialReports;
    let financialReports_1;
    let tmpIndicators;
    // let fundamental;
    try {
      financialReports = await getFinancialReports({ stockCode, limit });
      financialReports_1 = await getFinancialReports({
        stockCode,
        type: "BS",
        limit
      });
      tmpIndicators = await getFinancialIndicators(stockCode);
      console.log(tmpIndicators.data[0]);
      setIndicators(tmpIndicators.data);
      setFinancialReport(financialReports.data);
      setFinancialReportC(financialReports_1.data);

      // mapData(fullFinancialReports.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // const getCompanyIndicator = async () => {
  //   return 1;
  // };

  const generateRow = (data: any[]) => {
    return data?.map((value: any, col: number) => {
      if (col === 1) return null;
      return col === 0 ? (
        <th>{value}</th>
      ) : (
        <td>
          <NumberFormat
            value={value / 1000000000}
            decimalScale={2}
            displayType="text"
            decimalSeparator="."
          />
        </td>
      );
    });
  };

  const generateIndicator = (data: any) => {
    return (
      <Row>
        <Col>
          <span>
            {data.name}:{" "}
            <NumberFormat
              value={data.value}
              decimalScale={2}
              displayType="text"
              decimalSeparator="."
            />
          </span>
        </Col>
      </Row>
    );
  };

  const financialReportTable = financialReport ? (
    <Table hover striped>
      <thead>
        <tr>
          {financialReport.columns?.map((col: any, idx: number) => {
            if (idx === 1) return null;
            return <th key={idx}>{idx > 1 ? col : null}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        <tr>{generateRow(financialReport?.rows[0])}</tr>
        <tr>{generateRow(financialReport?.rows[3])}</tr>
        <tr>{generateRow(financialReportC?.rows[0])}</tr>
        <tr>{generateRow(financialReportC?.rows[2])}</tr>
      </tbody>
    </Table>
  ) : null;
  return (
    <Container>
      <br />
      <Row>
        <h1>Cào báo cáo tài chính</h1>
      </Row>
      <Row>
        <Col>
          <FloatingLabel
            controlId="floatingInput"
            label="Mã CP"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="HPG"
              value={stockCode}
              onChange={(e) => {
                setStockCode(e.target.value);
              }}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col>
          <FloatingLabel
            controlId="floatingInput"
            label="Từ năm"
            className="mb-3"
          >
            <Form.Control
              type={"number"}
              placeholder="2021"
              value={year}
              maxLength={4}
              onChange={(e) => {
                setYear(e.target.value);
              }}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel
            controlId="floatingInput"
            label="Từ quý"
            className="mb-3"
          >
            <Form.Control
              type={"number"}
              placeholder="3"
              value={quarter}
              max={4}
              min={1}
              onChange={(e) => {
                setQuarter(e.target.value);
              }}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel
            controlId="floatingInput"
            label="Số lượng cột"
            className="mb-3"
          >
            <Form.Control
              type={"number"}
              placeholder="12"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
              }}
            />
          </FloatingLabel>
        </Col>
      </Row>

      <Row>
        <Col>
          <FloatingLabel
            hidden
            controlId="floatingTextarea2"
            label="AccessToken"
          >
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <br />

      <Row>
        <Stack gap={2} className="col-md-5 mx-auto">
          <Button variant="success" onClick={fetchData} disabled={loading}>
            Múc
          </Button>
          {csvData.length > 1 && (
            <CSVLink data={csvData} filename={`${stockCode}.csv`}>
              Download me
            </CSVLink>
          )}
        </Stack>
      </Row>
      <br />
      <Row>
        <Col>
          <h4>Các chỉ số doanh nghiệp</h4>
        </Col>
      </Row>
      {indicators[0] && generateIndicator(indicators[0])}
      {indicators[3] && generateIndicator(indicators[3])}
      <br />
      <Row>
        <Col>
          <h4>Báo cáo tài chính</h4>
        </Col>
      </Row>
      <Row>
        <Col>{financialReportTable}</Col>
      </Row>
    </Container>
  );
}

export default App;
