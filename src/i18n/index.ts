import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Inline translation objects instead of JSON imports
const enTranslations = {
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "submit": "Submit",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "search": "Search",
    "filter": "Filter",
    "clear": "Clear",
    "apply": "Apply",
    "reset": "Reset",
    "showMore": "Show More",
    "showLess": "Show Less",
    "noResults": "No results found",
    "noData": "No data available",
    "noDescription": "No description available",
    "required": "Required",
    "optional": "Optional"
  },
  "navigation": {
    "home": "Home",
    "serviceCatalog": "Service Catalog",
    "knowledgeBase": "Knowledge Base",
    "myRequests": "My Requests",
    "storedRequests": "Stored Requests"
  },
  "header": {
    "brandName": "External Portal",
    "searchPlaceholder": "Search services...",
    "themeToggle": "Toggle theme",
    "mobileMenu": "Toggle mobile menu"
  },
  "home": {
    "hero": {
      "title": "Welcome to the Ministry of Finance External Portal",
      "description": "Access government services and resources with ease",
      "subtitle": "Access government services and resources with ease",
      "browseServices": "Browse Services",
      "learnMore": "Learn More"
    },
    "search": {
      "placeholder": "Search for services, guides, and resources..."
    },
    "quickAccess": {
      "title": "Quick Access",
      "subtitle": "Most popular services and resources"
    },
    "quickAccessPortal": {
      "title": "Quick Access Portal",
      "description": "Access the most commonly used services and resources",
      "serviceCatalog": {
        "title": "Service Catalog",
        "description": "Browse and request government services"
      },
      "knowledgeBase": {
        "title": "Knowledge Base",
        "description": "Find answers and documentation"
      },
      "myRequests": {
        "title": "My Requests",
        "description": "Track and manage your service requests"
      }
    },
    "featuredArticles": {
      "title": "Featured Articles",
      "subtitle": "Latest updates and important information"
    },
    "featuredResources": {
      "title": "Featured Resources",
      "description": "Helpful guides and important information",
      "readArticle": "Read Article",
      "userGuide": {
        "title": "User Guide",
        "readTime": "5 min read",
        "subtitle": "How to Submit a Service Request",
        "description": "Complete guide to submitting and tracking service requests through the Ministry of Finance portal"
      },
      "security": {
        "title": "Security",
        "readTime": "4 min read",
        "subtitle": "Password Security Guidelines",
        "description": "Official security guidelines for creating and managing your government account passwords"
      },
      "technical": {
        "title": "Technical",
        "readTime": "3 min read",
        "subtitle": "Technical Support Guide",
        "description": "Technical documentation and troubleshooting guides"
      }
    },
    "popularSearches": {
      "title": "Popular Searches",
      "passwordReset": "Password Reset",
      "softwareInstallation": "Software Installation",
      "accessRequest": "Access Request",
      "hardwareSupport": "Hardware Support",
      "emailSetup": "Email Setup"
    },
    "quickLinks": {
      "browseServices": "Browse Services",
      "knowledgeBase": "Knowledge Base",
      "testApiConnection": "Test API Connection"
    }
  },
  "catalog": {
    "title": "Service Catalog",
    "subtitle": "Browse and request services from our comprehensive catalog",
    "searchPlaceholder": "Search services...",
    "categoryFilter": "Filter by category",
    "allCategories": "All Categories",
    "noServices": "No services found",
    "noServicesDescription": "Try adjusting your search or category filters",
    "showingResults": "Showing {{count}} of {{total}} services",
    "requestService": "Request Service",
    "loadingServices": "Loading services...",
    "errorLoading": "Error Loading Services",
    "tryAgain": "Try Again"
  },
  "form": {
    "requestForm": "Request Form",
    "submitRequest": "Submit Request",
    "problemDescription": "Problem Description",
    "description": "Description",
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "category": "Category",
    "priority": "Priority",
    "urgency": "Urgency",
    "details": "Details",
    "attachments": "Attachments",
    "comments": "Comments",
    "notes": "Notes",
    "selectOption": "Select an option",
    "selectDate": "Select date",
    "selectTime": "Select time",
    "uploadFile": "Upload file",
    "dragAndDrop": "Drag and drop files here, or click to select",
    "fileSizeLimit": "File size limit: {{size}}MB",
    "supportedFormats": "Supported formats: {{formats}}",
    "loadingForm": "Loading form...",
    "searchService": "Search Service"
  },
  "requests": {
    "title": "My Requests",
    "subtitle": "Track and manage your service requests",
    "newRequest": "New Request",
    "requestNumber": "Request Number",
    "status": "Status",
    "created": "Created",
    "updated": "Updated",
    "priority": "Priority",
    "category": "Category",
    "description": "Description",
    "actions": "Actions",
    "view": "View",
    "edit": "Edit",
    "delete": "Delete",
    "noRequests": "No requests found",
    "noRequestsDescription": "You haven't submitted any requests yet"
  },
  "knowledge": {
    "title": "Knowledge Base",
    "subtitle": "Find answers and documentation",
    "searchPlaceholder": "Search knowledge base...",
    "categories": "Categories",
    "popularArticles": "Popular Articles",
    "recentArticles": "Recent Articles",
    "noArticles": "No articles found",
    "noArticlesDescription": "Try adjusting your search criteria"
  },
  "knowledgeBase": {
    "title": "Knowledge Base",
    "subtitle": "Discover comprehensive answers and explore our curated collection of knowledge articles designed to help you succeed",
    "searchPlaceholder": "Search knowledge articles, guides, and solutions...",
    "loadingArticles": "Loading articles...",
    "errorLoadingArticles": "Error Loading Articles",
    "tryAgain": "Try Again",
    "by": "By",
    "helpful": "helpful",
    "readArticle": "Read Article",
    "noArticlesFound": "No Articles Found",
    "noArticlesForSearch": "No articles found for \"{{query}}\". Try a different search term.",
    "noArticlesAvailable": "No articles available at the moment.",
    "clearSearch": "Clear Search"
  },
  "messages": {
    "requestSubmitted": "Request submitted successfully!",
    "requestCreated": "Request created successfully!",
    "requestItemCreated": "Request Item created successfully!",
    "requestNumber": "Request Number: {{number}}",
    "requestItemNumber": "Request Item: {{number}}",
    "statusSubmitted": "Status: Submitted",
    "processingMessage": "Your request has been created in ServiceNow and is being processed.",
    "errorSubmitting": "Error submitting request",
    "errorLoading": "Error loading data",
    "networkError": "Network error. Please check your connection.",
    "validationError": "Please check your input and try again.",
    "sessionExpired": "Your session has expired. Please refresh the page.",
    "unauthorized": "You are not authorized to perform this action.",
    "notFound": "The requested resource was not found."
  },
  "status": {
    "draft": "Draft",
    "submitted": "Submitted",
    "inProgress": "In Progress",
    "pending": "Pending",
    "approved": "Approved",
    "rejected": "Rejected",
    "completed": "Completed",
    "cancelled": "Cancelled",
    "closed": "Closed"
  },
  "priority": {
    "low": "Low",
    "medium": "Medium",
    "high": "High",
    "critical": "Critical"
  },
  "urgency": {
    "low": "Low",
    "medium": "Medium",
    "high": "High",
    "critical": "Critical"
  },
  "categories": {
    "software": "Software",
    "hardware": "Hardware",
    "network": "Network",
    "access": "Access",
    "office": "Office",
    "template": "Template Management",
    "roleDelegation": "Role Delegation",
    "applicationAccess": "Application and Account Access",
    "maor": "מאור"
  },
  "language": {
    "en": "English",
    "he": "עברית",
    "ar": "العربية",
    "switchLanguage": "Switch Language"
  }
};

