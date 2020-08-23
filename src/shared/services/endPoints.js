// LOGIN API ENDPOINTS
export const ACCOUNT_WS = "user-ws";
export const LOGIN = "/v1/user/signin";
export const LOGOUT = "/v1/user/signout";


// TAG Master API ENDPOINTS
export const TAG_WS = "tag-ws";
export const TAG_MASTER_LIST = "/v1/tag/all"; //with pagination
export const CREATE_TAG_MASTER = "/v1/tag/create";
export const UPDATE_TAG_MASTER = "/v1/tag/update";
export const ARCHIVE_TAG = "/v1/tag/archive";
export const LIST_ALL_TAG = "/v1/tag/list/all"; //without pagination
export const GET_TAG_ITEMS = "/v1/tag/find";
export const DELETE_TAG_VALUE = "/v1/tag/delete";

// QUESTIONS API ENDPOINTS
export const QUESTION_WS = "content-ws";
export const QUESTIONS_LIST = "/v1/content/all";
export const CREATE_QUESTION = "/v1/content/create";
export const GET_QUESTION_DETAILS = "/v1/content/find";
export const SEND_TO_TRANSLATOR = "/v1/content/translate";
export const SEND_TO_VERIFIER = "/v1/content/verify";
export const UPLOAD_QUESTIONS = "/v1/content/upload";
export const UPDATE_QUESTION = "/v1/content/update";
export const GET_STATIC_DROPDOWNS = "/v1/config/static/dropdowns";
export const GET_DYNAMIC_DROPDOWNS = "/v1/config/dynamic/dropdowns";
export const EXPORT_TO_WORD = "/v1/content/getDataToDownloadBySelection";
export const GET_EXPORTED_FILE = "/v1/file/downloadResponseFile";
export const DOWNLOAD_SAMPLE_TEMPLATE = "/v1/file/sampleContentFile";
export const SEARCH_AND_FILTER = "/v1/elastic/getDetailsByFilter";
export const GET_INTERLINKS = "/v1/elastic/searchcontentinterlinking";
export const GET_FILTER_DROPDOWNS = "/v1/config/content/filter/dropdowns";

// OTHER CONTENT API ENDPOINTS
export const CONTENT_LIST = "/v1/othercontent/list";
export const CREATE_CONTENT = "/v1/othercontent/create";
export const GET_CONTENT_DETAILS = "/v1/othercontent/findOtherContentById/";
export const UPLOAD_CONTENT = "/v1/othercontent/uploadBulkData";
export const CONTENT_SEND_TO_VERIFIER = "/v1/othercontent/verify";
export const CONTENT_SEND_TO_TRANSLATOR = "v1/othercontent/translate";
export const GET_URL_FROMS3 = "/v1/file/uploadFiletoS3";
export const EXPORT_CONTENT_TO_WORD = "/v1/othercontent/getDataToDownloadBySelection";
export const GET_SAMPLE_TEMPLATE = "/v1/file/sampleOtherContentFile";
export const SEARCH_FILTER_CONTENT = "/v1/elastic/getContentByFilter";
export const GET_AUTOCOMPLETE_DATA = "/v1/elastic/searchcontentinterlinking";


// MANAGE USER ENDPOINTS
export const USER_LIST = "/v1/user/all";
export const ARCHIVE_USER = "/v1/user/archive";
export const USER_DETAILS= "/v1/user/find";
export const UPDATE_USER = "/v1/user/update"; 
export const CREATE_USER = "/v1/user/signup";
export const FILTER_USER = "/v1/user/elastic/find";
export const ROLES_LIST = "/v1/role/all";
export const ARCHIVE_ROLE = "/v1/role/archive";
export const CREATE_ROLE = "/v1/role/create";
export const ROLE_DETAILS = "/v1/role/find";
export const UPDATE_ROLE = "/v1/role/update";
export const SEARCH_ROLE = "/v1/user/elastic/find";
export const GET_ROLETYPES = "/v1/config/filter/dropdowns";

// PACKAGES ENDPOINTS
export const PACKAGE_WS = "package-ws";
export const PACKAGE_LIST = "/v1/package/all";
export const CREATE_PACKAGE = "/v1/package/create";
export const PACKAGE_DETAILS = "/v1/package/find";
export const PACKAGE_PUBLISH = "/v1/package/publish";
export const PACKAGE_UNPUBLISH = "/v1/package/unpublish";
export const PACKAGE_UPDATE = "/v1/package/update";
export const STATIC_DROPDOWNS ="/v1/config/static/dropdowns";
export const PACKAGE_SEARCH_FILTER = "/v1/package/getDetailsByFilter";
export const PACKAGE_FILTER_DROPDOWNS = "/v1/config/filter/dropdowns";

// ORDER ENDPOINTS
export const ORDER_WS = "order-ws";
export const ORDER_LIST = "/v1/order/all";
export const CREATE_ORDER = "/v1/order/create";
export const ORDER_DETAILS = "/v1/order/find?id=";
export const ORDER_UPDATE = "/v1/order/update";
export const ORDER_SEARCH_FILTER="/v1/order/getDetailsByFilter";
export const ORDER_FILTER_DROPDOWNS = "/v1/config/filter/dropdowns";



// EXAM ENDPOINTS
export const EXAM_WS = "exam-ws";
export const EXAM_FILTER_DROPDOWNS = "/v1/config/filter/dropdowns";
export const EXAMS_LIST = "/v1/exam/all";
export const EXAM_ARCHIVE = "/v1/exam/archive";
export const CREATE_EXAM = "/v1/exam/create";
export const EXAM_DETAILS = "/v1/exam/find";
export const PUBLISH_EXAM = "/v1/exam/publish";
export const UNPUBLISH_EXAM ="/v1/exam/unpublish";
export const UPDATE_EXAM = "/v1/exam/update";
export const CREATE_STAGE = "/v1/stage/create";




