function FirstBankHeaders(deviceID: string, sessionId: string | null, contentLength?: number) {
  type HeadersProps = {
    Host: string;
    'Cache-Control': string;
    Pragma: string;
    Expires: 0;
    Client_id: string;
    Deviceid: any;
    Appversion: string;
    Sessionid: any;
    'Content-Type': string;
    'Content-Length': number;
    'Accept-Encoding': string;
    'User-Agent': string;
    Customtype: boolean;
    Connection: string;
  };

  const headers = {
    Host: 'mobapp.firstbanknigeria.com',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: 0,
    Client_id: 'tPYQ0YJCeN8QsYS3c/lRweuNjwi0yYtrNeDhBrE=',
    Deviceid: deviceID,
    Appversion: '2.7.0',
    Sessionid: sessionId,
    'Content-Type': 'application/json',
    'Content-Length': contentLength,
    'Accept-Encoding': 'gzip, deflate',
    'User-Agent': 'okhttp/3.12.1',
  } as HeadersProps;

  return headers;
}

export default FirstBankHeaders;
