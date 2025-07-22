export const SIGNIN = 'auth/login';
export const FORGOT_PASSWORD = 'forgot-password';
export const RESETPASSWORD = 'verify-forgot';
export const RESEND_OTP = 'tenant/resend';

// user
export const GET_USER = 'profile';

//Profile
export const RESET_PASSWORD = 'change-password';
export const SIGNUP_TERMS = 'tenant/terms';
export const PROFILE_IMG = 'profile-img';

//Tenants
export const TENANTS_ACTIVE_STATISTICS = 'verified/statistics';
export const VERIFIED_TENANTS = 'verified';
export const UNVERIFIED_TENANTS = 'un-verified';
export const GET_TENANT_BY_ID = 'tenant';
export const GET_TENANT_DUE_BY_ID = 'upcoming-due';
export const GET_TENANT_SPENDS_DUE_BY_ID = 'payments/payment-history/spends';
export const SET_TENANT_STATUS_BY_ID = 'tenant/status';
export const GET_TENANT_BY_ID_NEWS_LETTER = 'properties/news-letter';
export const SET_TENANT_BY_ID_NEWS_LETTER = 'news-letter';
export const GET_TENANT_LANDLORD_INFO = 'landlord';
export const GET_TENANT_TRANSACTION = 'payments/payment-history/list';
export const GET_TENANT_NOTIFICATION = 'properties/notification/get-all';

//Payments
export const PAYMENTS_STATISTICS = 'payments/payment-history/statistics';
export const PAYMENTS_DOWNLOAD_HISTORY = 'download/users';
export const PAYMENTS_DOWNLOAD_HISTORY_FOR_USER = 'download/user';
export const PAYMENTS_HISTORY = 'payments/payment-history/get-all';
export const UPCOMING_DUE = 'rentals/get-dues';
export const ACTIVE_TENANTS = 'verified';
export const IN_ACTIVE_TENANTS = 'un-verified';
export const PAYMENT_DETAILS = 'payments/payment-history';
export const GET_PAYMENT_LIST_INFO = 'payment-method/list';

//Admins
export const GET_ALL_ADMINS = 'get-all';
export const ADMIN_STATUS = 'status';
export const ADMIN_GENERATE_PASSWORD = 'generate-password';

// Dashboard
export const GET_DASHBOARD_ALL_STATISTICS = 'over-all/statistics';
export const GET_ALL_TRANSACTION = 'total-transaction';
export const GET_ALL_USER_TRANSACTION = 'tenants-statistics';
export const GET_RECENT_TRANSACTION = 'current/recent-transaction';
export const GET_ALL_TRANSACTION_GRAPH = 'total-transaction-graph';
export const GET_RECENT_ACTIVITY = 'recent-activity';

//Activity
export const GET_USER_ACTIVITY = 'properties/user-activity/get-all';
export const GET_ADMIN_ACTIVITY = 'properties/admin-activity/get-all';
export const GET_BY_USER_ACTIVITY = 'properties/user-activity/get-by-user';
export const PROFILE_ACTIVITY = 'properties/admin-activity/profile';
export const ACTIVITY_TYPE = 'properties/activity-type';

// Category
export const GET_ALL_CATEGORY = 'rewards/offer-category/get-all';

// Rewards
export const GET_ALL_CREDIT_CARDS = 'rewards/reward-credit/get-all';
export const GET_ALL_DEBIT_CARDS = 'rewards/reward-debit';
export const GET_BY_ID_CRDIR_CARD_INFO = 'rewards/reward-credit';
export const CARD_STATUS_UPDATED = 'rewards/reward-credit/status';
export const GET_BY_ID_DEBIT_CARD_INFO = 'rewards/reward-debit';
export const DEBIT_CARD_UPDATED = 'rewards/reward-debit';

//Logout
export const LOGOUT = 'logout';

// Approval
export const GET_APPROVAL_LIST = `rentals/approvals`;
export const GET_APPROVAL_DETAIL = `rental-info`;
export const GET_APPROVAL_STATISTICS = `rentals/statistics`;
export const SET_REVIEW_STATUS = `review-rental`;
export const REVIEW_SUBMIT = `review-submit`;
