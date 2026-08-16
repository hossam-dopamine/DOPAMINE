/* ==========================================================================
   JAVASCRIPT CORE - TASK PAYOUT MANAGER
   Features: Bilingual (AR/EN), CRUD, CSV Export/Import, LocalStorage, Printing
   ========================================================================== */

// --- Translation Dictionary ---
const i18n = {
    ar: {
        "app-title": "DOPAMINE-SERVICE",
        "add-employee": "إضافة موظف جديد",
        "employees-list": "قائمة الموظفين",
        "search-employee-placeholder": "ابحث عن موظف...",
        "welcome-msg": "لوحة التحكم والمستحقات",
        "export": "تصدير البيانات",
        "import": "استيراد البيانات",
        "clear-data": "مسح البيانات",
        "total-employees": "إجمالي الموظفين",
        "total-tasks": "المهام المكتملة",
        "total-gross-egp": "الإجمالي بالجنيه (قبل الخصم)",
        "total-gross-usd": "الإجمالي بالدولار (قبل الخصم)",
        "total-deductions-egp": "خصومات ج.م",
        "total-deductions-usd": "خصومات دولار",
        "total-net-egp": "صافي المستحقات (ج.م)",
        "total-net-usd": "صافي المستحقات (دولار)",
        "deduction-rate": "نسبة الخصم الافتراضية:",
        "edit-profile": "تعديل الملف",
        "delete-profile": "حذف الموظف",
        "add-new-task": "إضافة مهمة جديدة",
        "task-number": "رقم التاسك/المهمة",
        "task-title": "اسم/وصف المهمة",
        "payout-gross": "القيمة قبل الخصم",
        "custom-deduction": "نسبة الخصم (%)",
        "deduction-help": "اتركه فارغاً لاستخدام النسبة الافتراضية للموظف",
        "task-status": "حالة المهمة",
        "status-pending": "قيد التنفيذ",
        "status-completed": "مكتملة",
        "status-paid": "تم الدفع",
        "add-task": "تسجيل المهمة",
        "print-report": "طباعة تقرير",
        "all-tasks": "كل المهام",
        "th-task-num": "رقم التاسك",
        "th-task-title": "المهمة",
        "th-gross": "قبل الخصم",
        "th-deduction": "نسبة الخصم",
        "th-net": "الصافي",
        "th-status": "الحالة",
        "th-actions": "إجراءات",
        "no-tasks": "لا توجد مهام مسجلة لهذا الموظف بعد.",
        "placeholder-title": "مرحباً بك في نظام حسابات المهام",
        "placeholder-desc": "يرجى اختيار موظف من القائمة الجانبية لعرض مهامه، أو إضافة موظف جديد للبدء.",
        "modal-add-employee-title": "إضافة موظف جديد",
        "modal-edit-employee-title": "تعديل بيانات الموظف",
        "employee-name-label": "اسم الموظف",
        "employee-role-label": "المسمى الوظيفي",
        "employee-deduction-label": "نسبة الخصم الافتراضية (%)",
        "employee-deduction-help": "النسبة التي سيتم خصمها تلقائياً من قيمة كل مهمة ما لم يحدد خلاف ذلك",
        "cancel": "إلغاء",
        "save": "حفظ",
        
        // Dynamic Toasts & Alerts
        "confirm-clear": "هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذه الخطوة!",
        "confirm-delete-employee": "هل أنت متأكد من حذف هذا الموظف وجميع المهام المرتبطة به؟",
        "confirm-delete-task": "هل أنت متأكد من حذف هذه المهمة؟",
        "toast-employee-added": "تمت إضافة الموظف بنجاح!",
        "toast-employee-updated": "تم تحديث بيانات الموظف بنجاح!",
        "toast-employee-deleted": "تم حذف الموظف بنجاح!",
        "toast-task-added": "تمت إضافة المهمة وحساب المستحقات بنجاح!",
        "toast-task-deleted": "تم حذف المهمة وتحديث الحسابات بنجاح!",
        "toast-status-updated": "تمت تحديث حالة المهمة بنجاح!",
        "toast-data-cleared": "تم مسح جميع البيانات بنجاح!",
        "toast-data-exported": "تم تصدير البيانات بنجاح!",
        "toast-data-imported": "تم استيراد البيانات بنجاح!",
        "toast-import-fail": "فشل استيراد الملف، يرجى التأكد من اختيار ملف JSON صحيح.",
        "payout-currency": "ج.م.",
        "rate-label": "سعر الصرف:",
        "toast-rate-synced": "تم مزامنة سعر الصرف بنجاح!",
        "toast-rate-sync-fail": "فشل جلب سعر الصرف. يرجى تعديله يدوياً.",
        "all-months": "كل الشهور",
        "task-month-label": "شهر المهمة",
        "month-jan": "يناير",
        "month-feb": "فبراير",
        "month-mar": "مارس",
        "month-apr": "أبريل",
        "month-may": "مايو",
        "month-jun": "يونيو",
        "month-jul": "يوليو",
        "month-aug": "أغسطس",
        "month-sep": "سبتمبر",
        "month-oct": "أكتوبر",
        "month-nov": "نوفمبر",
        "month-dec": "ديسمبر",
        "manager-title": "المدير (الحسابات العامة)",
        "manager-dashboard-title": "لوحة تحكم المدير العام",
        "manager-dashboard-desc": "عرض مستحقات جميع الموظفين وإجمالي الحسابات العامة.",
        "print-global-report": "طباعة التقرير الشامل",
        "employees-summary": "ملخص حسابات الموظفين",
        "th-employee-name": "الموظف",
        "th-employee-role": "المسمى الوظيفي",
        "th-completed-tasks": "المهام المكتملة",
        "th-manager-gross-egp": "إجمالي ج.م",
        "th-manager-gross-usd": "إجمالي USD",
        "th-manager-net-egp": "صافي ج.م",
        "th-manager-net-usd": "صافي USD",
        "prompt-password": "أدخل كلمة المرور لدخول لوحة تحكم المدير:",
        "toast-invalid-password": "كلمة مرور خاطئة!",
        "password-modal-title": "دخول لوحة المدير",
        "employee-payment-method-label": "طريقة الدفع الافتراضية",
        "employee-payment-details-label": "تفاصيل الدفع (رقم الهاتف / العنوان)",
        "payment-instapay": "انستا باي (InstaPay)",
        "payment-vodafone": "فودافون كاش (Vodafone Cash)",
        "payment-cash": "نقدي (Cash)",
        "payment-method-text": "طريقة الدفع:",
        "total-gross-merged": "إجمالي قبل الخصم",
        "total-deductions-merged": "خصم نسبة الموقع",
        "total-paid-merged": "إجمالي المدفوع",
        "total-due-merged": "الصافي المستحق الحالي",
        "tasks-unit": "مهمة مكتملة",
        "fixed-deduction-label": "الخصم الثابت",
        "task-type-label": "نوع العملية",
        "type-task": "مهمة جديدة (مستحقات)",
        "type-withdrawal": "عملية سحب (مسحوبات)",
        "task-type-withdrawal": "عملية سحب",
        "export-csv": "تصدير CSV",
        "toast-csv-exported": "تم تصدير كشف الحساب كملف CSV بنجاح!",
        "credentials-section-title": "بيانات الحساب والـ VPN (اختياري)",
        "task-email-label": "البريد الإلكتروني (Email)",
        "task-password-label": "كلمة المرور (Password)",
        "task-character-label": "اسم الشخصية (Character)",
        "task-vpn-label": "الـ VPN (Location)",
        "credentials-modal-title": "بيانات الحساب والـ VPN",
        "confirm-delete-task": "هل أنت تأكد من حذف هذه المهمة؟",
        "create-account": "إنشاء الحساب",
        "employee-accounts": "إنشاء حسابات للموظفين",
        "copy": "نسخ",
        "copied": "تم النسخ!",
        "close": "إغلاق",
        "delay-deduction-label": "خصم التأخير",
        "advance-loan-label": "السلفة",
        "employee-avatar-label": "صورة الموظف",
        "select-image": "اختر صورة",
        "remove-image": "حذف",
        "tasks-list": "سجل المهام",
        "edit-task-modal-title": "تعديل بيانات المهمة"
    },
    en: {
        "app-title": "DOPAMINE-SERVICE",
        "add-employee": "Add Employee",
        "employees-list": "Employees List",
        "search-employee-placeholder": "Search employee...",
        "welcome-msg": "Dashboard & Payouts",
        "export": "Export Data",
        "import": "Import Data",
        "clear-data": "Clear Data",
        "total-employees": "Total Employees",
        "total-tasks": "Completed Tasks",
        "total-gross-egp": "Gross Payout (EGP)",
        "total-gross-usd": "Gross Payout (USD)",
        "total-deductions-egp": "Total Deductions (EGP)",
        "total-deductions-usd": "Total Deductions (USD)",
        "total-net-egp": "Net Payout (EGP)",
        "total-net-usd": "Net Payout (USD)",
        "deduction-rate": "Default Deduction Rate:",
        "edit-profile": "Edit Profile",
        "delete-profile": "Delete Employee",
        "add-new-task": "Add New Task",
        "task-number": "Task Number",
        "task-title": "Task Name/Description",
        "payout-gross": "Gross Amount",
        "custom-deduction": "Deduction Rate (%)",
        "deduction-help": "Leave blank to use employee default rate",
        "task-status": "Task Status",
        "status-pending": "Pending",
        "status-completed": "Completed",
        "status-paid": "Paid",
        "add-task": "Register Task",
        "print-report": "Print Report",
        "all-tasks": "All Tasks",
        "th-task-num": "Task #",
        "th-task-title": "Task",
        "th-gross": "Gross",
        "th-deduction": "Deduction %",
        "th-net": "Net",
        "th-status": "Status",
        "th-actions": "Actions",
        "no-tasks": "No tasks registered for this employee yet.",
        "placeholder-title": "Welcome to Task Payout Manager",
        "placeholder-desc": "Please select an employee from the sidebar to view tasks, or add a new employee to start.",
        "modal-add-employee-title": "Add New Employee",
        "modal-edit-employee-title": "Edit Employee Details",
        "employee-name-label": "Employee Name",
        "employee-role-label": "Job Title",
        "employee-deduction-label": "Default Deduction (%)",
        "employee-deduction-help": "Deduction percentage applied automatically to each task unless specified otherwise",
        "cancel": "Cancel",
        "save": "Save",
        
        // Dynamic Toasts & Alerts
        "confirm-clear": "Are you sure you want to clear all data? This action cannot be undone!",
        "confirm-delete-employee": "Are you sure you want to delete this employee and all their associated tasks?",
        "confirm-delete-task": "Are you sure you want to delete this task?",
        "toast-employee-added": "Employee added successfully!",
        "toast-employee-updated": "Employee details updated successfully!",
        "toast-employee-deleted": "Employee deleted successfully!",
        "toast-task-added": "Task added and payouts computed successfully!",
        "toast-task-deleted": "Task deleted and payouts updated successfully!",
        "toast-status-updated": "Task status updated successfully!",
        "toast-data-cleared": "All data cleared successfully!",
        "toast-data-exported": "Data exported successfully!",
        "toast-data-imported": "Data imported successfully!",
        "toast-import-fail": "Import failed. Please ensure the file is a valid JSON backup.",
        "payout-currency": "EGP",
        "rate-label": "Exchange Rate:",
        "toast-rate-synced": "Exchange rate synced successfully!",
        "toast-rate-sync-fail": "Failed to fetch exchange rate. Please set it manually.",
        "all-months": "All Months",
        "task-month-label": "Task Month",
        "month-jan": "January",
        "month-feb": "February",
        "month-mar": "March",
        "month-apr": "April",
        "month-may": "May",
        "month-jun": "June",
        "month-jul": "July",
        "month-aug": "August",
        "month-sep": "September",
        "month-oct": "October",
        "month-nov": "November",
        "month-dec": "December",
        "manager-title": "Manager (Global Accounts)",
        "manager-dashboard-title": "General Manager Dashboard",
        "manager-dashboard-desc": "View payouts for all employees and global account summaries.",
        "print-global-report": "Print Global Report",
        "employees-summary": "Employees Payout Summary",
        "th-employee-name": "Employee",
        "th-employee-role": "Job Title",
        "th-completed-tasks": "Completed Tasks",
        "th-manager-gross-egp": "Gross EGP",
        "th-manager-gross-usd": "Gross USD",
        "th-manager-net-egp": "Net EGP",
        "th-manager-net-usd": "Net USD",
        "prompt-password": "Enter password to access Manager Dashboard:",
        "toast-invalid-password": "Invalid Password!",
        "password-modal-title": "Manager Dashboard Login",
        "employee-payment-method-label": "Default Payment Method",
        "employee-payment-details-label": "Payment Details (Phone / Address)",
        "payment-instapay": "InstaPay",
        "payment-vodafone": "Vodafone Cash",
        "payment-cash": "Cash",
        "payment-method-text": "Payment Method:",
        "total-gross-merged": "Total Gross",
        "total-deductions-merged": "Total Deductions & Loans",
        "total-paid-merged": "Total Paid",
        "total-due-merged": "Current Net Due",
        "tasks-unit": "completed tasks",
        "fixed-deduction-label": "Fixed Deduction",
        "task-type-label": "Operation Type",
        "type-task": "New Task (Earnings)",
        "type-withdrawal": "Withdrawal (Transaction)",
        "task-type-withdrawal": "Withdrawal",
        "export-csv": "Export CSV",
        "toast-csv-exported": "Employee statement exported to CSV successfully!",
        "credentials-section-title": "Account Credentials & VPN (Optional)",
        "task-email-label": "Email Address",
        "task-password-label": "Password",
        "task-character-label": "Character Name",
        "task-vpn-label": "VPN Location",
        "credentials-modal-title": "Account Credentials & VPN",
        "copy": "Copy",
        "copied": "Copied!",
        "close": "Close",
        "delay-deduction-label": "Delay Deduction",
        "advance-loan-label": "Advance / Loan",
        "employee-avatar-label": "Employee Photo",
        "select-image": "Select Image",
        "remove-image": "Remove",
        "tasks-list": "Tasks Record",
        "edit-task-modal-title": "Edit Task Details",
        "login-subtitle": "Login to System",
        "login-username": "Username",
        "login-password": "Password",
        "login-btn": "Login",
        "login-error": "Invalid username or password",
        "logout": "Logout",
        "change-password": "Change Password",
        "current-password": "Current Password",
        "new-password": "New Password",
        "confirm-password": "Confirm Password",
        "password-changed": "Password changed successfully",
        "confirm-delete-task": "Are you sure you want to delete this task?",
        "create-account": "Create Account",
        "employee-accounts": "Employee Accounts"
    }
};

// --- Authentication Module ---
const AUTH_TOKEN_KEY = 'dopamine_auth_token';
const AUTH_USER_KEY = 'dopamine_auth_user';

function getAuthToken() {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

function getAuthUser() {
    try {
        const u = JSON.parse(sessionStorage.getItem(AUTH_USER_KEY));
        if (u && u.role) {
            if (!u.tenantId) u.tenantId = 'default_tenant';
            return u;
        }
        const t = getAuthToken();
        if (t) {
            const payload = JSON.parse(atob(t.split('.')[1]));
            return {
                id: payload.id,
                username: payload.username || 'user',
                role: payload.role || 'employee',
                employeeId: payload.employeeId,
                allowedEmployeeIds: payload.allowedEmployeeIds || [],
                tenantId: payload.tenantId || 'default_tenant'
            };
        }
        return null;
    } catch {
        return null;
    }
}

function setAuth(token, user) {
    // Clean legacy localStorage auth tokens
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    // Store in sessionStorage so closing tab/browser auto-logs out
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearAuth() {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}

function isAuthenticated() {
    const token = getAuthToken();
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch { return false; }
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getAuthToken()
    };
}

// --- Application State ---
let state = {
    currentLanguage: 'ar',
    selectedEmployeeId: null,
    viewMode: 'placeholder', // 'placeholder', 'employee', 'manager'
    isManagerUnlocked: false,
    exchangeRate: 50.00, // Default exchange rate
    employees: []
};

// --- Performance Utilities (Debounce & RAF Lucide Scheduler) ---
function debounce(fn, delay = 150) {
    let timeoutId = null;
    return function(...args) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

let lucideSchedulePending = false;
function scheduleLucideIcons() {
    if (lucideSchedulePending) return;
    lucideSchedulePending = true;
    requestAnimationFrame(() => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
        lucideSchedulePending = false;
    });
}

// --- Security: HTML Escape Utility (XSS Protection) ---
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// --- Global Error Boundaries ---
window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
});

// --- Data Structure Validation Helper ---
function validateAndSanitizeState(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (!Array.isArray(obj.employees)) return false;
    
    obj.employees.forEach((emp, eIdx) => {
        if (!emp.id) emp.id = 'emp_' + Date.now() + '_' + eIdx;
        if (!emp.name) emp.name = 'موظف';
        if (!emp.role) emp.role = 'عضو';
        if (typeof emp.defaultDeductionRate !== 'number') emp.defaultDeductionRate = 10;
        if (emp.avatarUrl && typeof emp.avatarUrl === 'string') {
            if (!emp.avatarUrl.startsWith('http://') && !emp.avatarUrl.startsWith('https://') && !emp.avatarUrl.startsWith('data:image/')) {
                emp.avatarUrl = '';
            }
        } else {
            emp.avatarUrl = '';
        }
        if (!Array.isArray(emp.tasks)) emp.tasks = [];
        emp.tasks.forEach((task, tIdx) => {
            if (!task.id) task.id = 'task_' + Date.now() + '_' + tIdx;
            if (!task.taskNumber) task.taskNumber = '#000';
            if (!task.title) task.title = 'مهمة';
            if (typeof task.gross !== 'number') task.gross = parseFloat(task.gross) || 0;
            if (task.gross < 0) task.gross = 0;
            if (!task.currency) task.currency = 'USD';
            if (typeof task.deductionRate !== 'number') task.deductionRate = emp.defaultDeductionRate;
            if (!task.status) task.status = 'pending';
        });
    });
    if (!obj.exchangeRate || typeof obj.exchangeRate !== 'number') obj.exchangeRate = 50.00;
    if (!obj.currentLanguage) obj.currentLanguage = 'ar';
    return true;
}