const heTranslations = {
  "common": {
    "loading": "טוען...",
    "error": "שגיאה",
    "success": "הצלחה",
    "cancel": "ביטול",
    "submit": "שלח",
    "save": "שמור",
    "delete": "מחק",
    "edit": "ערוך",
    "close": "סגור",
    "back": "חזור",
    "next": "הבא",
    "previous": "הקודם",
    "search": "חיפוש",
    "filter": "סינון",
    "clear": "נקה",
    "apply": "החל",
    "reset": "אפס",
    "showMore": "הצג עוד",
    "showLess": "הצג פחות",
    "noResults": "לא נמצאו תוצאות",
    "noData": "אין נתונים זמינים",
    "noDescription": "אין תיאור זמין",
    "required": "נדרש",
    "optional": "אופציונלי"
  },
  "navigation": {
    "home": "בית",
    "serviceCatalog": "קטלוג שירותים",
    "knowledgeBase": "מאגר ידע",
    "myRequests": "הבקשות שלי",
    "storedRequests": "בקשות שמורות"
  },
  "header": {
    "brandName": "פורטל חיצוני",
    "searchPlaceholder": "חיפוש שירותים...",
    "themeToggle": "החלף ערכת נושא",
    "mobileMenu": "תפריט נייד"
  },
  "home": {
    "hero": {
      "title": "ברוכים הבאים לפורטל החיצוני של משרד האוצר",
      "description": "גש לשירותי הממשלה ומשאבים בקלות",
      "subtitle": "גש לשירותי הממשלה ומשאבים בקלות",
      "browseServices": "עיין בשירותים",
      "learnMore": "למידע נוסף"
    },
    "search": {
      "placeholder": "חיפוש לשירות, מדריכים ומשאבים..."
    },
    "quickAccess": {
      "title": "גישה מהירה",
      "subtitle": "השירותים והמשאבים הפופולריים ביותר"
    },
    "quickAccessPortal": {
      "title": "פורטל גישה מהירה",
      "description": "גש לשירותים ומשאבים הנפוצים ביותר",
      "serviceCatalog": {
        "title": "קטלוג שירותים",
        "description": "עיין ובקש שירותי ממשלה"
      },
      "knowledgeBase": {
        "title": "מאגר ידע",
        "description": "מצא תשובות ותיעוד"
      },
      "myRequests": {
        "title": "הבקשות שלי",
        "description": "עקוב ונהל את בקשות השירות שלך"
      }
    },
    "featuredArticles": {
      "title": "מאמרים מומלצים",
      "subtitle": "עדכונים אחרונים ומידע חשוב"
    },
    "featuredResources": {
      "title": "משאבים מומלצים",
      "description": "מדריכים שימושיים ומידע חשוב",
      "readArticle": "קרא מאמר",
      "userGuide": {
        "title": "מדריך משתמש",
        "readTime": "5 דקות קריאה",
        "subtitle": "איך להגיש בקשה לשירות",
        "description": "מדריך מלא להגשת ומעקב אחר בקשות שירות דרך פורטל משרד האוצר"
      },
      "security": {
        "title": "אבטחה",
        "readTime": "4 דקות קריאה",
        "subtitle": "הנחיות אבטחת סיסמאות",
        "description": "הנחיות אבטחה רשמיות ליצירה וניהול סיסמאות חשבון הממשלה שלך"
      },
      "technical": {
        "title": "טכני",
        "readTime": "3 דקות קריאה",
        "subtitle": "מדריך תמיכה טכנית",
        "description": "תיעוד טכני ומדריכי פתרון בעיות"
      }
    },
    "popularSearches": {
      "title": "חיפושים פופולריים",
      "passwordReset": "איפוס סיסמה",
      "softwareInstallation": "התקנת תוכנה",
      "accessRequest": "בקשת גישה",
      "hardwareSupport": "תמיכה בחומרה",
      "emailSetup": "הגדרת אימייל"
    },
    "quickLinks": {
      "browseServices": "עיין בשירותים",
      "knowledgeBase": "מאגר ידע",
      "testApiConnection": "בדוק חיבור API"
    }
  },
  "catalog": {
    "title": "קטלוג שירותים",
    "subtitle": "עיין ובקש שירותים מהקטלוג המקיף שלנו",
    "searchPlaceholder": "חיפוש שירותים...",
    "categoryFilter": "סינון לפי קטגוריה",
    "allCategories": "כל הקטגוריות",
    "noServices": "לא נמצאו שירותים",
    "noServicesDescription": "נסה לשנות את החיפוש או סינון הקטגוריות",
    "showingResults": "מציג {{count}} מתוך {{total}} שירותים",
    "requestService": "בקש שירות",
    "loadingServices": "טוען שירותים...",
    "errorLoading": "שגיאה בטעינת שירותים",
    "tryAgain": "נסה שוב"
  },
  "form": {
    "requestForm": "טופס בקשה",
    "submitRequest": "שלח בקשה",
    "problemDescription": "תיאור התקלה",
    "description": "תיאור",
    "name": "שם",
    "email": "אימייל",
    "phone": "טלפון",
    "category": "קטגוריה",
    "priority": "עדיפות",
    "urgency": "דחיפות",
    "details": "פרטים",
    "attachments": "קבצים מצורפים",
    "comments": "הערות",
    "notes": "הערות",
    "selectOption": "בחר אפשרות",
    "selectDate": "בחר תאריך",
    "selectTime": "בחר שעה",
    "uploadFile": "העלה קובץ",
    "dragAndDrop": "גרור ושחרר קבצים כאן, או לחץ לבחירה",
    "fileSizeLimit": "גודל קובץ מקסימלי: {{size}}MB",
    "supportedFormats": "פורמטים נתמכים: {{formats}}",
    "loadingForm": "טוען טופס...",
    "searchService": "חיפוש שירות"
  },
  "requests": {
    "title": "הבקשות שלי",
    "subtitle": "עקוב ונהל את בקשות השירות שלך",
    "newRequest": "בקשה חדשה",
    "requestNumber": "מספר בקשה",
    "status": "סטטוס",
    "created": "נוצר",
    "updated": "עודכן",
    "priority": "עדיפות",
    "category": "קטגוריה",
    "description": "תיאור",
    "actions": "פעולות",
    "view": "צפייה",
    "edit": "עריכה",
    "delete": "מחיקה",
    "noRequests": "לא נמצאו בקשות",
    "noRequestsDescription": "עדיין לא שלחת בקשות"
  },
  "knowledge": {
    "title": "מאגר ידע",
    "subtitle": "מצא תשובות ותיעוד",
    "searchPlaceholder": "חיפוש במאגר הידע...",
    "categories": "קטגוריות",
    "popularArticles": "מאמרים פופולריים",
    "recentArticles": "מאמרים אחרונים",
    "noArticles": "לא נמצאו מאמרים",
    "noArticlesDescription": "נסה לשנות את קריטריוני החיפוש"
  },
  "knowledgeBase": {
    "title": "מאגר ידע",
    "subtitle": "גלה תשובות מקיפות וחקור את האוסף המובחר שלנו של מאמרי ידע שנועדו לעזור לך להצליח",
    "searchPlaceholder": "חיפוש מאמרי ידע, מדריכים ופתרונות...",
    "loadingArticles": "טוען מאמרים...",
    "errorLoadingArticles": "שגיאה בטעינת מאמרים",
    "tryAgain": "נסה שוב",
    "by": "מאת",
    "helpful": "מועיל",
    "readArticle": "קרא מאמר",
    "noArticlesFound": "לא נמצאו מאמרים",
    "noArticlesForSearch": "לא נמצאו מאמרים עבור \"{{query}}\". נסה מונח חיפוש אחר.",
    "noArticlesAvailable": "אין מאמרים זמינים כרגע.",
    "clearSearch": "נקה חיפוש"
  },
  "messages": {
    "requestSubmitted": "הבקשה נשלחה בהצלחה!",
    "requestCreated": "הבקשה נוצרה בהצלחה!",
    "requestItemCreated": "פריט הבקשה נוצר בהצלחה!",
    "requestNumber": "מספר בקשה: {{number}}",
    "requestItemNumber": "פריט בקשה: {{number}}",
    "statusSubmitted": "סטטוס: נשלח",
    "processingMessage": "הבקשה שלך נוצרה ב-ServiceNow ונמצאת בעיבוד.",
    "errorSubmitting": "שגיאה בשליחת הבקשה",
    "errorLoading": "שגיאה בטעינת נתונים",
    "networkError": "שגיאת רשת. בדוק את החיבור שלך.",
    "validationError": "בדוק את הקלט שלך ונסה שוב.",
    "sessionExpired": "הסשן שלך פג תוקף. רענן את הדף.",
    "unauthorized": "אין לך הרשאה לבצע פעולה זו.",
    "notFound": "המשאב המבוקש לא נמצא."
  },
  "status": {
    "draft": "טיוטה",
    "submitted": "נשלח",
    "inProgress": "בתהליך",
    "pending": "ממתין",
    "approved": "אושר",
    "rejected": "נדחה",
    "completed": "הושלם",
    "cancelled": "בוטל",
    "closed": "סגור"
  },
  "priority": {
    "low": "נמוכה",
    "medium": "בינונית",
    "high": "גבוהה",
    "critical": "קריטית"
  },
  "urgency": {
    "low": "נמוכה",
    "medium": "בינונית",
    "high": "גבוהה",
    "critical": "קריטית"
  },
  "categories": {
    "software": "תוכנה",
    "hardware": "חומרה",
    "network": "רשת",
    "access": "גישה",
    "office": "משרד",
    "template": "ניהול תבניות",
    "roleDelegation": "האצלת תפקידים",
    "applicationAccess": "גישה ליישומים וחשבונות",
    "maor": "מאור"
  },
  "language": {
    "en": "English",
    "he": "עברית",
    "ar": "العربية",
    "switchLanguage": "החלף שפה"
  }
};

