import axios, { AxiosPromise } from "axios";
import { ACCESS_TOKEN } from "../constant/accessToken";

const BASE_ENDPOINT = "https://restv2.fireant.vn";

const axiosInstance = axios.create({
  headers: { authorization: `Bearer ${ACCESS_TOKEN}` }
});

export const getFullFinanceReports = (
  stockCode: string,
  year: string,
  quarter: string,
  limit: string
) => {
  const url = `${BASE_ENDPOINT}/symbols/${stockCode}/full-financial-reports?type=2&year=${year}&quarter=${quarter}&limit=${limit}`;
  return axiosInstance.get(url);
};

export const getFinancialReports = ({
  stockCode,
  limit,
  type = "IS",
  period = "Q"
}: {
  stockCode: string;
  limit: string;
  type?: "IS" | "BS";
  period?: "Q" | "Y";
}) => {
  const url = `${BASE_ENDPOINT}/symbols/${stockCode}/financial-reports?type=${type}&period=${period}&compact=true&offset=0&limit=${limit}`;
  return axiosInstance.get(url);
};

export const getFundamental = (stockCode: string) => {
  const url = `${BASE_ENDPOINT}/symbols/${stockCode}/fundamental`;
  return axiosInstance(url);
};
export const getFinancialIndicators = (stockCode: string) => {
  const url = `${BASE_ENDPOINT}/symbols/${stockCode}/financial-indicators`;
  return axiosInstance.request<any[]>({ url });
};
export const getDividends = (stockCode: string) => {
  const url = `${BASE_ENDPOINT}/symbols/${stockCode}/dividends`;
  return axiosInstance.request({ url });
};