// Load state from local storage or server data.json
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (validateAndSanitizeState(parsed)) {
                state = parsed;
            }
        } catch (e) {
            console.error("Error parsing saved state", e);
        }
    } else {
        // Load initial elegant demo data
        state.employees = [
            {
                id: 'emp_' + Date.now() + '_1',
                name: 'أحمد محمود',
                role: 'مطور واجهات أول',
                defaultDeductionRate: 10,
                tasks: [
                    {
                        id: 'task_' + Date.now() + '_1',
                        taskNumber: '#1024',
                        title: 'تصميم لوحة التحكم الرئيسية وتنسيق الألوان',
                        gross: 1200,
                        currency: 'USD',
                        deductionRate: 10,
                        status: 'paid',
                        createdAt: new Date().toISOString()
                    }
                ]
            }
        ];
    }
}

async function loadStateAsync() {
    if (!isAuthenticated()) {
        showLoginOverlay();
        return;
    }
    try {
        const res = await fetch('/api/data', { headers: authHeaders() });
        if (res.status === 401 || res.status === 403) {
            clearAuth();
            showLoginOverlay();
            return;
        }
        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
                const user = getAuthUser();
                if (user && user.role === 'employee') {
                    state.employees = result.data.employees || [];
                    state.exchangeRate = result.data.exchangeRate || 50;
                    state.viewMode = 'employee';
                    const myEmp = user.employeeId ? state.employees.find(e => String(e.id) === String(user.employeeId)) : null;
                    state.selectedEmployeeId = myEmp ? myEmp.id : (state.employees.length > 0 ? state.employees[0].id : null);
                    state.isManagerUnlocked = false;
                } else if (user && user.role === 'leader') {
                    const serverData = result.data;
                    if (validateAndSanitizeState(serverData)) {
                        state.employees = serverData.employees || [];
                        state.exchangeRate = serverData.exchangeRate || state.exchangeRate || 50;
                    }
                    state.viewMode = 'employee';
                    state.selectedEmployeeId = state.employees.length > 0 ? state.employees[0].id : null;
                    state.isManagerUnlocked = true;
                } else {
                    // Admin: merge server data INTO state (preserve UI properties)
                    const serverData = result.data;
                    if (validateAndSanitizeState(serverData)) {
                        state.employees = serverData.employees || [];
                        state.exchangeRate = serverData.exchangeRate || state.exchangeRate || 50;
                    }
                    // Admin always gets full control
                    state.isManagerUnlocked = true;
                }
                state.eurExchangeRate = result.data.eurExchangeRate || state.eurExchangeRate || 55;
                const eurRateInput = document.getElementById('eur-to-egp-rate');
                if (eurRateInput) eurRateInput.value = state.eurExchangeRate;

                state.currentLanguage = state.currentLanguage || localStorage.getItem('task_payout_lang') || 'ar';
                hideLoginOverlay();
                applyRoleRestrictions();
                updateUIVisuals();
                console.log('✅ Loaded data from server successfully!');
                return;
            }
        }
    } catch (e) {
        console.error('Error loading data:', e);
    }
}

// Save state to server
function saveState() {
    if (!isAuthenticated()) {
        showLoginOverlay();
        return;
    }
    const user = getAuthUser();
    if (user && user.role !== 'admin') return; // Only admin can save full state

    fetch('/api/data', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(state)
    }).then(async r => {
        if (r.status === 401 || r.status === 403) {
            clearAuth();
            showLoginOverlay();
            alert(state.currentLanguage === 'ar' ? 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً' : 'Session expired, please log in again');
            return;
        }
        const res = await r.json();
        if (res && res.success) {
            showStorageSyncBadge(true);
        } else {
            showStorageSyncBadge(false);
        }
    }).catch(() => {
        showStorageSyncBadge(false);
    });
}

async function saveTaskApi(task) {
    if (!isAuthenticated() || !task) return;
    try {
        const res = await fetch('/api/data/tasks', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(task)
        });
        if (res.ok) {
            showStorageSyncBadge(true);
        } else {
            showStorageSyncBadge(false);
        }
    } catch (e) {
        showStorageSyncBadge(false);
        console.error('Error saving task via API:', e);
    }
}

async function deleteTaskApi(taskId) {
    if (!isAuthenticated() || !taskId) return;
    try {
        const res = await fetch(`/api/data/tasks/${encodeURIComponent(taskId)}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (res.ok) {
            showStorageSyncBadge(true);
        } else {
            showStorageSyncBadge(false);
        }
    } catch (e) {
        showStorageSyncBadge(false);
        console.error('Error deleting task via API:', e);
    }
}

async function saveEmployeeApi(emp) {
    if (!isAuthenticated() || !emp) return null;
    try {
        const res = await fetch('/api/data/employees', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(emp)
        });
        const data = await res.json();
        if (data && data.success && data.employee) {
            showStorageSyncBadge(true);
            const user = getAuthUser();
            if (user && data.allowedEmployeeIds) {
                user.allowedEmployeeIds = data.allowedEmployeeIds;
                const token = getAuthToken();
                if (token) setAuth(token, user);
            }
            return data.employee;
        }
    } catch (e) {
        showStorageSyncBadge(false);
        console.error('Error saving employee via API:', e);
    }
    return null;
}

async function deleteEmployeeApi(empId) {
    if (!isAuthenticated() || !empId) return false;
    try {
        const res = await fetch(`/api/data/employees/${encodeURIComponent(empId)}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (res.ok) {
            showStorageSyncBadge(true);
            return true;
        } else {
            showStorageSyncBadge(false);
            return false;
        }
    } catch (e) {
        showStorageSyncBadge(false);
        console.error('Error deleting employee via API:', e);
        return false;
    }
}

function showStorageSyncBadge(isFileSaved) {
    const user = getAuthUser();
    if (!user || user.role !== 'admin' || user.username !== 'admin') {
        return; // Only show for Primary Admin
    }
    let badge = document.getElementById('disk-sync-indicator');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'disk-sync-indicator';
        badge.style.cssText = 'position: fixed; bottom: 16px; left: 16px; font-size: 11px; font-weight: 600; padding: 6px 14px; border-radius: 20px; z-index: 999; backdrop-filter: blur(10px); transition: opacity 0.4s ease; opacity: 0; pointer-events: none;';
        document.body.appendChild(badge);
    }
    if (isFileSaved) {
        badge.style.background = 'rgba(16, 185, 129, 0.2)';
        badge.style.border = '1px solid rgba(16, 185, 129, 0.4)';
        badge.style.color = '#10b981';
        badge.innerHTML = '💾 ' + (state.currentLanguage === 'ar' ? 'تم الحفظ تلقائياً في ملف data.json' : 'Saved to data.json');
    } else {
        badge.style.background = 'rgba(255, 153, 0, 0.15)';
        badge.style.border = '1px solid rgba(255, 153, 0, 0.3)';
        badge.style.color = '#ff9900';
        badge.innerHTML = '⚡ ' + (state.currentLanguage === 'ar' ? 'تم الحفظ محلياً في المتصفح' : 'Saved to Browser');
    }
    badge.style.opacity = '1';
    setTimeout(() => {
        if (badge) badge.style.opacity = '0';
    }, 2500);
}

// --- Dynamic Toast System ---
function showToast(key) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const message = i18n[state.currentLanguage][key] || key;
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Translation Engine ---
function updateUIVisuals() {
    const lang = state.currentLanguage;
    
    // Set HTML lang & dir attribute
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Set appropriate font stack on body by reloading standard classes
    if (lang === 'ar') {
        document.getElementById('lang-btn-text').textContent = "English";
    } else {
        document.getElementById('lang-btn-text').textContent = "العربية";
    }

    // Dynamic translate elements containing data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
            el.textContent = i18n[lang][key];
        }
    });

    // Dynamic translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[lang][key]) {
            el.placeholder = i18n[lang][key];
        }
    });

    const searchInput = document.getElementById('task-search-input');
    if (searchInput) {
        searchInput.placeholder = lang === 'ar' ? 'ابحث عن مهمة...' : 'Search tasks...';
    }

    // Format current date
    const dateEl = document.getElementById('current-date-el');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);

    // Refresh general calculations
    calculateDashboardStats();
    
    // Refresh lists
    renderEmployeesList();
    if (state.viewMode === 'employee' && state.selectedEmployeeId) {
        renderEmployeeDetail(state.selectedEmployeeId);
        const reviewRequestsSec = document.getElementById('review-requests-section');
        if (reviewRequestsSec) reviewRequestsSec.style.display = 'none';
        const reviewRequestsBtn = document.getElementById('review-requests-btn');
        if (reviewRequestsBtn) reviewRequestsBtn.classList.remove('active');
    } else if (state.viewMode === 'manager') {
        renderManagerPanel();
        document.getElementById('manager-btn').classList.add('active');
        const reviewRequestsSec = document.getElementById('review-requests-section');
        if (reviewRequestsSec) reviewRequestsSec.style.display = 'none';
        const reviewRequestsBtn = document.getElementById('review-requests-btn');
        if (reviewRequestsBtn) reviewRequestsBtn.classList.remove('active');
    } else if (state.viewMode === 'review-requests') {
        document.getElementById('employee-detail-section').style.display = 'none';
        document.getElementById('manager-panel-section').style.display = 'none';
        document.getElementById('dashboard-placeholder').style.display = 'none';
        document.getElementById('manager-btn').classList.remove('active');
        const reviewRequestsSec = document.getElementById('review-requests-section');
        if (reviewRequestsSec) reviewRequestsSec.style.display = 'block';
        const reviewRequestsBtn = document.getElementById('review-requests-btn');
        if (reviewRequestsBtn) reviewRequestsBtn.classList.add('active');
        fetchAndRenderPendingRequests();
    } else {
        document.getElementById('employee-detail-section').style.display = 'none';
        document.getElementById('manager-panel-section').style.display = 'none';
        const reviewRequestsSec = document.getElementById('review-requests-section');
        if (reviewRequestsSec) reviewRequestsSec.style.display = 'none';
        document.getElementById('dashboard-placeholder').style.display = 'flex';
        document.getElementById('manager-btn').classList.remove('active');
        const reviewRequestsBtn = document.getElementById('review-requests-btn');
        if (reviewRequestsBtn) reviewRequestsBtn.classList.remove('active');
    }
    
    // Refresh Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// --- Calculation Helper Functions ---
function calculateTaskNet(gross, deductionRate, delayDeduction = 0, advance = 0, fixedDeduction = 0) {
    const effectiveGross = gross - fixedDeduction;
    const siteDeduction = effectiveGross * (deductionRate / 100);
    return Math.max(0, effectiveGross - siteDeduction - delayDeduction - advance);
}

function formatCurrency(amount, currency = 'EGP') {
    const lang = state.currentLanguage;
    let dispCurrency = currency;
    if (currency === 'EGP') dispCurrency = lang === 'ar' ? 'ج.م' : 'EGP';
    else if (currency === 'USD') dispCurrency = 'USD ($)';
    else if (currency === 'EUR') dispCurrency = 'EUR (€)';
    return `${(amount || 0).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${dispCurrency}`;
}

async function fetchExchangeRate(isManual = false) {
    const apis = [
        'https://open.er-api.com/v6/latest/USD',
        'https://api.exchangerate-api.com/v4/latest/USD'
    ];

    for (const url of apis) {
        try {
            const response = await fetch(url);
            if (!response.ok) continue;
            const data = await response.json();
            const rateVal = data && data.rates && data.rates.EGP;
            const eurRateVal = data && data.rates && data.rates.EUR ? (rateVal / data.rates.EUR) : null;

            if (rateVal && typeof rateVal === 'number' && rateVal > 0) {
                state.exchangeRate = parseFloat(rateVal.toFixed(2));
                const rateInput = document.getElementById('usd-to-egp-rate');
                if (rateInput) rateInput.value = state.exchangeRate;

                if (eurRateVal && typeof eurRateVal === 'number' && eurRateVal > 0) {
                    state.eurExchangeRate = parseFloat(eurRateVal.toFixed(2));
                    const eurInput = document.getElementById('eur-to-egp-rate');
                    if (eurInput) eurInput.value = state.eurExchangeRate;
                }

                saveState();
                calculateDashboardStats();
                if (state.viewMode === 'employee' && state.selectedEmployeeId) {
                    renderEmployeeDetail(state.selectedEmployeeId);
                } else if (state.viewMode === 'manager') {
                    renderManagerPanel();
                }
                if (isManual) {
                    showToast('toast-rate-synced');
                }
                return;
            }
        } catch (e) {
            console.warn(`Exchange rate API (${url}) failed:`, e);
        }
    }

    if (isManual) {
        showToast('toast-rate-sync-fail');
    }
}

// Calculate Global/Employee Statistics
function calculateDashboardStats() {
    let totalGrossEGP = 0;
    let totalGrossUSD = 0;
    let totalGrossEUR = 0;

    let totalDeductionsEGP = 0;
    let totalDeductionsUSD = 0;
    let totalDeductionsEUR = 0;

    let totalPaidEGP = 0;
    let totalPaidUSD = 0;
    let totalPaidEUR = 0;

    let totalDueEGP = 0;
    let totalDueUSD = 0;
    let totalDueEUR = 0;

    let completedTasksCount = 0;

    const usdRate = state.exchangeRate || 50;
    const eurRate = state.eurExchangeRate || 55;

    // Get dashboard month filter value
    const dbMonthFilter = document.getElementById('dashboard-filter-month');
    const selectedMonth = dbMonthFilter ? dbMonthFilter.value : 'all';

    // Filter calculations by viewMode
    let targetEmployees = [];
    if (state.viewMode === 'employee' && state.selectedEmployeeId) {
        const emp = state.employees.find(e => String(e.id) === String(state.selectedEmployeeId));
        if (emp) targetEmployees = [emp];
    } else if (state.viewMode === 'manager') {
        targetEmployees = state.employees;
    }

    targetEmployees.forEach(emp => {
        let earnings_completed_egp = 0, earnings_completed_usd = 0, earnings_completed_eur = 0;
        let earnings_paid_egp = 0, earnings_paid_usd = 0, earnings_paid_eur = 0;

        let withdrawals_completed_egp = 0, withdrawals_completed_usd = 0, withdrawals_completed_eur = 0;
        let withdrawals_paid_egp = 0, withdrawals_paid_usd = 0, withdrawals_paid_eur = 0;

        emp.tasks.forEach(task => {
            if (selectedMonth !== 'all' && task.month !== selectedMonth) return;

            const isWithdrawal = task.type === 'withdrawal';
            const currency = task.currency || 'USD';
            const taskUsdRate = task.exchangeRate || usdRate;
            const taskEurRate = eurRate;

            let egpVal = 0, usdVal = 0, eurVal = 0;

            if (currency === 'EGP') {
                egpVal = task.gross;
                usdVal = task.gross / taskUsdRate;
                eurVal = task.gross / taskEurRate;
            } else if (currency === 'EUR') {
                eurVal = task.gross;
                egpVal = task.gross * taskEurRate;
                usdVal = (task.gross * taskEurRate) / taskUsdRate;
            } else { // USD
                usdVal = task.gross;
                egpVal = task.gross * taskUsdRate;
                eurVal = (task.gross * taskUsdRate) / taskEurRate;
            }

            if (isWithdrawal) {
                if (task.status === 'completed') {
                    withdrawals_completed_egp += egpVal;
                    withdrawals_completed_usd += usdVal;
                    withdrawals_completed_eur += eurVal;
                } else if (task.status === 'paid') {
                    withdrawals_paid_egp += egpVal;
                    withdrawals_paid_usd += usdVal;
                    withdrawals_paid_eur += eurVal;
                }
            } else { // Regular task
                if (task.status === 'completed' || task.status === 'paid') {
                    completedTasksCount++;

                    const delay = task.delayDeduction || 0;
                    const adv = task.advance || 0;
                    const fixed = task.fixedDeduction || 0;
                    const taskNet = calculateTaskNet(task.gross, task.deductionRate, delay, adv, fixed);
                    const grossMinusFixed = task.gross - fixed;
                    const taskDeduction = grossMinusFixed * (task.deductionRate / 100);

                    let netEgp = 0, netUsd = 0, netEur = 0;
                    let grossEgp = 0, grossUsd = 0, grossEur = 0;
                    let dedEgp = 0, dedUsd = 0, dedEur = 0;

                    if (currency === 'EGP') {
                        grossEgp = grossMinusFixed; grossUsd = grossMinusFixed / taskUsdRate; grossEur = grossMinusFixed / taskEurRate;
                        dedEgp = taskDeduction; dedUsd = taskDeduction / taskUsdRate; dedEur = taskDeduction / taskEurRate;
                        netEgp = taskNet; netUsd = taskNet / taskUsdRate; netEur = taskNet / taskEurRate;
                    } else if (currency === 'EUR') {
                        grossEur = grossMinusFixed; grossEgp = grossMinusFixed * taskEurRate; grossUsd = (grossMinusFixed * taskEurRate) / taskUsdRate;
                        dedEur = taskDeduction; dedEgp = taskDeduction * taskEurRate; dedUsd = (taskDeduction * taskEurRate) / taskUsdRate;
                        netEur = taskNet; netEgp = taskNet * taskEurRate; netUsd = (taskNet * taskEurRate) / taskUsdRate;
                    } else { // USD
                        grossUsd = grossMinusFixed; grossEgp = grossMinusFixed * taskUsdRate; grossEur = (grossMinusFixed * taskUsdRate) / taskEurRate;
                        dedUsd = taskDeduction; dedEgp = taskDeduction * taskUsdRate; dedEur = (taskDeduction * taskUsdRate) / taskEurRate;
                        netUsd = taskNet; netEgp = taskNet * taskUsdRate; netEur = (taskNet * taskUsdRate) / taskEurRate;
                    }

                    totalGrossEGP += grossEgp; totalGrossUSD += grossUsd; totalGrossEUR += grossEur;
                    totalDeductionsEGP += dedEgp; totalDeductionsUSD += dedUsd; totalDeductionsEUR += dedEur;

                    if (task.status === 'paid') {
                        earnings_paid_egp += netEgp; earnings_paid_usd += netUsd; earnings_paid_eur += netEur;
                    } else if (task.status === 'completed') {
                        earnings_completed_egp += netEgp; earnings_completed_usd += netUsd; earnings_completed_eur += netEur;
                    }
                }
            }
        });

        // Apply EGP balance formula
        const activeWithdrawalsEGP = withdrawals_completed_egp + withdrawals_paid_egp;
        const empDueEGP = Math.max(0, earnings_completed_egp - activeWithdrawalsEGP);
        const empPaidEGP = earnings_paid_egp + activeWithdrawalsEGP;

        // Apply USD balance formula
        const activeWithdrawalsUSD = withdrawals_completed_usd + withdrawals_paid_usd;
        const empDueUSD = Math.max(0, earnings_completed_usd - activeWithdrawalsUSD);
        const empPaidUSD = earnings_paid_usd + activeWithdrawalsUSD;

        // Apply EUR balance formula
        const activeWithdrawalsEUR = withdrawals_completed_eur + withdrawals_paid_eur;
        const empDueEUR = Math.max(0, earnings_completed_eur - activeWithdrawalsEUR);
        const empPaidEUR = earnings_paid_eur + activeWithdrawalsEUR;

        totalDueEGP += empDueEGP; totalDueUSD += empDueUSD; totalDueEUR += empDueEUR;
        totalPaidEGP += empPaidEGP; totalPaidUSD += empPaidUSD; totalPaidEUR += empPaidEUR;
    });

    document.getElementById('stat-total-tasks').textContent = completedTasksCount;

    document.getElementById('stat-total-gross-egp').textContent = formatCurrency(totalGrossEGP, 'EGP');
    document.getElementById('stat-total-gross-usd').textContent = `${formatCurrency(totalGrossUSD, 'USD')} • ${formatCurrency(totalGrossEUR, 'EUR')}`;

    document.getElementById('stat-total-deductions-egp').textContent = formatCurrency(totalDeductionsEGP, 'EGP');
    document.getElementById('stat-total-deductions-usd').textContent = `${formatCurrency(totalDeductionsUSD, 'USD')} • ${formatCurrency(totalDeductionsEUR, 'EUR')}`;

    document.getElementById('stat-total-paid-egp').textContent = formatCurrency(totalPaidEGP, 'EGP');
    document.getElementById('stat-total-paid-usd').textContent = `${formatCurrency(totalPaidUSD, 'USD')} • ${formatCurrency(totalPaidEUR, 'EUR')}`;

    document.getElementById('stat-total-due-egp').textContent = formatCurrency(totalDueEGP, 'EGP');
    document.getElementById('stat-total-due-usd').textContent = `${formatCurrency(totalDueUSD, 'USD')} • ${formatCurrency(totalDueEUR, 'EUR')}`;

    // Update print month title
    const activeMonthText = selectedMonth === 'all' ? (state.currentLanguage === 'ar' ? 'كل الشهور' : 'All Months') : i18n[state.currentLanguage]['month-' + selectedMonth.slice(0, 3)];
    const printMonthTitle = document.getElementById('print-month-title');
    if (printMonthTitle) {
        printMonthTitle.textContent = ` - (${activeMonthText})`;
    }
}

