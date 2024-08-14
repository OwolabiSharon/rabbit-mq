const ZenithHeaders = (Deviceid: any, contentLength: any) => {
    const headers = {
      Host: "zmobile.zenithbank.com",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Appversion: "2.16.8",
      Deviceid,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": contentLength,
      "Accept-Encoding": "gzip, deflate",
      "User-Agent": "okhttp/4.8.1",
      Connection: "close",
    } as any;
  
    return headers;
  };
  
  export default ZenithHeaders;
  