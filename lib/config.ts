const LOCAL_IP = "192.168.1.5"; // ← replace with your IP from ipconfig

const DEV_URL = `http://${LOCAL_IP}:5000/api`;
const PROD_URL = "https://document-master-server.vercel.app/api";

// export const API_URL = __DEV__ ? DEV_URL : PROD_URL;

export const API_URL = "https://document-master-server.vercel.app/api";