// --- Sidebar Employee Navigation Rendering ---
function renderEmployeesList() {
    const searchInput = document.getElementById('employee-search').value.toLowerCase();
    const container = document.getElementById('employees-list-container');
    container.innerHTML = '';

    const filtered = state.employees.filter(emp => emp.name.toLowerCase().includes(searchInput));

    filtered.forEach(emp => {
        const item = document.createElement('div');
        item.className = `employee-item ${state.selectedEmployeeId === emp.id ? 'active' : ''}`;
        item.setAttribute('data-id', emp.id);
        
        // Initial letter for Avatar
        const avatarLetter = emp.name.trim().charAt(0).toUpperCase();
        
        const safeAvatarUrl = (emp.avatarUrl && (emp.avatarUrl.startsWith('http://') || emp.avatarUrl.startsWith('https://') || emp.avatarUrl.startsWith('data:image/')))
            ? escapeHTML(emp.avatarUrl)
            : '';
        const avatarHTML = safeAvatarUrl 
            ? `<img src="${safeAvatarUrl}" class="avatar-img">`
            : `<div class="avatar">${avatarLetter}</div>`;
        
        item.innerHTML = `
            <div class="employee-info-wrapper">
                ${avatarHTML}
                <div class="employee-text">
                    <span class="employee-name">${escapeHTML(emp.name)}</span>
                    <span class="employee-role">${escapeHTML(emp.role)}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="task-count-badge">${emp.tasks.length}</span>
                <div class="employee-sort-actions">
                    <button class="btn-sort btn-move-up" title="Move Up"><i data-lucide="chevron-up"></i></button>
                    <button class="btn-sort btn-move-down" title="Move Down"><i data-lucide="chevron-down"></i></button>
                </div>
            </div>
        `;

        // Attach event listeners programmatically to bypass inline SVG bubbling issues
        const btnUp = item.querySelector('.btn-move-up');
        const btnDown = item.querySelector('.btn-move-down');
        
        if (btnUp) {
            btnUp.addEventListener('click', (e) => {
                e.stopPropagation();
                moveEmployeeUp(e, emp.id);
            });
        }
        if (btnDown) {
            btnDown.addEventListener('click', (e) => {
                e.stopPropagation();
                moveEmployeeDown(e, emp.id);
            });
        }

        item.addEventListener('click', () => {
            selectEmployee(emp.id);
        });

        container.appendChild(item);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function selectEmployee(id) {
    state.selectedEmployeeId = id;
    state.viewMode = 'employee';
    const user = getAuthUser();
    if (!user || user.role !== 'admin') {
        state.isManagerUnlocked = false;
    }
    
    // Toggle UI panels
    document.getElementById('dashboard-placeholder').style.display = 'none';
    document.getElementById('manager-panel-section').style.display = 'none';
    document.getElementById('employee-detail-section').style.display = 'block';
    document.getElementById('manager-btn').classList.remove('active');

    // Hide review-requests section
    const reviewSec = document.getElementById('review-requests-section');
    if (reviewSec) reviewSec.style.display = 'none';
    const reviewBtn = document.getElementById('review-requests-btn');
    if (reviewBtn) reviewBtn.classList.remove('active');

    renderEmployeesList();
    renderEmployeeDetail(id);
    calculateDashboardStats();
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function selectManagerPanel() {
    const user = getAuthUser();
    if (user && user.role === 'admin') {
        state.isManagerUnlocked = true;
        enterManagerDashboard();
        return;
    }
    const modal = document.getElementById('password-modal');
    document.getElementById('password-form').reset();
    document.getElementById('password-error-msg').style.display = 'none';
    modal.classList.add('active');
    
    setTimeout(() => {
        document.getElementById('manager-password-input').focus();
    }, 100);
}

function enterManagerDashboard() {
    state.selectedEmployeeId = null;
    state.viewMode = 'manager';

    // Toggle UI panels
    document.getElementById('dashboard-placeholder').style.display = 'none';
    document.getElementById('employee-detail-section').style.display = 'none';
    document.getElementById('manager-panel-section').style.display = 'block';
    document.getElementById('manager-btn').classList.add('active');

    // Hide review-requests section
    const reviewSec = document.getElementById('review-requests-section');
    if (reviewSec) reviewSec.style.display = 'none';
    const reviewBtn = document.getElementById('review-requests-btn');
    if (reviewBtn) reviewBtn.classList.remove('active');

    renderEmployeesList();
    calculateDashboardStats();
    renderManagerPanel();
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderManagerPanel() {
    const tableBody = document.getElementById('manager-table-body');
    tableBody.innerHTML = '';

    const dbMonthFilter = document.getElementById('dashboard-filter-month');
    const selectedMonth = dbMonthFilter ? dbMonthFilter.value : 'all';

    state.employees.forEach(emp => {
        let empCompletedCount = 0;
        let empGrossEGP = 0;
        let empGrossUSD = 0;

        let earnings_completed_egp = 0;
        let earnings_completed_usd = 0;
        let withdrawals_completed_egp = 0;
        let withdrawals_completed_usd = 0;
        let withdrawals_paid_egp = 0;
        let withdrawals_paid_usd = 0;

        emp.tasks.forEach(task => {
            if (selectedMonth !== 'all' && task.month !== selectedMonth) {
                return;
            }

            const isWithdrawal = task.type === 'withdrawal';
            const currency = task.currency || 'EGP';
            const rate = task.exchangeRate || state.exchangeRate;

            if (isWithdrawal) {
                if (task.status === 'completed') {
                    if (currency === 'EGP') {
                        withdrawals_completed_egp += task.gross;
                        withdrawals_completed_usd += task.gross / rate;
                    } else {
                        withdrawals_completed_usd += task.gross;
                        withdrawals_completed_egp += task.gross * rate;
                    }
                } else if (task.status === 'paid') {
                    if (currency === 'EGP') {
                        withdrawals_paid_egp += task.gross;
                        withdrawals_paid_usd += task.gross / rate;
                    } else {
                        withdrawals_paid_usd += task.gross;
                        withdrawals_paid_egp += task.gross * rate;
                    }
                }
            } else { // Regular task
                if (task.status === 'completed' || task.status === 'paid') {
                    empCompletedCount++;
                    const delay = task.delayDeduction || 0;
                    const adv = task.advance || 0;
                    const fixed = task.fixedDeduction || 0;
                    const netVal = calculateTaskNet(task.gross, task.deductionRate, delay, adv, fixed);
                    const grossMinusFixed = task.gross - fixed;
                    
                    if (currency === 'EGP') {
                        empGrossEGP += grossMinusFixed;
                        empGrossUSD += grossMinusFixed / rate;
                        
                        if (task.status === 'completed') {
                            earnings_completed_egp += netVal;
                            earnings_completed_usd += netVal / rate;
                        }
                    } else {
                        empGrossUSD += grossMinusFixed;
                        empGrossEGP += grossMinusFixed * rate;
                        
                        if (task.status === 'completed') {
                            earnings_completed_usd += netVal;
                            earnings_completed_egp += netVal * rate;
                        }
                    }
                }
            }
        });

        // The remaining Net Due for this employee:
        const activeWithdrawalsEGP = withdrawals_completed_egp + withdrawals_paid_egp;
        const empDueEGP = Math.max(0, earnings_completed_egp - activeWithdrawalsEGP);

        const activeWithdrawalsUSD = withdrawals_completed_usd + withdrawals_paid_usd;
        const empDueUSD = Math.max(0, earnings_completed_usd - activeWithdrawalsUSD);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: 700; color: #fff;">${escapeHTML(emp.name)}</td>
            <td><span class="badge">${escapeHTML(emp.role)}</span></td>
            <td style="font-weight: 700; text-align: center;">${empCompletedCount}</td>
            <td>${formatCurrency(empGrossEGP, 'EGP')}</td>
            <td>${formatCurrency(empGrossUSD, 'USD')}</td>
            <td style="font-weight: 700; color: var(--color-emerald);">${formatCurrency(empDueEGP, 'EGP')}</td>
            <td style="font-weight: 700; color: var(--color-emerald);">${formatCurrency(empDueUSD, 'USD')}</td>
        `;
        tableBody.appendChild(row);
    });

    // Populate account creation employee select dropdown & allowed checkboxes
    const accountEmpSelect = document.getElementById('account-employee-select');
    const checkboxesDiv = document.getElementById('allowed-employees-checkboxes');
    if (accountEmpSelect) {
        accountEmpSelect.innerHTML = '<option value="">-- ' + (state.currentLanguage === 'ar' ? 'اختر الموظف' : 'Select Employee') + ' --</option>';
        if (checkboxesDiv) checkboxesDiv.innerHTML = '';
        state.employees.forEach(emp => {
            const opt = document.createElement('option');
            opt.value = emp.id;
            opt.textContent = `${emp.name} (${emp.role})`;
            accountEmpSelect.appendChild(opt);

            if (checkboxesDiv) {
                const label = document.createElement('label');
                label.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #fff; cursor: pointer; background: rgba(255,255,255,0.05); padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);';
                label.innerHTML = `<input type="checkbox" class="allowed-emp-checkbox" value="${escapeHTML(emp.id)}"> <span>${escapeHTML(emp.name)}</span>`;
                checkboxesDiv.appendChild(label);
            }
        });
    }

    // Fetch and render created employee login accounts list
    fetchAndRenderEmployeeAccounts();
}

async function fetchAndRenderEmployeeAccounts() {
    const container = document.getElementById('accounts-table-container');
    const tableBody = document.getElementById('employee-accounts-table-body');
    if (!container || !tableBody) return;

    try {
        const res = await fetch('/api/auth/employee-accounts', { headers: authHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.accounts)) {
            window.currentLeaderAccountsData = data.accounts;
            if (data.accounts.length === 0) {
                container.style.display = 'none';
                return;
            }
            container.style.display = 'block';
            tableBody.innerHTML = '';
            data.accounts.forEach(acc => {
                const emp = state.employees.find(e => e.id === acc.employeeId);
                const empName = emp ? emp.name : (acc.employeeId || 'غير محدد');
                const dateStr = acc.createdAt ? new Date(acc.createdAt).toLocaleDateString(state.currentLanguage === 'ar' ? 'ar-EG' : 'en-US') : '-';
                const roleBadge = acc.role === 'leader' 
                    ? `<span class="badge" style="background: rgba(16,185,129,0.2); color: #34d399; font-weight:700;">مشرف / قائد فريق</span>`
                    : `<span class="badge" style="background: rgba(255,255,255,0.1); color: var(--text-dim);">موظف عادي</span>`;

                const allowedCount = Array.isArray(acc.allowedEmployeeIds) ? acc.allowedEmployeeIds.length : 0;
                const manageBtn = acc.role === 'leader'
                    ? `<button type="button" class="btn btn-secondary btn-sm btn-manage-leader-employees" data-username="${escapeHTML(acc.username)}" style="margin-inline-end: 6px; font-size: 11px; padding: 4px 10px;">
                        <i data-lucide="shield-check" style="width: 13px; height: 13px; vertical-align: middle; margin-inline-end: 4px; pointer-events: none;"></i>
                        إدارة الموظفين (${allowedCount})
                       </button>`
                    : '';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-weight: 700; color: #fff;">${escapeHTML(empName)}</td>
                    <td style="font-family: monospace; color: var(--color-primary); font-weight: 600;">${escapeHTML(acc.username)}</td>
                    <td>${roleBadge}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${dateStr}</td>
                    <td>
                        ${manageBtn}
                        <button class="btn btn-danger btn-icon-only btn-sm btn-delete-account" data-username="${escapeHTML(acc.username)}" onclick="deleteEmployeeAccount('${escapeHTML(acc.username)}')" title="حذف الحساب">
                            <i data-lucide="trash-2" style="width: 14px; height: 14px; pointer-events: none;"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
            if (window.lucide) window.lucide.createIcons();
        }
    } catch (e) {
        console.error('Error fetching employee accounts:', e);
    }
}

async function fetchAndRenderPendingRequests() {
    const container = document.getElementById('review-requests-section');
    const tableBody = document.getElementById('pending-requests-table-body');
    if (!container || !tableBody) return;

    // Check if the current user is the main founder admin
    const user = getAuthUser();
    if (!user || user.role !== 'admin' || (user.tenantId && user.tenantId !== 'default_tenant')) {
        container.style.display = 'none';
        return;
    }

    try {
        const res = await fetch('/api/auth/admin-accounts', { headers: authHeaders() });
        if (!res.ok) {
            container.style.display = 'none';
            return;
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.accounts)) {
            container.style.display = 'block';
            tableBody.innerHTML = '';

            if (data.accounts.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td colspan="7" style="text-align: center; color: var(--text-dim); padding: 20px;">لا توجد حسابات مسجلة حالياً</td>`;
                tableBody.appendChild(tr);
                return;
            }

            data.accounts.forEach(reqItem => {
                const dateStr = reqItem.createdAt ? new Date(reqItem.createdAt).toLocaleDateString(state.currentLanguage === 'ar' ? 'ar-EG' : 'en-US') : '-';
                const birthStr = reqItem.birthDate ? new Date(reqItem.birthDate).toLocaleDateString(state.currentLanguage === 'ar' ? 'ar-EG' : 'en-US') : '-';
                const lastLoginStr = reqItem.lastLogin 
                    ? new Date(reqItem.lastLogin).toLocaleString(state.currentLanguage === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'short', timeStyle: 'short' })
                    : (state.currentLanguage === 'ar' ? 'لم يسجل دخول بعد' : 'Never logged in');

                // Status badge
                let statusBadge = '';
                if (reqItem.status === 'approved') {
                    statusBadge = `<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--color-emerald); padding: 4px 8px; border-radius: 6px; font-size: 11px;">نشط</span>`;
                } else if (reqItem.status === 'pending') {
                    statusBadge = `<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 4px 8px; border-radius: 6px; font-size: 11px;">معلق</span>`;
                } else {
                    // rejected/suspended
                    statusBadge = `<span class="badge" style="background: rgba(244, 63, 94, 0.15); color: var(--color-rose); padding: 4px 8px; border-radius: 6px; font-size: 11px;" title="${escapeHTML(reqItem.banReason || '')}">محظور</span>`;
                }

                // Action buttons based on status
                let actionButtons = '';
                if (reqItem.status === 'pending') {
                    actionButtons = `
                        <button class="btn btn-primary btn-sm btn-approve-request" data-id="${reqItem._id}" style="margin-inline-end: 6px; font-size: 11px; padding: 4px 10px; background: var(--color-emerald); border-color: var(--color-emerald); color: #09090b !important;">
                            <i data-lucide="check" style="width: 13px; height: 13px; vertical-align: middle; margin-inline-end: 4px; pointer-events: none;"></i>
                            موافقة
                        </button>
                        <button class="btn btn-danger btn-sm btn-reject-request" data-id="${reqItem._id}" style="font-size: 11px; padding: 4px 10px; background: var(--color-rose); border-color: var(--color-rose); color: #09090b !important;">
                            <i data-lucide="x" style="width: 13px; height: 13px; vertical-align: middle; margin-inline-end: 4px; pointer-events: none;"></i>
                            رفض
                        </button>
                    `;
                } else if (reqItem.status === 'approved') {
                    actionButtons = `
                        <button class="btn btn-danger btn-sm btn-suspend-request" data-id="${reqItem._id}" style="margin-inline-end: 6px; font-size: 11px; padding: 4px 10px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #f59e0b !important;">
                            <i data-lucide="ban" style="width: 13px; height: 13px; vertical-align: middle; margin-inline-end: 4px; pointer-events: none;"></i>
                            حظر/تعليق
                        </button>
                        <button class="btn btn-danger btn-sm btn-delete-admin-request" data-id="${reqItem._id}" style="font-size: 11px; padding: 4px 10px; background: var(--color-rose); border-color: var(--color-rose); color: #09090b !important;">
                            <i data-lucide="trash-2" style="width: 13px; height: 13px; vertical-align: middle; margin-inline-end: 4px; pointer-events: none;"></i>
                            حذف
                        </button>
                    `;
                } else {
                    // rejected/suspended
                    actionButtons = `
                        <button class="btn btn-primary btn-sm btn-activate-request" data-id="${reqItem._id}" style="margin-inline-end: 6px; font-size: 11px; padding: 4px 10px; background: var(--color-emerald); border-color: var(--color-emerald); color: #09090b !important;">
                            <i data-lucide="user-check" style="width: 13px; height: 13px; vertical-align: middle; margin-inline-end: 4px; pointer-events: none;"></i>
                            تنشيط
                        </button>
                        <button class="btn btn-danger btn-sm btn-suspend-request" data-id="${reqItem._id}" style="margin-inline-end: 6px; font-size: 11px; padding: 4px 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #ffffff !important;" title="تعديل سبب الحظر">
                            <i data-lucide="edit-2" style="width: 13px; height: 13px; vertical-align: middle; margin-inline-end: 4px; pointer-events: none;"></i>
                            تعديل الرسالة
                        </button>
                        <button class="btn btn-danger btn-sm btn-delete-admin-request" data-id="${reqItem._id}" style="font-size: 11px; padding: 4px 10px; background: var(--color-rose); border-color: var(--color-rose); color: #09090b !important;">
                            <i data-lucide="trash-2" style="width: 13px; height: 13px; vertical-align: middle; margin-inline-end: 4px; pointer-events: none;"></i>
                            حذف
                        </button>
                    `;
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-weight: 700; color: #fff;">${escapeHTML(reqItem.username)}</td>
                    <td style="font-family: monospace; color: var(--color-primary);">${escapeHTML(reqItem.email || '-')}</td>
                    <td style="color: var(--text-dim);">${birthStr}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${dateStr}</td>
                    <td style="font-size: 12px; color: var(--text-dim);">${lastLoginStr}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            ${actionButtons}
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
            if (window.lucide) window.lucide.createIcons();
        }
    } catch (e) {
        console.error('Error fetching admin accounts:', e);
        container.style.display = 'none';
    }
}

async function handleApproveRequest(userId) {
    try {
        const res = await fetch('/api/auth/approve-request', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ userId })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            fetchAndRenderPendingRequests();
        } else {
            alert(data.error || 'خطأ أثناء تفعيل الحساب');
        }
    } catch (err) {
        console.error('Approve request error:', err);
        alert('خطأ في السيرفر');
    }
}

async function handleRejectRequest(userId, reason) {
    try {
        const res = await fetch('/api/auth/reject-request', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ userId, reason })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            fetchAndRenderPendingRequests();
        } else {
            alert(data.error || 'خطأ أثناء رفض الحساب');
        }
    } catch (err) {
        console.error('Reject request error:', err);
        alert('خطأ في السيرفر');
    }
}

async function handleSuspendRequest(userId, reason) {
    try {
        const res = await fetch('/api/auth/suspend-admin-account', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ userId, reason })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            fetchAndRenderPendingRequests();
        } else {
            alert(data.error || 'خطأ أثناء حظر الحساب');
        }
    } catch (err) {
        console.error('Suspend request error:', err);
        alert('خطأ في السيرفر');
    }
}