const arTranslations = {
  "common": {
    "loading": "جاري التحميل...",
    "error": "خطأ",
    "success": "نجح",
    "cancel": "إلغاء",
    "submit": "إرسال",
    "save": "حفظ",
    "delete": "حذف",
    "edit": "تعديل",
    "close": "إغلاق",
    "back": "رجوع",
    "next": "التالي",
    "previous": "السابق",
    "search": "بحث",
    "filter": "تصفية",
    "clear": "مسح",
    "apply": "تطبيق",
    "reset": "إعادة تعيين",
    "showMore": "عرض المزيد",
    "showLess": "عرض أقل",
    "noResults": "لم يتم العثور على نتائج",
    "noData": "لا توجد بيانات متاحة",
    "noDescription": "لا يوجد وصف متاح",
    "required": "مطلوب",
    "optional": "اختياري"
  },
  "navigation": {
    "home": "الرئيسية",
    "serviceCatalog": "كتالوج الخدمات",
    "knowledgeBase": "قاعدة المعرفة",
    "myRequests": "طلباتي",
    "storedRequests": "الطلبات المحفوظة"
  },
  "header": {
    "brandName": "البوابة الخارجية",
    "searchPlaceholder": "البحث في الخدمات...",
    "themeToggle": "تبديل المظهر",
    "mobileMenu": "قائمة الجوال"
  },
  "home": {
    "hero": {
      "title": "مرحباً بكم في البوابة الخارجية لوزارة المالية",
      "description": "الوصول إلى خدمات الحكومة والموارد بسهولة",
      "subtitle": "الوصول إلى خدمات الحكومة والموارد بسهولة",
      "browseServices": "تصفح الخدمات",
      "learnMore": "اعرف المزيد"
    },
    "search": {
      "placeholder": "البحث في الخدمات, الدلائل والموارد..."
    },
    "quickAccess": {
      "title": "الوصول السريع",
      "subtitle": "الخدمات والموارد الأكثر شعبية"
    },
    "quickAccessPortal": {
      "title": "بوابة الوصول السريع",
      "description": "الوصول إلى الخدمات والموارد الأكثر استخداماً",
      "serviceCatalog": {
        "title": "كتالوج الخدمات",
        "description": "تصفح واطلب خدمات الحكومة"
      },
      "knowledgeBase": {
        "title": "قاعدة المعرفة",
        "description": "ابحث عن الإجابات والتوثيق"
      },
      "myRequests": {
        "title": "طلباتي",
        "description": "تتبع وإدارة طلبات الخدمة الخاصة بك"
      }
    },
    "featuredArticles": {
      "title": "المقالات المميزة",
      "subtitle": "أحدث التحديثات والمعلومات المهمة"
    },
    "featuredResources": {
      "title": "الموارد المميزة",
      "description": "أدلة مفيدة ومعلومات مهمة",
      "readArticle": "اقرأ المقال",
      "userGuide": {
        "title": "دليل المستخدم",
        "readTime": "5 دقائق قراءة",
        "subtitle": "كيفية تقديم طلب خدمة",
        "description": "دليل شامل لتقديم ومتابعة طلبات الخدمة من خلال بوابة وزارة المالية"
      },
      "security": {
        "title": "الأمان",
        "readTime": "4 دقائق قراءة",
        "subtitle": "إرشادات أمان كلمات المرور",
        "description": "إرشادات الأمان الرسمية لإنشاء وإدارة كلمات مرور حساب الحكومة"
      },
      "technical": {
        "title": "تقني",
        "readTime": "3 دقائق قراءة",
        "subtitle": "دليل الدعم التقني",
        "description": "التوثيق التقني وأدلة استكشاف الأخطاء"
      }
    },
    "popularSearches": {
      "title": "البحث الشائع",
      "passwordReset": "إعادة تعيين كلمة المرور",
      "softwareInstallation": "تثبيت البرامج",
      "accessRequest": "طلب الوصول",
      "hardwareSupport": "دعم الأجهزة",
      "emailSetup": "إعداد البريد الإلكتروني"
    },
    "quickLinks": {
      "browseServices": "تصفح الخدمات",
      "knowledgeBase": "قاعدة المعرفة",
      "testApiConnection": "اختبار اتصال API"
    }
  },
  "catalog": {
    "title": "كتالوج الخدمات",
    "subtitle": "تصفح واطلب الخدمات من كتالوجنا الشامل",
    "searchPlaceholder": "البحث في الخدمات...",
    "categoryFilter": "تصفية حسب الفئة",
    "allCategories": "كل الفئات",
    "noServices": "لم يتم العثور على خدمات",
    "noServicesDescription": "حاول تعديل البحث أو تصفية الفئات",
    "showingResults": "عرض {{count}} من {{total}} خدمة",
    "requestService": "طلب خدمة",
    "loadingServices": "جاري تحميل الخدمات...",
    "errorLoading": "خطأ في تحميل الخدمات",
    "tryAgain": "حاول مرة أخرى"
  },
  "form": {
    "requestForm": "نموذج الطلب",
    "submitRequest": "إرسال الطلب",
    "problemDescription": "وصف المشكلة",
    "description": "الوصف",
    "name": "الاسم",
    "email": "البريد الإلكتروني",
    "phone": "الهاتف",
    "category": "الفئة",
    "priority": "الأولوية",
    "urgency": "الاستعجال",
    "details": "التفاصيل",
    "attachments": "المرفقات",
    "comments": "التعليقات",
    "notes": "الملاحظات",
    "selectOption": "اختر خياراً",
    "selectDate": "اختر التاريخ",
    "selectTime": "اختر الوقت",
    "uploadFile": "رفع ملف",
    "dragAndDrop": "اسحب وأفلت الملفات هنا، أو انقر للاختيار",
    "fileSizeLimit": "حد حجم الملف: {{size}} ميجابايت",
    "supportedFormats": "الصيغ المدعومة: {{formats}}",
    "loadingForm": "جاري تحميل النموذج...",
    "searchService": "البحث في الخدمة"
  },
  "requests": {
    "title": "طلباتي",
    "subtitle": "تتبع وإدارة طلبات الخدمة الخاصة بك",
    "newRequest": "طلب جديد",
    "requestNumber": "رقم الطلب",
    "status": "الحالة",
    "created": "تم الإنشاء",
    "updated": "تم التحديث",
    "priority": "الأولوية",
    "category": "الفئة",
    "description": "الوصف",
    "actions": "الإجراءات",
    "view": "عرض",
    "edit": "تعديل",
    "delete": "حذف",
    "noRequests": "لم يتم العثور على طلبات",
    "noRequestsDescription": "لم تقم بإرسال أي طلبات بعد"
  },
  "knowledge": {
    "title": "قاعدة المعرفة",
    "subtitle": "ابحث عن الإجابات والتوثيق",
    "searchPlaceholder": "البحث في قاعدة المعرفة...",
    "categories": "الفئات",
    "popularArticles": "المقالات الشائعة",
    "recentArticles": "المقالات الحديثة",
    "noArticles": "لم يتم العثور على مقالات",
    "noArticlesDescription": "حاول تعديل معايير البحث"
  },
  "knowledgeBase": {
    "title": "قاعدة المعرفة",
    "subtitle": "اكتشف إجابات شاملة واستكشف مجموعتنا المختارة من مقالات المعرفة المصممة لمساعدتك على النجاح",
    "searchPlaceholder": "البحث في مقالات المعرفة والأدلة والحلول...",
    "loadingArticles": "جاري تحميل المقالات...",
    "errorLoadingArticles": "خطأ في تحميل المقالات",
    "tryAgain": "حاول مرة أخرى",
    "by": "بواسطة",
    "helpful": "مفيد",
    "readArticle": "اقرأ المقال",
    "noArticlesFound": "لم يتم العثور على مقالات",
    "noArticlesForSearch": "لم يتم العثور على مقالات لـ \"{{query}}\". جرب مصطلح بحث مختلف.",
    "noArticlesAvailable": "لا توجد مقالات متاحة في الوقت الحالي.",
    "clearSearch": "مسح البحث"
  },
  "messages": {
    "requestSubmitted": "تم إرسال الطلب بنجاح!",
    "requestCreated": "تم إنشاء الطلب بنجاح!",
    "requestItemCreated": "تم إنشاء عنصر الطلب بنجاح!",
    "requestNumber": "رقم الطلب: {{number}}",
    "requestItemNumber": "عنصر الطلب: {{number}}",
    "statusSubmitted": "الحالة: تم الإرسال",
    "processingMessage": "تم إنشاء طلبك في ServiceNow وهو قيد المعالجة.",
    "errorSubmitting": "خطأ في إرسال الطلب",
    "errorLoading": "خطأ في تحميل البيانات",
    "networkError": "خطأ في الشبكة. تحقق من اتصالك.",
    "validationError": "تحقق من إدخالك وحاول مرة أخرى.",
    "sessionExpired": "انتهت صلاحية جلستك. أعد تحميل الصفحة.",
    "unauthorized": "غير مصرح لك بتنفيذ هذا الإجراء.",
    "notFound": "لم يتم العثور على المورد المطلوب."
  },
  "status": {
    "draft": "مسودة",
    "submitted": "تم الإرسال",
    "inProgress": "قيد التنفيذ",
    "pending": "في الانتظار",
    "approved": "تمت الموافقة",
    "rejected": "مرفوض",
    "completed": "مكتمل",
    "cancelled": "ملغي",
    "closed": "مغلق"
  },
  "priority": {
    "low": "منخفضة",
    "medium": "متوسطة",
    "high": "عالية",
    "critical": "حرجة"
  },
  "urgency": {
    "low": "منخفضة",
    "medium": "متوسطة",
    "high": "عالية",
    "critical": "حرجة"
  },
  "categories": {
    "software": "البرمجيات",
    "hardware": "الأجهزة",
    "network": "الشبكة",
    "access": "الوصول",
    "office": "المكتب",
    "template": "إدارة القوالب",
    "roleDelegation": "تفويض الأدوار",
    "applicationAccess": "الوصول للتطبيقات والحسابات",
    "maor": "מאור"
  },
  "language": {
    "en": "English",
    "he": "עברית",
    "ar": "العربية",
    "switchLanguage": "تغيير اللغة"
  }
};

const resources = {
  en: {
    translation: enTranslations,
  },
  he: {
    translation: heTranslations,
  },
  ar: {
    translation: arTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    react: {
      useSuspense: false,
    },
  });

// Set document direction based on language
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'he' || lng === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Set initial direction
const currentLang = i18n.language || 'en';
const isRTL = currentLang === 'he' || currentLang === 'ar';
document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
document.documentElement.lang = currentLang;

export default i18n;