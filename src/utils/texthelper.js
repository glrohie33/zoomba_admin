export const SUCCESSALERT = 'success';
export const INFOALERT = 'info';
export const ERRORALERT = 'error';
export const WARNINGALERT = 'warning';

const ZOOMBABASEURL = process.env.REACT_APP_ZOOMBA_API_END_POINT;
export const REGISTRATIONENDPOINT = `${ZOOMBABASEURL}/users`;
export const LOGINENDPOINT = `${ZOOMBABASEURL}/auth/login`;
export const AUTHALERTNAME = 'authAlert';
export const STORAGEUSERKEY = 'ZoombaUser';
export const CATEGORYLISTURL = `${ZOOMBABASEURL}/categories`;
export const PLATFORMlISTURL = `${ZOOMBABASEURL}/platform`;
export const ATTRIBUTElISTURL = `${ZOOMBABASEURL}/attributes`;
export const GETUSERURL = `${ZOOMBABASEURL}/users/`;
export const DEFAULTIMAGE = "https://via.placeholder.com/150?text=select+image";
export const BRANDLISTURL = `${ZOOMBABASEURL}/brands`;
export const STORELISTURL = `${ZOOMBABASEURL}/stores`;
export const VERIFYSTOREURL = `${ZOOMBABASEURL}/stores/verify`;
export const MEDIAURL = `${ZOOMBABASEURL}/media`;
export const PRODUCTURL = `${ZOOMBABASEURL}/products`;
export const POSTURL = `${ZOOMBABASEURL}/posts`;
export const PAYMENTOPTIONSURL = `${ZOOMBABASEURL}/payment-options`;
export const ORDERLISTURL = `${ZOOMBABASEURL}/orders`