async function handleActivateRequest(userId) {
    try {
        const res = await fetch('/api/auth/activate-admin-account', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ userId })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            fetchAndRenderPendingRequests();
        } else {
            alert(data.error || 'خطأ أثناء تفعيل الحساب');
        }
    } catch (err) {
        console.error('Activate request error:', err);
        alert('خطأ في السيرفر');
    }
}

async function handleDeleteAdminRequest(userId) {
    try {
        const res = await fetch(`/api/auth/delete-admin-account/${userId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            fetchAndRenderPendingRequests();
        } else {
            alert(data.error || 'خطأ أثناء حذف الحساب');
        }
    } catch (err) {
        console.error('Delete admin request error:', err);
        alert('خطأ في السيرفر');
    }
}

window.deleteEmployeeAccount = async function(username) {
    try {
        const res = await fetch(`/api/auth/delete-account/${encodeURIComponent(username)}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        const data = await res.json();
        if (data.success) {
            showToast('toast-employee-deleted');
            fetchAndRenderEmployeeAccounts();
        } else {
            alert(data.error || 'Error deleting account');
        }
    } catch (e) {
        alert('Server error');
    }
};

function updateLeaderSelectedCountBadge() {
    const checkedCount = document.querySelectorAll('.leader-emp-checkbox:checked').length;
    const totalCount = document.querySelectorAll('.leader-emp-checkbox').length;
    const badge = document.getElementById('leader-selected-count-badge');
    if (badge) {
        badge.textContent = state.currentLanguage === 'ar' 
            ? `الظاهرون للمشرف: ${checkedCount} من ${totalCount}`
            : `Visible to Leader: ${checkedCount} of ${totalCount}`;
    }
}

window.openLeaderPermissionsModal = function(username) {
    const modal = document.getElementById('leader-permissions-modal');
    if (!modal) return;
    
    document.getElementById('leader-target-username').value = username;
    document.getElementById('leader-modal-title').textContent = `إدارة موظفين المشرف: (${username})`;
    
    const searchInput = document.getElementById('leader-emp-search-input');
    if (searchInput) searchInput.value = '';

    renderLeaderModalEmployees(username, 'all');
    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
};

window.renderLeaderModalEmployees = function(username, currentFilter = 'all') {
    const container = document.getElementById('leader-emps-checkbox-container');
    if (!container) return;
    container.innerHTML = '';

    const cleanUser = String(username).trim().toLowerCase();
    const targetAccount = (window.currentLeaderAccountsData || []).find(a => String(a.username).trim().toLowerCase() === cleanUser);
    const allowedIds = targetAccount && targetAccount.allowedEmployeeIds ? targetAccount.allowedEmployeeIds.map(String) : [];
    const allowedSet = new Set(allowedIds);

    const badge = document.getElementById('leader-selected-count-badge');
    if (badge) {
        badge.textContent = `الموظفون المخصصون: ${allowedSet.size} من ${state.employees.length}`;
    }

    if (state.employees.length === 0) {
        container.innerHTML = '<p style="font-size: 12px; color: var(--text-dim); text-align: center; padding: 20px;">لا يوجد ملفات موظفين منشأة في النظام بعد.</p>';
        return;
    }

    const searchInput = document.getElementById('leader-emp-search-input');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    state.employees.forEach(emp => {
        const isAssigned = allowedSet.has(String(emp.id));

        if (currentFilter === 'assigned' && !isAssigned) return;
        if (currentFilter === 'unassigned' && isAssigned) return;
        if (query && !emp.name.toLowerCase().includes(query)) return;

        const row = document.createElement('div');
        row.className = 'leader-emp-item';
        row.setAttribute('data-emp-name', emp.name.toLowerCase());
        row.style.cssText = `display: flex; align-items: center; justify-content: space-between; gap: 10px; background: ${isAssigned ? 'rgba(16, 185, 129, 0.07)' : 'rgba(255,255,255,0.02)'}; border: 1px solid ${isAssigned ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.06)'}; border-radius: 8px; padding: 10px 14px; transition: all 0.2s;`;

        const statusBadgeHTML = isAssigned
            ? `<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-weight: 700; font-size: 11px;">مخصص للمشرف</span>`
            : `<span class="badge" style="background: rgba(255, 255, 255, 0.06); color: var(--text-dim); font-size: 11px;">غير مخصص</span>`;

        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 13px;">
                    ${emp.name.trim().charAt(0).toUpperCase()}
                </div>
                <div>
                    <div style="font-weight: 700; color: #fff; font-size: 13px;">${escapeHTML(emp.name)}</div>
                    <div style="font-size: 11px; color: var(--text-dim);">${escapeHTML(emp.role || 'عضو')}</div>
                </div>
            </div>
            <div class="leader-emp-actions" style="display: flex; align-items: center; gap: 10px;">
                ${statusBadgeHTML}
            </div>
        `;

        const actionBtn = document.createElement('button');
        actionBtn.type = 'button';
        actionBtn.style.cssText = 'font-size: 11px; padding: 4px 10px;';
        if (isAssigned) {
            actionBtn.className = 'btn btn-danger btn-sm';
            actionBtn.innerHTML = `<i data-lucide="user-minus" style="width: 13px; height: 13px; margin-inline-end: 4px; vertical-align: middle; pointer-events: none;"></i>إلغاء التعيين / إخفاء`;
            actionBtn.addEventListener('click', () => {
                window.toggleAssignLeaderEmp(username, emp.id, false);
            });
        } else {
            actionBtn.className = 'btn btn-primary btn-sm';
            actionBtn.innerHTML = `<i data-lucide="user-plus" style="width: 13px; height: 13px; margin-inline-end: 4px; vertical-align: middle; pointer-events: none;"></i>إسناد للمشرف`;
            actionBtn.addEventListener('click', () => {
                window.toggleAssignLeaderEmp(username, emp.id, true);
            });
        }
        row.querySelector('.leader-emp-actions').appendChild(actionBtn);
        container.appendChild(row);
    });

    if (window.lucide) window.lucide.createIcons();
};

window.toggleAssignLeaderEmp = async function(username, empId, assign) {
    if (!username) return;

    if (!Array.isArray(window.currentLeaderAccountsData)) {
        try {
            const accRes = await fetch('/api/auth/employee-accounts', { headers: authHeaders() });
            if (accRes.ok) {
                const accData = await accRes.json();
                if (accData.success) window.currentLeaderAccountsData = accData.accounts || [];
            }
        } catch(e) {}
    }

    const cleanUser = String(username).trim().toLowerCase();
    const targetAccount = (window.currentLeaderAccountsData || []).find(a => String(a.username).trim().toLowerCase() === cleanUser);
    
    let allowedIds = targetAccount && Array.isArray(targetAccount.allowedEmployeeIds) 
        ? [...targetAccount.allowedEmployeeIds.map(String)] 
        : [];

    if (assign) {
        if (!allowedIds.includes(String(empId))) allowedIds.push(String(empId));
    } else {
        allowedIds = allowedIds.filter(id => String(id) !== String(empId));
    }

    try {
        const res = await fetch('/api/auth/update-allowed-employees', {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ username: username, allowedEmployeeIds: allowedIds })
        });
        const data = await res.json();
        if (data && data.success) {
            if (targetAccount) {
                targetAccount.allowedEmployeeIds = allowedIds;
            }
            showToast('toast-employee-updated');
            renderLeaderModalEmployees(username);
            await fetchAndRenderEmployeeAccounts();
        } else {
            alert(data.error || 'حدث خطأ أثناء التحديث');
        }
    } catch (err) {
        console.error(err);
        alert('حدث خطأ في الاتصال بالسيرفر');
    }
};

window.closeLeaderPermissionsModal = function() {
    const modal = document.getElementById('leader-permissions-modal');
    if (modal) modal.classList.remove('active');
};

// --- Employee Payouts Detail Page Rendering ---
function renderEmployeeDetail(id) {
    const emp = state.employees.find(e => e.id === id);
    if (!emp) {
        // Fallback to placeholder if employee not found (e.g. deleted)
        document.getElementById('employee-detail-section').style.display = 'none';
        document.getElementById('dashboard-placeholder').style.display = 'flex';
        state.selectedEmployeeId = null;
        return;
    }

    // Set employee header details
    document.getElementById('detail-employee-name').textContent = emp.name;
    document.getElementById('detail-employee-role').textContent = emp.role;
    document.getElementById('detail-employee-deduction').textContent = `${emp.defaultDeductionRate}%`;
    
    const initialsSpan = document.getElementById('employee-avatar-initials');
    const avatarImg = document.getElementById('employee-avatar-img');
    if (emp.avatarUrl) {
        avatarImg.src = emp.avatarUrl;
        avatarImg.style.display = 'block';
        initialsSpan.style.display = 'none';
    } else {
        avatarImg.src = '';
        avatarImg.style.display = 'none';
        initialsSpan.textContent = emp.name.trim().charAt(0).toUpperCase();
    }

    const currentUser = getAuthUser();
    const editEmpBtn = document.getElementById('edit-employee-btn');
    if (editEmpBtn) {
        if (currentUser && currentUser.role === 'admin') {
            editEmpBtn.style.display = '';
        } else if (currentUser && currentUser.role === 'leader') {
            const allowed = new Set((currentUser.allowedEmployeeIds || []).map(String));
            if (currentUser.employeeId) allowed.add(String(currentUser.employeeId));
            editEmpBtn.style.display = allowed.has(String(emp.id)) ? '' : 'none';
        } else if (currentUser && currentUser.role === 'employee') {
            editEmpBtn.style.display = (currentUser.employeeId && String(emp.id) === String(currentUser.employeeId)) ? '' : 'none';
        }
    }

    const dbMonthFilter = document.getElementById('dashboard-filter-month');
    const empMonthFilter = document.getElementById('task-filter-month');
    if (dbMonthFilter && empMonthFilter) {
        empMonthFilter.value = dbMonthFilter.value;
    }

    // Update payment method header display
    const payMethodKey = emp.paymentMethod || 'instapay';
    const payMethodText = i18n[state.currentLanguage]['payment-' + payMethodKey.replace('_', '')] || payMethodKey;
    document.getElementById('detail-employee-payment').textContent = `${payMethodText} (${emp.paymentDetails || '-'})`;

    // Populate task table
    const statusFilter = document.getElementById('task-filter-status').value;
    const monthFilter = empMonthFilter ? empMonthFilter.value : 'all';
    const tableBody = document.getElementById('tasks-table-body');
    const fallback = document.getElementById('no-tasks-fallback');
    tableBody.innerHTML = '';

    const searchInput = document.getElementById('task-search-input');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filteredTasks = emp.tasks.filter(task => {
        const matchStatus = (statusFilter === 'all') || (task.status === statusFilter);
        const matchMonth = (monthFilter === 'all') || (task.month === monthFilter);
        const matchSearch = !searchQuery || 
            task.taskNumber.toLowerCase().includes(searchQuery) || 
            task.title.toLowerCase().includes(searchQuery);
        return matchStatus && matchMonth && matchSearch;
    });

    if (filteredTasks.length === 0) {
        fallback.style.display = 'flex';
    } else {
        fallback.style.display = 'none';
        
        filteredTasks.forEach(task => {
            const row = document.createElement('tr');
            
            const isWithdrawal = task.type === 'withdrawal';
            const currency = task.currency || 'EGP';
            const rate = task.exchangeRate || state.exchangeRate;
            let grossDisplay = '';
            let netDisplay = '';
            let deductionDisplay = '';

            if (isWithdrawal) {
                grossDisplay = `<div style="color: var(--color-rose); font-weight: 600;">-${formatCurrency(task.gross, currency)}</div>`;
                netDisplay = `<div style="color: var(--color-rose); font-weight: 600;">-${formatCurrency(task.gross, currency)}</div>`;
                deductionDisplay = `<span style="color: var(--text-dim);">-</span>`;
            } else {
                const delay = task.delayDeduction || 0;
                const adv = task.advance || 0;
                const fixed = task.fixedDeduction || 0;
                const netAmount = calculateTaskNet(task.gross, task.deductionRate, delay, adv, fixed);
                // statusText is declared below (L957) for both withdrawal and task types
                
                grossDisplay = `<div>${formatCurrency(task.gross, currency)}</div>`;
                netDisplay = `<div style="font-weight: 700; color: var(--color-emerald);">${formatCurrency(netAmount, currency)}</div>`;
                
                const eurRate = state.eurExchangeRate || 55;
                if (currency === 'EGP') {
                    const convertedGrossUsd = task.gross / rate;
                    const convertedNetUsd = netAmount / rate;
                    const convertedGrossEur = task.gross / eurRate;
                    const convertedNetEur = netAmount / eurRate;
                    grossDisplay += `<div class="secondary-value">(${formatCurrency(convertedGrossUsd, 'USD')} • ${formatCurrency(convertedGrossEur, 'EUR')})</div>`;
                    netDisplay += `<div class="secondary-value">(${formatCurrency(convertedNetUsd, 'USD')} • ${formatCurrency(convertedNetEur, 'EUR')})</div>`;
                } else if (currency === 'EUR') {
                    const convertedGrossEgp = task.gross * eurRate;
                    const convertedNetEgp = netAmount * eurRate;
                    const convertedGrossUsd = (task.gross * eurRate) / rate;
                    const convertedNetUsd = (netAmount * eurRate) / rate;
                    grossDisplay += `<div class="secondary-value">(${formatCurrency(convertedGrossEgp, 'EGP')} • ${formatCurrency(convertedGrossUsd, 'USD')})</div>`;
                    netDisplay += `<div class="secondary-value">(${formatCurrency(convertedNetEgp, 'EGP')} • ${formatCurrency(convertedNetUsd, 'USD')})</div>`;
                } else { // USD
                    const convertedGrossEgp = task.gross * rate;
                    const convertedNetEgp = netAmount * rate;
                    const convertedGrossEur = (task.gross * rate) / eurRate;
                    const convertedNetEur = (netAmount * rate) / eurRate;
                    grossDisplay += `<div class="secondary-value">(${formatCurrency(convertedGrossEgp, 'EGP')} • ${formatCurrency(convertedGrossEur, 'EUR')})</div>`;
                    netDisplay += `<div class="secondary-value">(${formatCurrency(convertedNetEgp, 'EGP')} • ${formatCurrency(convertedNetEur, 'EUR')})</div>`;
                }

                deductionDisplay = `<span>${task.deductionRate}%</span>`;
                if (task.fixedDeduction || task.delayDeduction || task.advance) {
                    let details = [];
                    if (task.fixedDeduction) details.push((state.currentLanguage === 'ar' ? 'ثابت: ' : 'Fix: ') + formatCurrency(task.fixedDeduction, currency));
                    if (task.delayDeduction) details.push((state.currentLanguage === 'ar' ? 'تأخير: ' : 'Delay: ') + formatCurrency(task.delayDeduction, currency));
                    if (task.advance) details.push((state.currentLanguage === 'ar' ? 'سلفة: ' : 'Adv: ') + formatCurrency(task.advance, currency));
                    
                    deductionDisplay += `<div style="font-size: 11px; color: var(--color-rose); margin-top: 2px;">
                        ${details.join(' • ')}
                    </div>`;
                }
            }

            const monthText = task.month ? i18n[state.currentLanguage][`month-${task.month.slice(0, 3)}`] || task.month : '';
            const statusText = i18n[state.currentLanguage][`status-${task.status}`];
            const typeBadge = isWithdrawal 
                ? `<span class="badge" style="background: rgba(244, 63, 94, 0.15); color: var(--color-rose); margin-inline-start: 8px;">${state.currentLanguage === 'ar' ? 'سحب' : 'Withdrawal'}</span>`
                : '';

            const hasCredentials = task.email || task.password || task.character || task.vpn;
            let credsSummary = [];
            if (task.email) credsSummary.push(`✉️ ${escapeHTML(task.email)}`);
            if (task.character) credsSummary.push(`👤 ${escapeHTML(task.character)}`);
            if (task.vpn) credsSummary.push(`🛡️ ${escapeHTML(task.vpn)}`);

            const credsButtonHTML = hasCredentials 
                ? `<button class="btn btn-secondary btn-icon-only btn-sm btn-credentials" data-emp-id="${emp.id}" data-task-id="${task.id}" onclick="showTaskCredentials('${emp.id}', '${task.id}')" title="${state.currentLanguage === 'ar' ? 'عرض بيانات الحساب والـ VPN' : 'View Account Credentials & VPN'}"><i data-lucide="key" style="width: 14px; height: 14px; color: var(--color-primary); pointer-events: none;"></i></button>`
                : '';

            const currentUser = getAuthUser();
            let isCanEditTask = false;
            if (!currentUser || currentUser.role === 'admin') {
                isCanEditTask = true;
            } else if (currentUser.role === 'leader') {
                const allowed = new Set((currentUser.allowedEmployeeIds || []).map(String));
                if (currentUser.employeeId) allowed.add(String(currentUser.employeeId));
                if (allowed.has(String(emp.id))) isCanEditTask = true;
            }

            const statusBadgeHTML = isCanEditTask
                ? `<span class="status-badge ${task.status} btn-toggle-status" style="cursor: pointer;" data-emp-id="${emp.id}" data-task-id="${task.id}" onclick="toggleTaskStatus('${emp.id}', '${task.id}')">${statusText}</span>`
                : `<span class="status-badge ${task.status}">${statusText}</span>`;

            const adminActionBtns = isCanEditTask ? `
                <button class="btn btn-secondary btn-icon-only btn-sm btn-edit-task" data-emp-id="${emp.id}" data-task-id="${task.id}" onclick="editTask('${emp.id}', '${task.id}')" title="Edit Task">
                    <i data-lucide="edit-3" style="width: 14px; height: 14px; pointer-events: none;"></i>
                </button>
                <button class="btn btn-danger btn-icon-only btn-sm btn-delete-task" data-emp-id="${emp.id}" data-task-id="${task.id}" onclick="deleteTask('${emp.id}', '${task.id}')" title="Delete Task">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px; pointer-events: none;"></i>
                </button>
            ` : '';

            row.innerHTML = `
                <td style="font-weight: 700;">${escapeHTML(task.taskNumber)}</td>
                <td>
                    <div style="font-weight: 600; color: #fff; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        ${escapeHTML(task.title)}
                        ${typeBadge}
                    </div>
                    <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">
                        ${(task.createdAt && !isNaN(new Date(task.createdAt).getTime()) ? new Date(task.createdAt) : new Date()).toLocaleDateString(state.currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
                        ${monthText ? ' • ' + monthText : ''}
                    </div>
                    ${credsSummary.length > 0 ? `<div class="creds-print-hide" style="font-size: 11px; color: var(--color-secondary); margin-top: 3px; font-family: monospace;">${credsSummary.join(' • ')}</div>` : ''}
                </td>
                <td>${grossDisplay}</td>
                <td>
                    ${deductionDisplay}
                    ${!isWithdrawal && task.deductionRate !== emp.defaultDeductionRate ? ' <i data-lucide="info" style="width: 12px; height: 12px; vertical-align: middle; color: var(--color-amber);" title="Custom rate applied"></i>' : ''}
                </td>
                <td>${netDisplay}</td>
                <td>${statusBadgeHTML}</td>
                <td>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        ${credsButtonHTML}
                        ${adminActionBtns}
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Reset default placeholders in task form fields
    document.getElementById('task-deduction').placeholder = `${emp.defaultDeductionRate}%`;
    const taskCurrEl = document.getElementById('task-currency');
    if (taskCurrEl) taskCurrEl.value = 'USD';
}

// --- CRUD Actions for Tasks ---
window.toggleTaskStatus = function(empId, taskId) {
    const emp = state.employees.find(e => String(e.id) === String(empId));
    if (!emp) return;
    
    const task = emp.tasks.find(t => String(t.id) === String(taskId));
    if (!task) return;

    // Toggle status cycle: pending -> completed -> paid -> pending
    if (task.status === 'pending') {
        task.status = 'completed';
        delete task.exchangeRate;
        delete task.eurExchangeRate;
    } else if (task.status === 'completed') {
        task.status = 'paid';
        task.exchangeRate = state.exchangeRate;
        task.eurExchangeRate = state.eurExchangeRate;
    } else {
        task.status = 'pending';
        delete task.exchangeRate;
        delete task.eurExchangeRate;
    }

    const user = getAuthUser();
    if (user && user.role === 'leader') {
        saveTaskApi(task);
    } else {
        saveState();
    }
    calculateDashboardStats();
    renderEmployeeDetail(empId);
    showToast('toast-status-updated');
    if (window.lucide) window.lucide.createIcons();
};

window.deleteTask = function(empId, taskId) {
    const emp = state.employees.find(e => String(e.id) === String(empId));
    if (!emp) return;

    emp.tasks = emp.tasks.filter(t => String(t.id) !== String(taskId));

    const user = getAuthUser();
    if (user && user.role === 'leader') {
        deleteTaskApi(taskId);
    } else {
        saveState();
    }
    calculateDashboardStats();
    renderEmployeesList();
    renderEmployeeDetail(empId);
    showToast('toast-task-deleted');
    if (window.lucide) window.lucide.createIcons();
};

// Edit Task Modal implementation
window.editTask = function(empId, taskId) {
    const emp = state.employees.find(e => String(e.id) === String(empId));
    if (!emp) return;
    
    const task = emp.tasks.find(t => String(t.id) === String(taskId));
    if (!task) return;

    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-emp-id').value = emp.id;

    document.getElementById('edit-task-type').value = task.type || 'task';
    document.getElementById('edit-task-number').value = task.taskNumber || '';
    document.getElementById('edit-task-title').value = task.title || '';
    document.getElementById('edit-task-gross').value = task.gross !== undefined ? task.gross : '';
    document.getElementById('edit-task-currency').value = task.currency || 'EGP';
    document.getElementById('edit-task-deduction').value = (task.deductionRate !== undefined && task.deductionRate !== emp.defaultDeductionRate) ? task.deductionRate : '';
    document.getElementById('edit-task-fixed-deduction').value = task.fixedDeduction || '';
    document.getElementById('edit-task-delay-deduction').value = task.delayDeduction || '';
    document.getElementById('edit-task-advance').value = task.advance || '';
    document.getElementById('edit-task-month').value = task.month || 'january';
    document.getElementById('edit-task-status').value = task.status || 'pending';

    document.getElementById('edit-task-email').value = task.email || '';
    document.getElementById('edit-task-password').value = task.password || '';
    document.getElementById('edit-task-character').value = task.character || '';
    document.getElementById('edit-task-vpn').value = task.vpn || '';

    // Handle withdrawal field visibility in edit modal
    const isWithdrawal = task.type === 'withdrawal';
    const deductionGroup = document.getElementById('edit-task-deduction-group');
    const adjustmentsRow = document.getElementById('edit-task-adjustments-row-1');
    const advanceGroup = document.getElementById('edit-task-advance-group');
    if (deductionGroup) deductionGroup.style.display = isWithdrawal ? 'none' : 'block';
    if (adjustmentsRow) adjustmentsRow.style.display = isWithdrawal ? 'none' : 'grid';
    if (advanceGroup) advanceGroup.style.visibility = isWithdrawal ? 'hidden' : 'visible';

    const modal = document.getElementById('edit-task-modal');
    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
};

// --- CRUD Actions for Employees ---
function openEmployeeModal(isEdit = false) {
    const user = getAuthUser();
    if (!user) return;
    if (user.role === 'employee' && (!isEdit || String(state.selectedEmployeeId) !== String(user.employeeId))) return;

    const modal = document.getElementById('employee-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('employee-form');
    
    form.reset();
    document.getElementById('edit-employee-id').value = '';

    state.tempAvatarUrl = null;
    document.getElementById('employee-avatar-file').value = '';
    const previewImg = document.getElementById('avatar-preview-img');
    const previewInitials = document.getElementById('avatar-preview-initials');
    const removeBtn = document.getElementById('remove-avatar-btn');

    if (isEdit && state.selectedEmployeeId) {
        const emp = state.employees.find(e => e.id === state.selectedEmployeeId);
        if (emp) {
            document.getElementById('edit-employee-id').value = emp.id;
            document.getElementById('employee-name').value = emp.name;
            document.getElementById('employee-role').value = emp.role;
            document.getElementById('employee-deduction-rate').value = emp.defaultDeductionRate;
            document.getElementById('employee-payment-method').value = emp.paymentMethod || 'instapay';
            document.getElementById('employee-payment-details').value = emp.paymentDetails || '';
            
            if (emp.avatarUrl) {
                previewImg.src = emp.avatarUrl;
                previewImg.style.display = 'block';
                previewInitials.style.display = 'none';
                removeBtn.style.display = 'block';
                state.tempAvatarUrl = emp.avatarUrl;
            } else {
                previewImg.src = '';
                previewImg.style.display = 'none';
                previewInitials.textContent = emp.name.charAt(0).toUpperCase();
                previewInitials.style.display = 'block';
                removeBtn.style.display = 'none';
            }
            
            if (user && user.role === 'employee') {
                modalTitle.textContent = state.currentLanguage === 'ar' ? 'تعديل الصورة الشخصية' : 'Edit Profile Photo';
            } else {
                modalTitle.textContent = i18n[state.currentLanguage]['modal-edit-employee-title'];
            }
        }
    } else {
        previewImg.src = '';
        previewImg.style.display = 'none';
        previewInitials.textContent = '-';
        previewInitials.style.display = 'block';
        removeBtn.style.display = 'none';
        modalTitle.textContent = i18n[state.currentLanguage]['modal-add-employee-title'];
    }

    const isEmployeeRole = user && user.role === 'employee';
    const empNameInput = document.getElementById('employee-name');
    const empRoleInput = document.getElementById('employee-role');
    const empDeductionInput = document.getElementById('employee-deduction-rate');
    const empPayMethodInput = document.getElementById('employee-payment-method');
    const empPayDetailsInput = document.getElementById('employee-payment-details');

    if (isEmployeeRole) {
        if (empNameInput) empNameInput.disabled = true;
        if (empRoleInput) empRoleInput.disabled = true;
        if (empDeductionInput) empDeductionInput.disabled = true;
        if (empPayMethodInput) empPayMethodInput.disabled = true;
        if (empPayDetailsInput) empPayDetailsInput.disabled = true;
    } else {
        if (empNameInput) empNameInput.disabled = false;
        if (empRoleInput) empRoleInput.disabled = false;
        if (empDeductionInput) empDeductionInput.disabled = false;
        if (empPayMethodInput) empPayMethodInput.disabled = false;
        if (empPayDetailsInput) empPayDetailsInput.disabled = false;
    }

    modal.classList.add('active');
}

function closeEmployeeModal() {
    document.getElementById('employee-modal').classList.remove('active');
}

// --- CSV Statement Export Helper ---
function exportEmployeeCSV(empId) {
    const emp = state.employees.find(e => e.id === empId);
    if (!emp) return;
    
    const selectedMonth = document.getElementById('task-filter-month').value;
    const selectedStatus = document.getElementById('task-filter-status').value;
    const searchInput = document.getElementById('task-search-input');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    let filteredTasks = emp.tasks;
    
    // Apply month filter
    if (selectedMonth !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.month === selectedMonth);
    }
    // Apply status filter
    if (selectedStatus !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.status === selectedStatus);
    }
    // Apply search query
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(t => 
            t.taskNumber.toLowerCase().includes(searchQuery) || 
            t.title.toLowerCase().includes(searchQuery)
        );
    }
    
    // Generate CSV content
    // We use UTF-8 BOM (\uFEFF) to make sure Excel opens it correctly with Arabic RTL characters!
    let csvContent = "\uFEFF";
    
    // Headers
    const headers = state.currentLanguage === 'ar' 
        ? ["رقم العملية", "الوصف/المهمة", "النوع", "القيمة قبل الخصم", "العملة", "نسبة الخصم", "الخصم الثابت", "خصم التأخير", "السلفة", "الصافي", "الحالة", "الشهر", "التاريخ"]
        : ["Task Number", "Description", "Type", "Gross Amount", "Currency", "Deduction Rate", "Fixed Deduction", "Delay Deduction", "Advance", "Net Amount", "Status", "Month", "Date"];
        
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";
    
    // Rows
    filteredTasks.forEach(task => {
        const isWithdrawal = task.type === 'withdrawal';
        const currency = task.currency || 'EGP';
        const typeStr = isWithdrawal 
            ? (state.currentLanguage === 'ar' ? 'عملية سحب' : 'Withdrawal')
            : (state.currentLanguage === 'ar' ? 'مهمة' : 'Task');
            
        let netAmount = 0;
        let gross = task.gross;
        let rate = '';
        let fixed = '';
        let delay = '';
        let adv = '';
        
        if (isWithdrawal) {
            netAmount = -task.gross;
            gross = -task.gross;
        } else {
            const delayVal = task.delayDeduction || 0;
            const advVal = task.advance || 0;
            const fixedVal = task.fixedDeduction || 0;
            netAmount = calculateTaskNet(task.gross, task.deductionRate, delayVal, advVal, fixedVal);
            rate = task.deductionRate + "%";
            fixed = fixedVal || 0;
            delay = delayVal || 0;
            adv = advVal || 0;
        }
        
        const monthText = task.month ? i18n[state.currentLanguage][`month-${task.month.slice(0, 3)}`] || task.month : '';
        const statusText = i18n[state.currentLanguage][`status-${task.status}`];
        const dateStr = new Date(task.createdAt).toLocaleDateString(state.currentLanguage === 'ar' ? 'ar-EG' : 'en-US');
        
        const row = [
            task.taskNumber,
            task.title,
            typeStr,
            gross,
            currency,
            rate,
            fixed,
            delay,
            adv,
            netAmount,
            statusText,
            monthText,
            dateStr
        ];
        
        csvContent += row.map(r => `"${String(r).replace(/"/g, '""')}"`).join(",") + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const filePrefix = state.currentLanguage === 'ar' ? 'كشف_حساب' : 'statement';
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `${filePrefix}_${emp.name.replace(/\s+/g, '_')}_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('toast-csv-exported');
}

// --- Import/Export Operations ---
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const dateStamp = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute("download", `task_payouts_backup_${dateStamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    showToast('toast-data-exported');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedState = JSON.parse(e.target.result);
            if (importedState && validateAndSanitizeState(importedState)) {
                state = importedState;
                saveState();
                updateUIVisuals();
                showToast('toast-data-imported');
            } else {
                throw new Error("Invalid format");
            }
        } catch (err) {
            showToast('toast-import-fail');
            console.error(err);
        }
    };
    reader.readAsText(file);
    // Reset file input value
    event.target.value = '';
}

// --- Auth UI & Role Restrictions ---
function showLoginOverlay() {
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.classList.add('active');
    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.style.display = 'none';
}

function hideLoginOverlay() {
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.classList.remove('active');
    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.style.display = '';
}

async function handleLogin(username, password) {
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.style.display = 'none';

    const loginBtn = document.getElementById('login-btn');
    const originalBtnHTML = loginBtn ? loginBtn.innerHTML : '';

    if (loginBtn) {
        loginBtn.disabled = true;
        const flameSVG = `<svg class="flame-loader-icon" viewBox="0 0 24 24" fill="none" stroke="#09090b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px; stroke: #09090b !important; color: #09090b !important; filter: drop-shadow(0 0 4px rgba(0,0,0,0.3));"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
        const text = state.currentLanguage === 'ar' ? 'جاري تسجيل الدخول...' : 'Verifying...';
        loginBtn.innerHTML = `<span style="display: flex; align-items: center; justify-content: center; gap: 8px; color: #09090b !important; font-weight: 700;">${flameSVG} <span>${text}</span></span>`;
    }

    const startTime = Date.now();

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        // Ensure minimum 700ms display so the user visibly experiences the animated glowing flame loader
        const elapsed = Date.now() - startTime;
        if (elapsed < 700) {
            await new Promise(r => setTimeout(r, 700 - elapsed));
        }

        if (data.success) {
            setAuth(data.token, data.user);
            hideLoginOverlay();
            await loadStateAsync();
            fetchExchangeRate(false);
            applyRoleRestrictions();
            updateUIVisuals();
            return true;
        } else {
            if (errEl) {
                errEl.textContent = data.error || (state.currentLanguage === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password');
                errEl.style.display = 'block';
            }
            return false;
        }
    } catch (e) {
        if (errEl) {
            errEl.textContent = state.currentLanguage === 'ar' ? 'حدث خطأ أثناء الاتصال بالسيرفر' : 'Server connection error';
            errEl.style.display = 'block';
        }
        return false;
    } finally {
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalBtnHTML;
            if (window.lucide) window.lucide.createIcons();
        }
    }
}

async function handleRegister(username, password, email, birthDate) {
    const errEl = document.getElementById('register-error');
    if (errEl) errEl.style.display = 'none';

    const registerBtn = document.getElementById('register-submit-btn');
    const originalBtnHTML = registerBtn ? registerBtn.innerHTML : '';

    if (registerBtn) {
        registerBtn.disabled = true;
        const text = state.currentLanguage === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating...';
        registerBtn.innerHTML = `<span>${text}</span>`;
    }

    const startTime = Date.now();

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email, birthDate })
        });
        const data = await res.json();

        const elapsed = Date.now() - startTime;
        if (elapsed < 700) {
            await new Promise(r => setTimeout(r, 700 - elapsed));
        }

        if (data.success) {
            const registerForm = document.getElementById('register-form');
            const successCard = document.getElementById('register-success-card');
            
            if (registerForm) registerForm.style.display = 'none';
            if (successCard) {
                successCard.style.display = 'block';
                if (window.lucide) window.lucide.createIcons();
            }
            return true;
        } else {
            if (errEl) {
                errEl.textContent = data.error || (state.currentLanguage === 'ar' ? 'فشل إنشاء الحساب' : 'Registration failed');
                errEl.style.display = 'block';
            }
            return false;
        }
    } catch (e) {
        if (errEl) {
            errEl.textContent = state.currentLanguage === 'ar' ? 'حدث خطأ أثناء الاتصال بالسيرفر' : 'Server connection error';
            errEl.style.display = 'block';
        }
        return false;
    } finally {
        if (registerBtn) {
            registerBtn.disabled = false;
            registerBtn.innerHTML = originalBtnHTML;
            if (window.lucide) window.lucide.createIcons();
        }
    }
}

function handleLogout() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    clearAuth();
    state = {
        currentLanguage: 'ar',
        selectedEmployeeId: null,
        viewMode: 'placeholder',
        isManagerUnlocked: false,
        exchangeRate: 50.00,
        employees: []
    };
    showLoginOverlay();
}

// --- Inactivity Auto-Logout Controller (10 Minutes) ---
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
let inactivityTimer = null;

function resetInactivityTimer() {
    if (!isAuthenticated()) return;
    
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    
    inactivityTimer = setTimeout(() => {
        if (isAuthenticated()) {
            console.log('⏰ Logging out due to 10 minutes of inactivity...');
            handleLogout();
            const errEl = document.getElementById('login-error');
            if (errEl) {
                errEl.textContent = state.currentLanguage === 'ar' 
                    ? 'تم تسجيل الخروج تلقائياً بسبب عدم النشاط لمدة 10 دقائق' 
                    : 'Auto logged out due to 10 minutes of inactivity';
                errEl.style.display = 'block';
            }
        }
    }, INACTIVITY_TIMEOUT_MS);
}

function initInactivityTracker() {
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach(evt => {
        window.addEventListener(evt, resetInactivityTimer, { passive: true });
    });
    resetInactivityTimer();
}

function applyRoleRestrictions() {
    const user = getAuthUser();
    if (!user) return;

    if (user.role === 'admin') {
        state.isManagerUnlocked = true;
        const isPrimaryAdmin = user.username === 'admin';

        const addEmpBtn = document.getElementById('add-employee-btn');
        if (addEmpBtn) addEmpBtn.style.display = '';

        const managerBtn = document.getElementById('manager-btn');
        if (managerBtn) managerBtn.style.display = '';

        const editEmpBtn = document.getElementById('edit-employee-btn');
        if (editEmpBtn) editEmpBtn.style.display = '';

        const delEmpBtn = document.getElementById('delete-employee-btn');
        if (delEmpBtn) delEmpBtn.style.display = '';

        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) clearDataBtn.style.display = isPrimaryAdmin ? '' : 'none';
        
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) exportBtn.style.display = isPrimaryAdmin ? '' : 'none';

        const exportCsvBtn = document.getElementById('export-csv-btn');
        if (exportCsvBtn) exportCsvBtn.style.display = isPrimaryAdmin ? '' : 'none';

        const importBtn = document.getElementById('import-btn');
        if (importBtn) importBtn.style.display = isPrimaryAdmin ? '' : 'none';

        const taskFormCol = document.querySelector('.task-form-column');
        if (taskFormCol) taskFormCol.style.display = '';
        const taskLayout = document.querySelector('.task-management-layout');
        if (taskLayout) taskLayout.style.gridTemplateColumns = '';

        const addTaskForm = document.getElementById('add-task-form');
        if (addTaskForm && addTaskForm.parentElement) addTaskForm.parentElement.style.display = '';
        
        const createAccForm = document.getElementById('create-account-form');
        if (createAccForm && createAccForm.parentElement) createAccForm.parentElement.style.display = '';

        const reviewReqBtn = document.getElementById('review-requests-btn');
        if (reviewReqBtn) {
            reviewReqBtn.style.display = (user.tenantId === 'default_tenant') ? '' : 'none';
        }
    } else if (user.role === 'leader') {
        state.isManagerUnlocked = true;

        const addEmpBtn = document.getElementById('add-employee-btn');
        if (addEmpBtn) addEmpBtn.style.display = '';

        const placeholderAddBtn = document.getElementById('placeholder-add-btn');
        if (placeholderAddBtn) placeholderAddBtn.style.display = 'none';

        const managerBtn = document.getElementById('manager-btn');
        if (managerBtn) managerBtn.style.display = '';

        const editEmpBtn = document.getElementById('edit-employee-btn');
        if (editEmpBtn) editEmpBtn.style.display = '';

        const delEmpBtn = document.getElementById('delete-employee-btn');
        if (delEmpBtn) delEmpBtn.style.display = 'none';

        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) clearDataBtn.style.display = 'none';

        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) exportBtn.style.display = 'none';

        const exportCsvBtn = document.getElementById('export-csv-btn');
        if (exportCsvBtn) exportCsvBtn.style.display = 'none';

        const importBtn = document.getElementById('import-btn');
        if (importBtn) importBtn.style.display = 'none';

        const taskFormCol = document.querySelector('.task-form-column');
        if (taskFormCol) taskFormCol.style.display = '';
        const taskLayout = document.querySelector('.task-management-layout');
        if (taskLayout) taskLayout.style.gridTemplateColumns = '';

        const addTaskForm = document.getElementById('add-task-form');
        if (addTaskForm && addTaskForm.parentElement) addTaskForm.parentElement.style.display = '';

        const createAccForm = document.getElementById('create-account-form');
        if (createAccForm && createAccForm.parentElement) createAccForm.parentElement.style.display = 'none';

        const reviewReqBtn = document.getElementById('review-requests-btn');
        if (reviewReqBtn) reviewReqBtn.style.display = 'none';
    } else if (user.role === 'employee') {
        state.isManagerUnlocked = false;

        const addEmpBtn = document.getElementById('add-employee-btn');
        if (addEmpBtn) addEmpBtn.style.display = 'none';

        const placeholderAddBtn = document.getElementById('placeholder-add-btn');
        if (placeholderAddBtn) placeholderAddBtn.style.display = 'none';

        const managerBtn = document.getElementById('manager-btn');
        if (managerBtn) managerBtn.style.display = 'none';

        const editEmpBtn = document.getElementById('edit-employee-btn');
        if (editEmpBtn) editEmpBtn.style.display = 'none';

        const delEmpBtn = document.getElementById('delete-employee-btn');
        if (delEmpBtn) delEmpBtn.style.display = 'none';

        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) clearDataBtn.style.display = 'none';

        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) exportBtn.style.display = 'none';

        const exportCsvBtn = document.getElementById('export-csv-btn');
        if (exportCsvBtn) exportCsvBtn.style.display = 'none';

        const importBtn = document.getElementById('import-btn');
        if (importBtn) importBtn.style.display = 'none';

        const taskFormCol = document.querySelector('.task-form-column');
        if (taskFormCol) taskFormCol.style.display = 'none';
        const taskLayout = document.querySelector('.task-management-layout');
        if (taskLayout) taskLayout.style.gridTemplateColumns = '1fr';

        const addTaskForm = document.getElementById('add-task-form');
        if (addTaskForm && addTaskForm.parentElement) addTaskForm.parentElement.style.display = 'none';

        const reviewReqBtn = document.getElementById('review-requests-btn');
        if (reviewReqBtn) reviewReqBtn.style.display = 'none';
    }
}

// --- Set Up Event Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize interactive canvas smoke effect
    if (window.initSmokeEffect) window.initSmokeEffect();

    // Initialize login reviews carousel
    if (window.initReviewsSlider) window.initReviewsSlider();

    // Auth Event Handlers
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('login-username').value.trim();
            const p = document.getElementById('login-password').value;
            await handleLogin(u, p);
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Show register overlay
    const showRegisterBtn = document.getElementById('show-register-btn');
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Reset register view components to clean state
            const registerForm = document.getElementById('register-form');
            if (registerForm) {
                registerForm.reset();
                registerForm.style.display = 'block';
            }
            const successCard = document.getElementById('register-success-card');
            if (successCard) successCard.style.display = 'none';
            const errEl = document.getElementById('register-error');
            if (errEl) errEl.style.display = 'none';

            const loginOverlay = document.getElementById('login-overlay');
            const registerOverlay = document.getElementById('register-overlay');
            if (loginOverlay) loginOverlay.classList.remove('active');
            if (registerOverlay) registerOverlay.classList.add('active');
        });
    }

    // Back to login from register
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const loginOverlay = document.getElementById('login-overlay');
            const registerOverlay = document.getElementById('register-overlay');
            if (registerOverlay) registerOverlay.classList.remove('active');
            if (loginOverlay) loginOverlay.classList.add('active');
        });
    }

    // Success Card back to login
    const successBackToLoginBtn = document.getElementById('success-back-to-login-btn');
    if (successBackToLoginBtn) {
        successBackToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const registerForm = document.getElementById('register-form');
            if (registerForm) {
                registerForm.reset();
                registerForm.style.display = 'block';
            }
            const successCard = document.getElementById('register-success-card');
            if (successCard) successCard.style.display = 'none';

            const loginOverlay = document.getElementById('login-overlay');
            const registerOverlay = document.getElementById('register-overlay');
            if (registerOverlay) registerOverlay.classList.remove('active');
            if (loginOverlay) loginOverlay.classList.add('active');
        });
    }

    // Register Form Handler
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const birthDate = document.getElementById('register-birthdate').value;
            const p = document.getElementById('register-password').value;
            const pc = document.getElementById('register-confirm-password').value;
            const errEl = document.getElementById('register-error');

            if (p !== pc) {
                if (errEl) {
                    errEl.textContent = state.currentLanguage === 'ar' 
                        ? 'كلمتا المرور غير متطابقتين' 
                        : 'Passwords do not match';
                    errEl.style.display = 'block';
                }
                return;
            }
            await handleRegister(u, p, email, birthDate);
        });
    }

    const changePassBtn = document.getElementById('change-password-btn');
    const changePassModal = document.getElementById('change-password-modal');
    const closeChangePassModal = document.getElementById('close-change-password-modal');
    const changePassForm = document.getElementById('change-password-form');

    if (changePassBtn && changePassModal) {
        changePassBtn.addEventListener('click', () => {
            changePassModal.classList.add('active');
        });
    }
    if (closeChangePassModal && changePassModal) {
        closeChangePassModal.addEventListener('click', () => {
            changePassModal.classList.remove('active');
        });
    }
    if (changePassForm) {
        changePassForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const curr = document.getElementById('current-password-input').value;
            const newP = document.getElementById('new-password-input').value;
            const conf = document.getElementById('confirm-password-input').value;
            const errEl = document.getElementById('change-password-error');

            if (newP !== conf) {
                if (errEl) {
                    errEl.textContent = state.currentLanguage === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
                    errEl.style.display = 'block';
                }
                return;
            }

            try {
                const res = await fetch('/api/auth/change-password', {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify({ currentPassword: curr, newPassword: newP })
                });
                const data = await res.json();
                if (data.success) {
                    changePassModal.classList.remove('active');
                    changePassForm.reset();
                    showToast('toast-data-saved');
                } else {
                    if (errEl) {
                        errEl.textContent = data.error || 'Error changing password';
                        errEl.style.display = 'block';
                    }
                }
            } catch (err) {
                if (errEl) {
                    errEl.textContent = 'Server error';
                    errEl.style.display = 'block';
                }
            }
        });
    }

    const roleSelect = document.getElementById('account-role-select');
    const allowedContainer = document.getElementById('account-allowed-employees-container');
    if (roleSelect && allowedContainer) {
        roleSelect.addEventListener('change', (e) => {
            allowedContainer.style.display = e.target.value === 'leader' ? 'block' : 'none';
        });
    }

    const createAccountForm = document.getElementById('create-account-form');
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const employeeId = document.getElementById('account-employee-select').value;
            const username = document.getElementById('account-username').value.trim();
            const password = document.getElementById('account-password').value;
            const role = roleSelect ? roleSelect.value : 'employee';
            const msgEl = document.getElementById('account-msg');

            let allowedEmployeeIds = [];
            if (role === 'leader') {
                const checkedBoxes = document.querySelectorAll('.allowed-emp-checkbox:checked');
                allowedEmployeeIds = Array.from(checkedBoxes).map(cb => cb.value);
            }

            if (!employeeId || !username || !password) return;

            try {
                const res = await fetch('/api/auth/create-employee-account', {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify({ username, password, employeeId, role, allowedEmployeeIds })
                });
                if (res.status === 401 || res.status === 403) {
                    clearAuth();
                    showLoginOverlay();
                    if (msgEl) {
                        msgEl.style.color = 'var(--color-rose)';
                        msgEl.textContent = state.currentLanguage === 'ar' ? 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً' : 'Session expired, please log in again';
                        msgEl.style.display = 'block';
                    }
                    return;
                }
                const data = await res.json();
                if (data.success) {
                    if (msgEl) {
                        msgEl.style.color = 'var(--color-emerald)';
                        msgEl.textContent = state.currentLanguage === 'ar' ? `✅ تم إنشاء حساب للموظف (${username}) بنجاح!` : `✅ Account (${username}) created successfully!`;
                        msgEl.style.display = 'block';
                    }
                    createAccountForm.reset();
                    if (allowedContainer) allowedContainer.style.display = 'none';
                    fetchAndRenderEmployeeAccounts();
                } else {
                    if (msgEl) {
                        msgEl.style.color = 'var(--color-rose)';
                        msgEl.textContent = '❌ ' + (data.error || 'Error creating account');
                        msgEl.style.display = 'block';
                    }
                }
            } catch (err) {
                if (msgEl) {
                    msgEl.style.color = 'var(--color-rose)';
                    msgEl.textContent = '❌ Server Error';
                    msgEl.style.display = 'block';
                }
            }
        });
    }

    // Leader Permissions Modal Event Listeners
    const closeLeaderPermModal = document.getElementById('close-leader-permissions-modal');
    const cancelLeaderPermModal = document.getElementById('cancel-leader-permissions-modal');
    if (closeLeaderPermModal) closeLeaderPermModal.addEventListener('click', window.closeLeaderPermissionsModal);
    if (cancelLeaderPermModal) cancelLeaderPermModal.addEventListener('click', window.closeLeaderPermissionsModal);

    let activeLeaderTab = 'all';

    const tabAll = document.getElementById('leader-tab-all');
    const tabAssigned = document.getElementById('leader-tab-assigned');
    const tabUnassigned = document.getElementById('leader-tab-unassigned');

    function setActiveLeaderTab(tabName, clickedBtn) {
        activeLeaderTab = tabName;
        document.querySelectorAll('.leader-tab-btn').forEach(btn => btn.classList.remove('active'));
        if (clickedBtn) clickedBtn.classList.add('active');
        const username = document.getElementById('leader-target-username').value;
        if (username) renderLeaderModalEmployees(username, activeLeaderTab);
    }

    if (tabAll) tabAll.addEventListener('click', (e) => setActiveLeaderTab('all', e.target));
    if (tabAssigned) tabAssigned.addEventListener('click', (e) => setActiveLeaderTab('assigned', e.target));
    if (tabUnassigned) tabUnassigned.addEventListener('click', (e) => setActiveLeaderTab('unassigned', e.target));

    const leaderEmpSearch = document.getElementById('leader-emp-search-input');
    if (leaderEmpSearch) {
        leaderEmpSearch.addEventListener('input', () => {
            const username = document.getElementById('leader-target-username').value;
            if (username) renderLeaderModalEmployees(username, activeLeaderTab);
        });
    }

    const modalCreateEmpBtn = document.getElementById('leader-modal-create-emp-btn');
    if (modalCreateEmpBtn) {
        modalCreateEmpBtn.addEventListener('click', () => {
            window.closeLeaderPermissionsModal();
            openEmployeeModal(false);
        });
    }

    // 1. Initial State Setup
    state.currentLanguage = localStorage.getItem('task_payout_lang') || 'ar';
    await loadStateAsync();
    
    // Set default month in add task form dropdown to current calendar month
    const currentMonthIndex = new Date().getMonth();
    const monthsKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const currentMonthKey = monthsKeys[currentMonthIndex];
    const taskMonthSelect = document.getElementById('task-month');
    if (taskMonthSelect) {
        taskMonthSelect.value = currentMonthKey;
    }
    
    // Set exchange rate initial field value
    document.getElementById('usd-to-egp-rate').value = state.exchangeRate || 50.00;
    
    // Auto-fetch fresh rates on load
    fetchExchangeRate(false);

    // 2. Apply role restrictions, inactivity tracker, and render UI
    applyRoleRestrictions();
    updateUIVisuals();
    initInactivityTracker();

    // 3. Event Listeners for Employee Modal
    document.getElementById('add-employee-btn').addEventListener('click', () => openEmployeeModal(false));
    document.getElementById('placeholder-add-btn').addEventListener('click', () => openEmployeeModal(false));
    document.getElementById('edit-employee-btn').addEventListener('click', () => openEmployeeModal(true));
    
    document.getElementById('close-employee-modal').addEventListener('click', closeEmployeeModal);
    document.getElementById('cancel-employee-modal').addEventListener('click', closeEmployeeModal);
    
    document.getElementById('employee-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const empId = document.getElementById('edit-employee-id').value;
        const name = document.getElementById('employee-name').value.trim();
        const role = document.getElementById('employee-role').value.trim();
        const deductionRate = parseFloat(document.getElementById('employee-deduction-rate').value);
        const paymentMethod = document.getElementById('employee-payment-method').value;
        const paymentDetails = document.getElementById('employee-payment-details').value.trim();

        const empToSave = {
            id: empId || undefined,
            name: name,
            role: role,
            defaultDeductionRate: deductionRate,
            paymentMethod: paymentMethod,
            paymentDetails: paymentDetails,
            avatarUrl: state.tempAvatarUrl
        };

        const savedEmp = await saveEmployeeApi(empToSave);
        const user = getAuthUser();

        if (empId) {
            // Edit Mode
            const emp = state.employees.find(e => String(e.id) === String(empId));
            if (emp) {
                emp.name = name;
                emp.role = role;
                emp.defaultDeductionRate = deductionRate;
                emp.paymentMethod = paymentMethod;
                emp.paymentDetails = paymentDetails;
                emp.avatarUrl = state.tempAvatarUrl;
                emp.adjustments = emp.adjustments || {};
                
                showToast('toast-employee-updated');
            }
        } else {
            // Add Mode
            const finalId = savedEmp ? savedEmp.id : ('emp_' + Date.now());
            const newEmp = {
                id: finalId,
                name: name,
                role: role,
                defaultDeductionRate: deductionRate,
                paymentMethod: paymentMethod,
                paymentDetails: paymentDetails,
                avatarUrl: state.tempAvatarUrl,
                adjustments: {},
                tasks: []
            };
            state.employees.push(newEmp);
            state.selectedEmployeeId = newEmp.id;
            state.viewMode = 'employee';
            
            showToast('toast-employee-added');
        }

        if (user && user.role === 'admin') {
            saveState();
        }
        closeEmployeeModal();
        
        // Render Dashboard
        document.getElementById('dashboard-placeholder').style.display = 'none';
        document.getElementById('manager-panel-section').style.display = 'none';
        document.getElementById('employee-detail-section').style.display = 'block';
        document.getElementById('manager-btn').classList.remove('active');
        
        updateUIVisuals();
    });

    // 4. Delete Employee Action
    document.getElementById('delete-employee-btn').addEventListener('click', async () => {
        if (!state.selectedEmployeeId) return;

        const targetId = state.selectedEmployeeId;
        const confirmMsg = state.currentLanguage === 'ar' ? 'هل أنت تأكد من حذف هذا الموظف وكافة مهامه نهائياً؟' : 'Are you sure you want to delete this employee and all their tasks?';
        if (!confirm(confirmMsg)) return;

        const user = getAuthUser();
        if (user && user.role === 'admin') {
            await deleteEmployeeApi(targetId);
        }

        state.employees = state.employees.filter(e => String(e.id) !== String(targetId));
        state.selectedEmployeeId = null;
        state.viewMode = 'placeholder';

        if (user && user.role === 'admin') {
            saveState();
        }
        updateUIVisuals();
        
        showToast('toast-employee-deleted');
    });

    // 5. Add Task Action Form
    document.getElementById('add-task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!state.selectedEmployeeId) return;
        
        const emp = state.employees.find(e => e.id === state.selectedEmployeeId);
        if (!emp) return;

        const taskNum = document.getElementById('task-number').value.trim();
        const title = document.getElementById('task-title').value.trim();
        const gross = parseFloat(document.getElementById('task-gross').value);
        const currency = document.getElementById('task-currency').value;
        
        let deductionRate = emp.defaultDeductionRate;
        const customDeductVal = document.getElementById('task-deduction').value;
        if (customDeductVal.trim() !== '') {
            const parsed = parseFloat(customDeductVal);
            if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
                deductionRate = parsed;
            }
        }

        const type = document.getElementById('task-type').value;
        const status = document.getElementById('task-status').value;
        const month = document.getElementById('task-month').value;
        const delayDeduction = parseFloat(document.getElementById('task-delay-deduction').value) || 0;
        const advance = parseFloat(document.getElementById('task-advance').value) || 0;
        const fixedDeduction = parseFloat(document.getElementById('task-fixed-deduction').value) || 0;

        const email = document.getElementById('task-email') ? document.getElementById('task-email').value.trim() : '';
        const password = document.getElementById('task-password') ? document.getElementById('task-password').value.trim() : '';
        const character = document.getElementById('task-character') ? document.getElementById('task-character').value.trim() : '';
        const vpn = document.getElementById('task-vpn') ? document.getElementById('task-vpn').value.trim() : '';

        const newTask = {
            id: 'task_' + Date.now(),
            type: type,
            taskNumber: taskNum,
            title: title,
            gross: gross,
            currency: currency,
            deductionRate: type === 'withdrawal' ? emp.defaultDeductionRate : deductionRate,
            delayDeduction: type === 'withdrawal' ? 0 : delayDeduction,
            advance: type === 'withdrawal' ? 0 : advance,
            fixedDeduction: type === 'withdrawal' ? 0 : fixedDeduction,
            status: status,
            month: month,
            email: email,
            password: password,
            character: character,
            vpn: vpn,
            createdAt: new Date().toISOString()
        };

        if (status === 'paid') {
            newTask.exchangeRate = state.exchangeRate;
            newTask.eurExchangeRate = state.eurExchangeRate;
        }

        emp.tasks.unshift(newTask); // Add to the top of list
        
        const user = getAuthUser();
        if (user && user.role === 'leader') {
            newTask.employeeId = emp.id;
            saveTaskApi(newTask);
        } else {
            saveState();
        }
        
        // Reset form
        document.getElementById('add-task-form').reset();
        document.getElementById('task-deduction-group').style.display = 'block';
        document.getElementById('task-adjustments-row-1').style.display = 'grid';
        document.getElementById('task-advance-group').style.visibility = 'visible';
        document.getElementById('task-gross-label').textContent = state.currentLanguage === 'ar' ? 'القيمة قبل الخصم' : 'Gross Payout';

        // Restore defaults: USD currency + current month
        document.getElementById('task-currency').value = 'USD';
        const _mIdx = new Date().getMonth();
        const _mKeys = ['january','february','march','april','may','june','july','august','september','october','november','december'];
        document.getElementById('task-month').value = _mKeys[_mIdx];
        
        calculateDashboardStats();
        renderEmployeesList();
        renderEmployeeDetail(state.selectedEmployeeId);
        
        showToast('toast-task-added');
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    // Exchange Rate change listeners
    document.getElementById('usd-to-egp-rate').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0) {
            state.exchangeRate = val;
            saveState();
            calculateDashboardStats();
            if (state.viewMode === 'employee' && state.selectedEmployeeId) {
                renderEmployeeDetail(state.selectedEmployeeId);
            } else if (state.viewMode === 'manager') {
                renderManagerPanel();
            }
        }
    });

    const eurRateEl = document.getElementById('eur-to-egp-rate');
    if (eurRateEl) {
        eurRateEl.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0) {
                state.eurExchangeRate = val;
                saveState();
                calculateDashboardStats();
                if (state.viewMode === 'employee' && state.selectedEmployeeId) {
                    renderEmployeeDetail(state.selectedEmployeeId);
                } else if (state.viewMode === 'manager') {
                    renderManagerPanel();
                }
            }
        });
    }

    document.getElementById('sync-rate-btn').addEventListener('click', () => {
        fetchExchangeRate(true);
    });

    document.getElementById('manager-btn').addEventListener('click', selectManagerPanel);
    const reviewRequestsBtn = document.getElementById('review-requests-btn');
    if (reviewRequestsBtn) {
        reviewRequestsBtn.addEventListener('click', () => {
            state.selectedEmployeeId = null;
            state.viewMode = 'review-requests';
            updateUIVisuals();
        });
    }
    document.getElementById('print-global-btn').addEventListener('click', () => {
        window.print();
    });

    // Credentials Modal events
    const credModal = document.getElementById('credentials-modal');
    if (credModal) {
        document.getElementById('close-credentials-modal').addEventListener('click', () => {
            credModal.classList.remove('active');
        });
        document.getElementById('close-credentials-modal-btn').addEventListener('click', () => {
            credModal.classList.remove('active');
        });
    }

    // Edit Task Modal Events
    const editModal = document.getElementById('edit-task-modal');
    if (editModal) {
        document.getElementById('close-edit-task-modal').addEventListener('click', () => {
            editModal.classList.remove('active');
        });
        document.getElementById('cancel-edit-task-modal').addEventListener('click', () => {
            editModal.classList.remove('active');
        });

        const editTypeSelect = document.getElementById('edit-task-type');
        if (editTypeSelect) {
            editTypeSelect.addEventListener('change', (e) => {
                const isWithdrawal = e.target.value === 'withdrawal';
                const deductionGroup = document.getElementById('edit-task-deduction-group');
                const adjustmentsRow = document.getElementById('edit-task-adjustments-row-1');
                const advanceGroup = document.getElementById('edit-task-advance-group');
                
                if (deductionGroup) deductionGroup.style.display = isWithdrawal ? 'none' : 'block';
                if (adjustmentsRow) adjustmentsRow.style.display = isWithdrawal ? 'none' : 'grid';
                if (advanceGroup) advanceGroup.style.visibility = isWithdrawal ? 'hidden' : 'visible';
                
                const grossLabel = document.getElementById('edit-task-gross-label');
                if (grossLabel) {
                    grossLabel.textContent = isWithdrawal 
                        ? (state.currentLanguage === 'ar' ? 'المبلغ المسحوب' : 'Withdrawn Amount')
                        : (state.currentLanguage === 'ar' ? 'القيمة قبل الخصم' : 'Gross Payout');
                }
            });
        }

        document.getElementById('edit-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const taskId = document.getElementById('edit-task-id').value;
            const empId = document.getElementById('edit-task-emp-id').value;
            
            const emp = state.employees.find(e => String(e.id) === String(empId));
            if (!emp) return;
            const task = emp.tasks.find(t => String(t.id) === String(taskId));
            if (!task) return;

            const type = document.getElementById('edit-task-type').value;
            const taskNum = document.getElementById('edit-task-number').value.trim();
            const title = document.getElementById('edit-task-title').value.trim();
            const gross = parseFloat(document.getElementById('edit-task-gross').value) || 0;
            const currency = document.getElementById('edit-task-currency').value;
            
            let deductionRate = emp.defaultDeductionRate;
            const customDeductVal = document.getElementById('edit-task-deduction').value;
            if (customDeductVal.trim() !== '') {
                const parsed = parseFloat(customDeductVal);
                if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
                    deductionRate = parsed;
                }
            }

            const fixedDeduction = parseFloat(document.getElementById('edit-task-fixed-deduction').value) || 0;
            const delayDeduction = parseFloat(document.getElementById('edit-task-delay-deduction').value) || 0;
            const advance = parseFloat(document.getElementById('edit-task-advance').value) || 0;
            const month = document.getElementById('edit-task-month').value;
            const status = document.getElementById('edit-task-status').value;

            const email = document.getElementById('edit-task-email').value.trim();
            const password = document.getElementById('edit-task-password').value.trim();
            const character = document.getElementById('edit-task-character').value.trim();
            const vpn = document.getElementById('edit-task-vpn').value.trim();

            task.type = type;
            task.taskNumber = taskNum;
            task.title = title;
            task.gross = gross;
            task.currency = currency;
            task.deductionRate = type === 'withdrawal' ? emp.defaultDeductionRate : deductionRate;
            task.fixedDeduction = type === 'withdrawal' ? 0 : fixedDeduction;
            task.delayDeduction = type === 'withdrawal' ? 0 : delayDeduction;
            task.advance = type === 'withdrawal' ? 0 : advance;
            task.month = month;
            task.status = status;
            task.email = email;
            task.password = password;
            task.character = character;
            task.vpn = vpn;

            if (status === 'paid') {
                if (!task.exchangeRate) task.exchangeRate = state.exchangeRate;
                if (!task.eurExchangeRate) task.eurExchangeRate = state.eurExchangeRate;
            } else {
                delete task.exchangeRate;
                delete task.eurExchangeRate;
            }

            const user = getAuthUser();
            if (user && user.role === 'leader') {
                task.employeeId = emp.id;
                saveTaskApi(task);
            } else {
                saveState();
            }
            calculateDashboardStats();
            renderEmployeeDetail(empId);

            editModal.classList.remove('active');
            showToast('toast-employee-updated');
            if (window.lucide) window.lucide.createIcons();
        });
    }

    // Password modal events
    document.getElementById('close-password-modal').addEventListener('click', () => {
        document.getElementById('password-modal').classList.remove('active');
    });
    document.getElementById('cancel-password-modal').addEventListener('click', () => {
        document.getElementById('password-modal').classList.remove('active');
    });
    document.getElementById('password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const pwd = document.getElementById('manager-password-input').value;
        const hash = await hashPassword(pwd);
        
        if (hash === '607f41f49b4af2f4584f54dfde33e17879d23bc0d94b6ff65b6e4feffe5e7c5d') {
            document.getElementById('password-modal').classList.remove('active');
            state.isManagerUnlocked = true;
            enterManagerDashboard();
        } else {
            document.getElementById('password-error-msg').style.display = 'block';
            document.getElementById('manager-password-input').select();
        }
    });

    // 6. Language Toggle Controller
    document.getElementById('lang-toggle-btn').addEventListener('click', () => {
        state.currentLanguage = state.currentLanguage === 'ar' ? 'en' : 'ar';
        localStorage.setItem('task_payout_lang', state.currentLanguage);
        updateUIVisuals();
    });

    // 7. Filters and Search inputs
    document.getElementById('employee-search').addEventListener('input', debounce(renderEmployeesList, 150));
    document.getElementById('task-filter-status').addEventListener('change', () => {
        if (state.selectedEmployeeId) {
            renderEmployeeDetail(state.selectedEmployeeId);
            if (window.lucide) window.lucide.createIcons();
        }
    });
    document.getElementById('task-filter-month').addEventListener('change', (e) => {
        const val = e.target.value;
        // Keep main dashboard filter in sync
        document.getElementById('dashboard-filter-month').value = val;
        
        calculateDashboardStats();
        if (state.selectedEmployeeId) {
            renderEmployeeDetail(state.selectedEmployeeId);
            if (window.lucide) window.lucide.createIcons();
        }
    });
    document.getElementById('dashboard-filter-month').addEventListener('change', (e) => {
        const val = e.target.value;
        // Keep employee profile filter in sync
        const empMonthFilter = document.getElementById('task-filter-month');
        if (empMonthFilter) {
            empMonthFilter.value = val;
        }
        
        calculateDashboardStats();
        if (state.viewMode === 'manager') {
            renderManagerPanel();
        } else if (state.viewMode === 'employee' && state.selectedEmployeeId) {
            renderEmployeeDetail(state.selectedEmployeeId);
            if (window.lucide) window.lucide.createIcons();
        }
    });

    // Operation type select listener
    const taskTypeSelect = document.getElementById('task-type');
    if (taskTypeSelect) {
        taskTypeSelect.addEventListener('change', (e) => {
            const isWithdrawal = e.target.value === 'withdrawal';
            const deductionGroup = document.getElementById('task-deduction-group');
            const adjustmentsRow = document.getElementById('task-adjustments-row-1');
            const advanceGroup = document.getElementById('task-advance-group');
            
            if (deductionGroup) deductionGroup.style.display = isWithdrawal ? 'none' : 'block';
            if (adjustmentsRow) adjustmentsRow.style.display = isWithdrawal ? 'none' : 'grid';
            if (advanceGroup) advanceGroup.style.visibility = isWithdrawal ? 'hidden' : 'visible';
            
            const grossLabel = document.getElementById('task-gross-label');
            if (grossLabel) {
                grossLabel.textContent = isWithdrawal 
                    ? (state.currentLanguage === 'ar' ? 'المبلغ المسحوب' : 'Withdrawn Amount')
                    : (state.currentLanguage === 'ar' ? 'القيمة قبل الخصم' : 'Gross Payout');
            }
        });
    }

    // Task search listener
    const searchTaskInput = document.getElementById('task-search-input');
    if (searchTaskInput) {
        searchTaskInput.addEventListener('input', () => {
            if (state.selectedEmployeeId) {
                renderEmployeeDetail(state.selectedEmployeeId);
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }

    // Export CSV listener
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            if (state.selectedEmployeeId) {
                exportEmployeeCSV(state.selectedEmployeeId);
            }
        });
    }

    // 8. Import / Export buttons hook-up
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });
    document.getElementById('import-file-input').addEventListener('change', importData);

    // 9. Printing hook-up
    document.getElementById('print-report-btn').addEventListener('click', () => {
        window.print();
    });

    // 10. Clear Data hook-up
    document.getElementById('clear-data-btn').addEventListener('click', () => {
        const confirmMsg = i18n[state.currentLanguage]['confirm-clear'];
        if (!confirm(confirmMsg)) return;

        state.employees = [];
        state.selectedEmployeeId = null;
        
        saveState();
        updateUIVisuals();
        
        showToast('toast-data-cleared');
    });

    // 11. Avatar events inside DOMContentLoaded
    const selectAvatarBtn = document.getElementById('select-avatar-btn');
    if (selectAvatarBtn) {
        selectAvatarBtn.addEventListener('click', () => {
            const fileInput = document.getElementById('employee-avatar-file');
            if (fileInput) fileInput.click();
        });
    }
    document.getElementById('employee-avatar-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxDim = 128;
                let w = img.width;
                let h = img.height;
                if (w > h) {
                    if (w > maxDim) {
                        h = Math.round(h * maxDim / w);
                        w = maxDim;
                    }
                } else {
                    if (h > maxDim) {
                        w = Math.round(w * maxDim / h);
                        h = maxDim;
                    }
                }
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);
                
                const base64 = canvas.toDataURL('image/jpeg', 0.7);
                
                const previewImg = document.getElementById('avatar-preview-img');
                const previewInitials = document.getElementById('avatar-preview-initials');
                previewImg.src = base64;
                previewImg.style.display = 'block';
                previewInitials.style.display = 'none';
                
                document.getElementById('remove-avatar-btn').style.display = 'block';
                state.tempAvatarUrl = base64;
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('remove-avatar-btn').addEventListener('click', () => {
        document.getElementById('employee-avatar-file').value = '';
        const previewImg = document.getElementById('avatar-preview-img');
        const previewInitials = document.getElementById('avatar-preview-initials');
        previewImg.src = '';
        previewImg.style.display = 'none';
        
        const empNameInput = document.getElementById('employee-name');
        const letter = empNameInput.value.trim() ? empNameInput.value.trim().charAt(0).toUpperCase() : '-';
        previewInitials.textContent = letter;
        previewInitials.style.display = 'block';
        
        document.getElementById('remove-avatar-btn').style.display = 'none';
        state.tempAvatarUrl = null;
    });

    document.getElementById('employee-name').addEventListener('input', (e) => {
        if (!state.tempAvatarUrl) {
            const letter = e.target.value.trim() ? e.target.value.trim().charAt(0).toUpperCase() : '-';
            document.getElementById('avatar-preview-initials').textContent = letter;
        }
    });

    // Event Delegation for Task Table Actions (Delete, Edit, Status Toggle, Credentials)
    const tasksTableBody = document.getElementById('tasks-table-body');
    if (tasksTableBody) {
        tasksTableBody.addEventListener('click', (e) => {
            const credsBtn = e.target.closest('.btn-credentials');
            if (credsBtn) {
                const empId = credsBtn.getAttribute('data-emp-id');
                const taskId = credsBtn.getAttribute('data-task-id');
                if (empId && taskId) window.showTaskCredentials(empId, taskId);
                return;
            }

            const delBtn = e.target.closest('.btn-delete-task');
            if (delBtn) {
                const empId = delBtn.getAttribute('data-emp-id');
                const taskId = delBtn.getAttribute('data-task-id');
                if (empId && taskId) window.deleteTask(empId, taskId);
                return;
            }

            const editBtn = e.target.closest('.btn-edit-task');
            if (editBtn) {
                const empId = editBtn.getAttribute('data-emp-id');
                const taskId = editBtn.getAttribute('data-task-id');
                if (empId && taskId) window.editTask(empId, taskId);
                return;
            }

            const statusBadge = e.target.closest('.btn-toggle-status');
            if (statusBadge) {
                const empId = statusBadge.getAttribute('data-emp-id');
                const taskId = statusBadge.getAttribute('data-task-id');
                if (empId && taskId) window.toggleTaskStatus(empId, taskId);
                return;
            }
        });
    }

    // Event Delegation for Employee Accounts Table (Manage Leader Employees & Delete Account)
    const accountsTableBody = document.getElementById('employee-accounts-table-body');
    if (accountsTableBody) {
        accountsTableBody.addEventListener('click', (e) => {
            const manageBtn = e.target.closest('.btn-manage-leader-employees');
            if (manageBtn) {
                const username = manageBtn.getAttribute('data-username');
                if (username && typeof window.openLeaderPermissionsModal === 'function') {
                    window.openLeaderPermissionsModal(username);
                }
                return;
            }

            const delBtn = e.target.closest('.btn-delete-account');
            if (delBtn) {
                const username = delBtn.getAttribute('data-username');
                if (username) window.deleteEmployeeAccount(username);
            }
        });
    }

    let activeApprovalUserId = null;
    let activeRejectionUserId = null;
    let activeSuspendUserId = null;
    let activeDeleteUserId = null;
    let activeActivateUserId = null;

    // Approval confirm modal close/cancel events
    const approvalConfirmModal = document.getElementById('approval-confirm-modal');
    if (approvalConfirmModal) {
        document.getElementById('close-approval-confirm-modal').addEventListener('click', () => {
            approvalConfirmModal.classList.remove('active');
            activeApprovalUserId = null;
        });
        document.getElementById('cancel-approval-confirm-modal').addEventListener('click', () => {
            approvalConfirmModal.classList.remove('active');
            activeApprovalUserId = null;
        });
        document.getElementById('submit-approval-confirm-modal').addEventListener('click', async () => {
            if (activeApprovalUserId) {
                approvalConfirmModal.classList.remove('active');
                await handleApproveRequest(activeApprovalUserId);
                activeApprovalUserId = null;
            }
        });
    }

    // Activation confirm modal close/cancel events
    const activationConfirmModal = document.getElementById('activation-confirm-modal');
    if (activationConfirmModal) {
        document.getElementById('close-activation-confirm-modal').addEventListener('click', () => {
            activationConfirmModal.classList.remove('active');
            activeActivateUserId = null;
        });
        document.getElementById('cancel-activation-confirm-modal').addEventListener('click', () => {
            activationConfirmModal.classList.remove('active');
            activeActivateUserId = null;
        });
        document.getElementById('submit-activation-confirm-modal').addEventListener('click', async () => {
            if (activeActivateUserId) {
                activationConfirmModal.classList.remove('active');
                await handleActivateRequest(activeActivateUserId);
                activeActivateUserId = null;
            }
        });
    }

    // Rejection prompt modal close/cancel/submit events
    const rejectionPromptModal = document.getElementById('rejection-prompt-modal');
    if (rejectionPromptModal) {
        document.getElementById('close-rejection-prompt-modal').addEventListener('click', () => {
            rejectionPromptModal.classList.remove('active');
            activeRejectionUserId = null;
        });
        document.getElementById('cancel-rejection-prompt-modal').addEventListener('click', () => {
            rejectionPromptModal.classList.remove('active');
            activeRejectionUserId = null;
        });
        const rejectionForm = document.getElementById('rejection-prompt-form');
        if (rejectionForm) {
            rejectionForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const reason = document.getElementById('rejection-reason-input').value.trim();
                if (activeRejectionUserId) {
                    rejectionPromptModal.classList.remove('active');
                    await handleRejectRequest(activeRejectionUserId, reason);
                    activeRejectionUserId = null;
                }
            });
        }
    }

    // Suspend prompt modal close/cancel/submit events
    const suspendPromptModal = document.getElementById('suspend-prompt-modal');
    if (suspendPromptModal) {
        document.getElementById('close-suspend-prompt-modal').addEventListener('click', () => {
            suspendPromptModal.classList.remove('active');
            activeSuspendUserId = null;
        });
        document.getElementById('cancel-suspend-prompt-modal').addEventListener('click', () => {
            suspendPromptModal.classList.remove('active');
            activeSuspendUserId = null;
        });
        const suspendForm = document.getElementById('suspend-prompt-form');
        if (suspendForm) {
            suspendForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const reason = document.getElementById('suspend-reason-input').value.trim();
                if (activeSuspendUserId) {
                    suspendPromptModal.classList.remove('active');
                    await handleSuspendRequest(activeSuspendUserId, reason);
                    activeSuspendUserId = null;
                }
            });
        }
    }

    // Delete admin confirmation modal close/cancel/submit events
    const deleteAdminConfirmModal = document.getElementById('delete-admin-confirm-modal');
    if (deleteAdminConfirmModal) {
        document.getElementById('close-delete-admin-confirm-modal').addEventListener('click', () => {
            deleteAdminConfirmModal.classList.remove('active');
            activeDeleteUserId = null;
        });
        document.getElementById('cancel-delete-admin-confirm-modal').addEventListener('click', () => {
            deleteAdminConfirmModal.classList.remove('active');
            activeDeleteUserId = null;
        });
        document.getElementById('submit-delete-admin-confirm-modal').addEventListener('click', async () => {
            if (activeDeleteUserId) {
                deleteAdminConfirmModal.classList.remove('active');
                await handleDeleteAdminRequest(activeDeleteUserId);
                activeDeleteUserId = null;
            }
        });
    }

    // Event Delegation for Pending Registration Requests
    const pendingTableBody = document.getElementById('pending-requests-table-body');
    if (pendingTableBody) {
        pendingTableBody.addEventListener('click', async (e) => {
            const approveBtn = e.target.closest('.btn-approve-request');
            if (approveBtn) {
                const userId = approveBtn.getAttribute('data-id');
                if (userId && approvalConfirmModal) {
                    activeApprovalUserId = userId;
                    approvalConfirmModal.classList.add('active');
                }
                return;
            }

            const rejectBtn = e.target.closest('.btn-reject-request');
            if (rejectBtn) {
                const userId = rejectBtn.getAttribute('data-id');
                if (userId && rejectionPromptModal) {
                    activeRejectionUserId = userId;
                    const reasonInput = document.getElementById('rejection-reason-input');
                    if (reasonInput) reasonInput.value = '';
                    rejectionPromptModal.classList.add('active');
                }
                return;
            }

            const suspendBtn = e.target.closest('.btn-suspend-request');
            if (suspendBtn) {
                const userId = suspendBtn.getAttribute('data-id');
                if (userId && suspendPromptModal) {
                    activeSuspendUserId = userId;
                    const reasonInput = document.getElementById('suspend-reason-input');
                    if (reasonInput) {
                        const row = suspendBtn.closest('tr');
                        const badge = row ? row.querySelector('.badge') : null;
                        const currentReason = badge ? badge.getAttribute('title') : '';
                        reasonInput.value = currentReason || '';
                    }
                    suspendPromptModal.classList.add('active');
                }
                return;
            }

            const activateBtn = e.target.closest('.btn-activate-request');
            if (activateBtn) {
                const userId = activateBtn.getAttribute('data-id');
                if (userId && activationConfirmModal) {
                    activeActivateUserId = userId;
                    activationConfirmModal.classList.add('active');
                }
                return;
            }

            const deleteAdminBtn = e.target.closest('.btn-delete-admin-request');
            if (deleteAdminBtn) {
                const userId = deleteAdminBtn.getAttribute('data-id');
                if (userId && deleteAdminConfirmModal) {
                    activeDeleteUserId = userId;
                    deleteAdminConfirmModal.classList.add('active');
                }
                return;
            }
        });
    }

    // Ensure Lucide icons render reliably
    function ensureLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }
    ensureLucideIcons();
    let lucideAttempts = 0;
    const lucideTimer = setInterval(() => {
        lucideAttempts++;
        ensureLucideIcons();
        if (window.lucide || lucideAttempts > 30) clearInterval(lucideTimer);
    }, 150);
});

// --- Sorting actions global handlers ---
window.moveEmployeeUp = function(event, id) {
    event.stopPropagation();
    const index = state.employees.findIndex(e => e.id === id);
    if (index <= 0) return;

    const temp = state.employees[index];
    state.employees[index] = state.employees[index - 1];
    state.employees[index - 1] = temp;

    saveState();
    renderEmployeesList();
};

window.moveEmployeeDown = function(event, id) {
    event.stopPropagation();
    const index = state.employees.findIndex(e => e.id === id);
    if (index < 0 || index >= state.employees.length - 1) return;

    const temp = state.employees[index];
    state.employees[index] = state.employees[index + 1];
    state.employees[index + 1] = temp;

    saveState();
    renderEmployeesList();
};

// --- Task Credentials Modal & Clipboard Helpers ---
window.copyTextToClipboard = function(text, label) {
    if (!text) return;
    const isAr = state.currentLanguage === 'ar';
    const successMsg = isAr ? `تم نسخ ${label} بنجاح!` : `${label} copied to clipboard!`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToastDirectMsg(successMsg);
        }).catch(() => {
            fallbackCopyText(text, successMsg);
        });
    } else {
        fallbackCopyText(text, successMsg);
    }
};

function fallbackCopyText(text, successMsg) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
        document.execCommand('copy');
        showToastDirectMsg(successMsg);
    } catch(e) {}
    document.body.removeChild(input);
}

function showToastDirectMsg(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
        toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

window.showTaskCredentials = function(empId, taskId) {
    const emp = state.employees.find(e => String(e.id) === String(empId));
    if (!emp) return;
    const task = emp.tasks.find(t => String(t.id) === String(taskId));
    if (!task) return;

    const modal = document.getElementById('credentials-modal');
    const modalBody = document.getElementById('credentials-modal-body');
    const isAr = state.currentLanguage === 'ar';
    modalBody.innerHTML = '';

    const items = [
        { label: isAr ? 'البريد الإلكتروني (Email)' : 'Email Address', val: task.email, icon: 'mail', copyLabel: 'الإيميل' },
        { label: isAr ? 'كلمة المرور (Password)' : 'Password', val: task.password, icon: 'key', copyLabel: 'كلمة المرور', isPass: true },
        { label: isAr ? 'اسم الشخصية (Character)' : 'Character Name', val: task.character, icon: 'user', copyLabel: 'اسم الشخصية' },
        { label: isAr ? 'الـ VPN (Location)' : 'VPN Location', val: task.vpn, icon: 'shield', copyLabel: 'موقع الـ VPN' }
    ];

    let count = 0;
    items.forEach(item => {
        if (!item.val) return;
        count++;
        const row = document.createElement('div');
        row.style.cssText = 'background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px;';
        
        const valId = 'cred_val_' + Math.random().toString(36).substr(2, 6);
        const passVal = item.isPass ? '••••••••' : escapeHTML(item.val);

        // Build info section (display only - escaped)
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'display: flex; flex-direction: column; gap: 2px; overflow: hidden; flex: 1;';
        infoDiv.innerHTML = `
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">${escapeHTML(item.label)}</span>
            <span id="${valId}" style="font-family: monospace; font-size: 13px; font-weight: 700; color: #fff; word-break: break-all;">${passVal}</span>
        `;

        // Build action buttons with safe event listeners (NO inline onclick)
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = 'display: flex; gap: 6px; flex-shrink: 0; align-items: center;';

        if (item.isPass) {
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'btn btn-secondary btn-icon-only btn-sm';
            toggleBtn.innerHTML = '<i data-lucide="eye" style="width:14px;height:14px;"></i>';
            toggleBtn.addEventListener('click', () => togglePassVisibility(valId, item.val));
            actionsDiv.appendChild(toggleBtn);
        }

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn-primary btn-sm';
        copyBtn.innerHTML = `<i data-lucide="copy" style="width:14px;height:14px;"></i> ${isAr ? 'نسخ' : 'Copy'}`;
        copyBtn.addEventListener('click', () => copyTextToClipboard(item.val, item.copyLabel));
        actionsDiv.appendChild(copyBtn);

        row.appendChild(infoDiv);
        row.appendChild(actionsDiv);
        modalBody.appendChild(row);
    });

    if (count === 0) {
        modalBody.innerHTML = `<p style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px;">${isAr ? 'لا توجد بيانات حساب مسجلة لهذه المهمة.' : 'No credentials recorded for this task.'}</p>`;
    }

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
};

window.togglePassVisibility = function(elementId, realValue) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (el.textContent === '••••••••') {
        el.textContent = realValue;
    } else {
        el.textContent = '••••••••';
    }
};

window.initSmokeEffect = function() {
    const overlays = document.querySelectorAll('.login-overlay');
    overlays.forEach(overlay => {
        const canvas = overlay.querySelector('.smoke-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = 0, height = 0;
        let ambientStars = [];
        let shootingStars = [];
        let mouseTrail = [];

        function resize() {
            width = canvas.width = overlay.clientWidth || window.innerWidth;
            height = canvas.height = overlay.clientHeight || window.innerHeight;
            initAmbientStars();
        }

        // 1. Initialize Ambient Twinkling Cosmic Stars & Stardust
        function initAmbientStars() {
            ambientStars = [];
            const starCount = Math.floor((width * height) / 5000) + 110;
            for (let i = 0; i < starCount; i++) {
                ambientStars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2.2 + 0.6,
                    baseAlpha: Math.random() * 0.65 + 0.25,
                    twinkleSpeed: Math.random() * 0.035 + 0.01,
                    twinklePhase: Math.random() * Math.PI * 2,
                    isBig: Math.random() > 0.88,
                    color: Math.random() > 0.7 ? '255, 220, 240' : (Math.random() > 0.4 ? '200, 230, 255' : '255, 255, 255')
                });
            }
        }

        resize();
        window.addEventListener('resize', resize);

        // 2. Spawn Falling Shooting Star / Meteor
        function spawnShootingStar() {
            const startX = Math.random() * (width * 0.8) + (width * 0.1);
            const startY = Math.random() * (height * 0.4);
            const speed = Math.random() * 7 + 7;
            const angle = (Math.PI / 180) * (Math.random() * 15 + 25); // 25-40 deg diagonal
            shootingStars.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                length: Math.random() * 80 + 70,
                alpha: 1.0,
                decay: Math.random() * 0.015 + 0.01,
                thickness: Math.random() * 1.5 + 1.2
            });
        }

        // Spawn shooting star every 2.2 seconds
        setInterval(() => {
            if (overlay.classList.contains('active')) {
                spawnShootingStar();
                if (Math.random() > 0.6) {
                    setTimeout(spawnShootingStar, 400);
                }
            }
        }, 2200);

        // 3. Interactive Mouse Stardust Trail
        function addMouseStardust(x, y) {
            for (let i = 0; i < 3; i++) {
                mouseTrail.push({
                    x: x + (Math.random() - 0.5) * 12,
                    y: y + (Math.random() - 0.5) * 12,
                    size: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2 - 0.4,
                    alpha: Math.random() * 0.8 + 0.2,
                    decay: Math.random() * 0.02 + 0.015,
                    color: Math.random() > 0.4 ? '255, 255, 255' : '200, 225, 255'
                });
            }
        }

        let lastX = 0, lastY = 0;
        overlay.addEventListener('mousemove', (e) => {
            const rect = overlay.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const dist = Math.hypot(x - lastX, y - lastY);
            if (dist > 5) {
                addMouseStardust(x, y);
                lastX = x;
                lastY = y;
            }
        });

        // 4. Render Loop
        function render() {
            ctx.clearRect(0, 0, width, height);

            // A. Draw Ambient Twinkling Stars
            for (let i = 0; i < ambientStars.length; i++) {
                const s = ambientStars[i];
                s.twinklePhase += s.twinkleSpeed;
                const alpha = Math.max(0.1, s.baseAlpha + Math.sin(s.twinklePhase) * 0.35);

                ctx.save();
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();

                // Lens flare for big stars
                if (s.isBig && alpha > 0.5) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
                    ctx.lineWidth = 0.8;
                    const flareLen = s.size * 3.5;
                    ctx.beginPath();
                    ctx.moveTo(s.x - flareLen, s.y);
                    ctx.lineTo(s.x + flareLen, s.y);
                    ctx.moveTo(s.x, s.y - flareLen);
                    ctx.lineTo(s.x, s.y + flareLen);
                    ctx.stroke();
                }
                ctx.restore();
            }

            // B. Draw Falling Shooting Stars / Meteors
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const m = shootingStars[i];
                m.x += m.vx;
                m.y += m.vy;
                m.alpha -= m.decay;

                if (m.alpha <= 0 || m.x > width || m.y > height) {
                    shootingStars.splice(i, 1);
                    continue;
                }

                const headX = m.x;
                const headY = m.y;
                const dist = Math.hypot(m.vx, m.vy);
                const tailX = m.x - (m.vx / dist) * m.length;
                const tailY = m.y - (m.vy / dist) * m.length;

                ctx.save();
                const grad = ctx.createLinearGradient(headX, headY, tailX, tailY);
                grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
                grad.addColorStop(0.3, `rgba(220, 235, 255, ${m.alpha * 0.7})`);
                grad.addColorStop(1, 'rgba(180, 200, 240, 0)');

                ctx.strokeStyle = grad;
                ctx.lineWidth = m.thickness;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(headX, headY);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();

                ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(headX, headY, m.thickness * 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // C. Draw Interactive Mouse Stardust
            for (let i = mouseTrail.length - 1; i >= 0; i--) {
                const p = mouseTrail[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    mouseTrail.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.shadowColor = `rgba(${p.color}, ${p.alpha * 0.8})`;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            requestAnimationFrame(render);
        }
        render();
    });
};

window.initReviewsSlider = function() {
    const sliders = document.querySelectorAll('.reviews-slider');
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.review-slide');
        if (slides.length <= 1) return;
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 4500);
    });
};

window.playSplitCardIntro = function() {
    const overlay = document.getElementById('login-overlay');
    if (!overlay) return;

    // Reset Classes
    overlay.classList.remove('unlocking', 'merged');
    overlay.classList.add('intro-mode');

    // Step 1: Doors split open outwards from center (0.45s)
    setTimeout(() => {
        overlay.classList.add('unlocking');
    }, 450);

    // Step 2: Doors fully open to reveal main card form content (1.35s)
    setTimeout(() => {
        overlay.classList.add('merged');
    }, 1350);

    // Step 3: Complete Intro & focus username input (2.0s)
    setTimeout(() => {
        overlay.classList.remove('intro-mode', 'unlocking', 'merged');
        const userInput = document.getElementById('login-username');
        if (userInput) {
            userInput.removeAttribute('disabled');
            userInput.style.pointerEvents = 'auto';
            userInput.focus();
        }
        const passInput = document.getElementById('login-password');
        if (passInput) {
            passInput.removeAttribute('disabled');
            passInput.style.pointerEvents = 'auto';
        }
    }, 2000);
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.initSmokeEffect) window.initSmokeEffect();
    if (window.initReviewsSlider) window.initReviewsSlider();

    const replayBtn = document.getElementById('replay-intro-btn');
    if (replayBtn) {
        replayBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.playSplitCardIntro();
        });
    }

    const loginOverlay = document.getElementById('login-overlay');
    if (loginOverlay && loginOverlay.classList.contains('active')) {
        setTimeout(window.playSplitCardIntro, 350);
    }
});

