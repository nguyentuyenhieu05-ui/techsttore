import React, { useState } from 'react';
import { X, Code2, Copy, Check, Clock, RefreshCw, BookOpen, Layers, CheckCircle2, XCircle, AlertCircle, Filter } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface SeleniumCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TestCaseItem {
  id: string;
  module: string;
  title: string;
  technique: 'Phân tích giá trị biên (BVA)' | 'Phân vùng tương đương (EP)' | 'Chuyển đổi trạng thái (State)' | 'Bảng quyết định (Decision Table)' | 'Đoán lỗi (Error Guessing)' | 'Kịch bản tổng hợp (E2E)';
  steps: string[];
  inputData: string;
  expectedResult: string;
  locators: string[];
}

export const TEST_CASES: TestCaseItem[] = [
  {
    id: 'TC-AUTH-01',
    module: 'Xác thực',
    title: 'Đăng nhập thành công với tài khoản khách hàng hợp lệ',
    technique: 'Phân vùng tương đương (EP)',
    steps: [
      'Bấm nút Đăng nhập (#btn-open-login)',
      'Nhập email: khachhang@techstore.vn (#login-email)',
      'Nhập password: Password123! (#login-password)',
      'Bấm nút Submit (#btn-login-submit)'
    ],
    inputData: 'Email: khachhang@techstore.vn | Pass: Password123!',
    expectedResult: 'Đăng nhập thành công, modal đóng lại, hiển thị lời chào tên Nguyễn Văn An trên thanh header (#user-greeting)',
    locators: ['#btn-open-login', '#login-email', '#login-password', '#btn-login-submit', '#user-greeting']
  },
  {
    id: 'TC-AUTH-02',
    module: 'Xác thực',
    title: 'Đăng nhập thất bại khi nhập sai mật khẩu',
    technique: 'Phân vùng tương đương (EP)',
    steps: [
      'Mở modal đăng nhập',
      'Nhập email: khachhang@techstore.vn',
      'Nhập password sai: SaiMatKhau999',
      'Bấm Submit'
    ],
    inputData: 'Email: khachhang@techstore.vn | Pass: SaiMatKhau999',
    expectedResult: 'Hiển thị thông báo lỗi "Email hoặc mật khẩu không chính xác" tại #login-error-alert',
    locators: ['#login-email', '#login-password', '#btn-login-submit', '#login-error-alert']
  },
  {
    id: 'TC-AUTH-03',
    module: 'Xác thực',
    title: 'Báo lỗi khi để trống trường email hoặc mật khẩu',
    technique: 'Đoán lỗi (Error Guessing)',
    steps: [
      'Mở modal đăng nhập',
      'Để trống cả 2 ô hoặc chỉ điền email',
      'Bấm Submit'
    ],
    inputData: 'Email: [Để trống] | Pass: [Để trống]',
    expectedResult: 'Hiển thị cảnh báo "Vui lòng nhập đầy đủ địa chỉ email và mật khẩu"',
    locators: ['#login-email', '#login-password', '#btn-login-submit', '#login-error-alert']
  },
  {
    id: 'TC-REG-01',
    module: 'Đăng ký',
    title: 'Kiểm tra biên độ dài mật khẩu đăng ký (< 6 và >= 6 ký tự)',
    technique: 'Phân tích giá trị biên (BVA)',
    steps: [
      'Chuyển sang tab Đăng ký (#tab-register)',
      'Nhập họ tên, email hợp lệ',
      'Test biên 1: Nhập mật khẩu 5 ký tự (12345) -> Bấm Đăng ký',
      'Test biên 2: Nhập mật khẩu 6 ký tự (123456) -> Bấm Đăng ký'
    ],
    inputData: 'Giá trị biên: N = 5 ký tự (Không hợp lệ), N = 6 ký tự (Hợp lệ)',
    expectedResult: 'Tại 5 ký tự: Báo lỗi "Mật khẩu bảo mật phải có ít nhất 6 ký tự" tại #register-error-alert. Tại 6 ký tự: Đăng ký thành công.',
    locators: ['#tab-register', '#register-password', '#register-confirm-password', '#register-error-alert', '#btn-register-submit']
  },
  {
    id: 'TC-REG-02',
    module: 'Đăng ký',
    title: 'Báo lỗi khi mật khẩu xác nhận không khớp',
    technique: 'Phân vùng tương đương (EP)',
    steps: [
      'Nhập mật khẩu: MatKhau123',
      'Nhập xác nhận: MatKhauKhac999',
      'Tích chọn điều khoản & bấm Đăng ký'
    ],
    inputData: 'Pass: MatKhau123 | Confirm: MatKhauKhac999',
    expectedResult: 'Báo lỗi "Mật khẩu xác nhận không khớp với mật khẩu đã nhập"',
    locators: ['#register-password', '#register-confirm-password', '#register-error-alert']
  },
  {
    id: 'TC-REG-03',
    module: 'Đăng ký',
    title: 'Bắt buộc đồng ý điều khoản dịch vụ mới được tạo tài khoản',
    technique: 'Bảng quyết định (Decision Table)',
    steps: [
      'Điền toàn bộ form đăng ký hợp lệ',
      'Bỏ tích checkbox điều khoản (#register-terms)',
      'Bấm nút Đăng ký'
    ],
    inputData: 'Checkbox agreeTerms: False',
    expectedResult: 'Báo lỗi "Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật"',
    locators: ['#register-terms', '#btn-register-submit', '#register-error-alert']
  },
  {
    id: 'TC-SEARCH-01',
    module: 'Tìm kiếm',
    title: 'Tìm kiếm sản phẩm thành công với từ khóa chính xác',
    technique: 'Phân vùng tương đương (EP)',
    steps: [
      'Nhập từ khóa "titanium" vào ô tìm kiếm (#search-input)',
      'Nhấn Enter hoặc submit form'
    ],
    inputData: 'Từ khóa: "titanium"',
    expectedResult: 'Danh sách sản phẩm được lọc lại, số lượng hiển thị đúng (#product-count-display), các sản phẩm hiển thị đều chứa từ khóa.',
    locators: ['#search-input', '#search-btn', '#product-count-display', '#product-grid']
  },
  {
    id: 'TC-SEARCH-02',
    module: 'Tìm kiếm',
    title: 'Tìm kiếm từ khóa không tồn tại trả về giao diện rỗng',
    technique: 'Phân vùng tương đương (EP)',
    steps: [
      'Nhập chuỗi vô nghĩa "xyz999nonsense" vào ô #search-input',
      'Nhấn Enter'
    ],
    inputData: 'Từ khóa: "xyz999nonsense"',
    expectedResult: 'Hiển thị màn hình rỗng #empty-products-msg với thông báo "Không tìm thấy sản phẩm phù hợp".',
    locators: ['#search-input', '#empty-products-msg', '#btn-empty-reset']
  },
  {
    id: 'TC-FILTER-01',
    module: 'Bộ lọc',
    title: 'Lọc sản phẩm theo khoảng giá tối thiểu và tối đa',
    technique: 'Phân tích giá trị biên (BVA)',
    steps: [
      'Nhập giá từ: 5000000 (#filter-min-price)',
      'Nhập đến: 10000000 (#filter-max-price)',
      'Kiểm tra danh sách sản phẩm hiển thị'
    ],
    inputData: 'Min: 5.000.000 ₫ | Max: 10.000.000 ₫',
    expectedResult: 'Chỉ các sản phẩm có giá nằm trong đoạn [5.000.000, 10.000.000] xuất hiện trên màn hình.',
    locators: ['#filter-min-price', '#filter-max-price', '#product-grid']
  },
  {
    id: 'TC-PROD-01',
    module: 'Sản phẩm',
    title: 'Kiểm tra biên số lượng mua tại trang chi tiết (Min = 1, Max = Tồn kho)',
    technique: 'Phân tích giá trị biên (BVA)',
    steps: [
      'Bấm xem chi tiết một sản phẩm (#btn-quickview-prod-1)',
      'Tại số lượng = 1, kiểm tra nút Giảm (#btn-qty-minus) bị disabled',
      'Bấm nút Tăng (#btn-qty-plus) liên tục cho đến khi đạt tồn kho tối đa',
      'Kiểm tra nút Tăng bị disabled khi đạt giới hạn tồn kho'
    ],
    inputData: 'Min Boundary: 1 | Max Boundary: Stock quantity',
    expectedResult: 'Số lượng mua không thể giảm < 1 và không thể tăng > số lượng trong kho.',
    locators: ['#btn-qty-minus', '#input-qty', '#btn-qty-plus', '#detail-stock-qty']
  },
  {
    id: 'TC-PROD-02',
    module: 'Sản phẩm',
    title: 'Kiểm tra sản phẩm hết hàng (Stock = 0) bị vô hiệu hóa đặt mua',
    technique: 'Phân tích giá trị biên (BVA)',
    steps: [
      'Tìm sản phẩm "prod-8" (Sản phẩm hết hàng)',
      'Kiểm tra nút Thêm giỏ trên card (#btn-add-cart-prod-8)',
      'Mở xem chi tiết sản phẩm prod-8'
    ],
    inputData: 'Sản phẩm prod-8 có stock = 0',
    expectedResult: 'Nút "Thêm giỏ" bị disabled, có chữ "Hết hàng". Trong modal chi tiết hiển thị cảnh báo tạm hết hàng.',
    locators: ['#btn-add-cart-prod-8', '#product-stock-prod-8', '#detail-stock-status']
  },
  {
    id: 'TC-CART-01',
    module: 'Giỏ hàng',
    title: 'Áp dụng mã giảm giá theo tỷ lệ phần trăm (GIAM10)',
    technique: 'Phân vùng tương đương (EP)',
    steps: [
      'Thêm sản phẩm giá > 500.000đ vào giỏ',
      'Mở giỏ hàng (#btn-open-cart)',
      'Nhập mã: GIAM10 (#input-coupon)',
      'Bấm Áp dụng (#btn-apply-coupon)'
    ],
    inputData: 'Voucher: GIAM10',
    expectedResult: 'Hiển thị thẻ #active-coupon-badge, dòng Giảm giá (#cart-discount) hiển thị đúng 10% giá trị tạm tính.',
    locators: ['#btn-open-cart', '#input-coupon', '#btn-apply-coupon', '#cart-discount', '#active-coupon-badge']
  },
  {
    id: 'TC-CART-02',
    module: 'Giỏ hàng',
    title: 'Áp dụng mã miễn phí vận chuyển (FREESHIP)',
    technique: 'Phân vùng tương đương (EP)',
    steps: [
      'Mở giỏ hàng',
      'Nhập mã: FREESHIP',
      'Bấm Áp dụng'
    ],
    inputData: 'Voucher: FREESHIP',
    expectedResult: 'Dòng phí giao hàng (#cart-shipping) đổi thành "Miễn phí", giảm trừ 30.000₫ trong tổng tiền.',
    locators: ['#input-coupon', '#btn-apply-coupon', '#cart-shipping', '#cart-total']
  },
  {
    id: 'TC-CART-03',
    module: 'Giỏ hàng',
    title: 'Báo lỗi khi nhập mã giảm giá đã hết hạn sử dụng',
    technique: 'Phân vùng tương đương (EP)',
    steps: [
      'Mở giỏ hàng',
      'Nhập mã: EXPIRED',
      'Bấm Áp dụng'
    ],
    inputData: 'Voucher: EXPIRED',
    expectedResult: 'Xuất hiện thông báo lỗi tại #coupon-feedback: "Mã giảm giá đã hết hạn sử dụng".',
    locators: ['#input-coupon', '#btn-apply-coupon', '#coupon-feedback']
  },
  {
    id: 'TC-CHECKOUT-01',
    module: 'Thanh toán',
    title: 'Kiểm tra biên số điện thoại giao hàng (9 số, 10 số, 11 số)',
    technique: 'Phân tích giá trị biên (BVA)',
    steps: [
      'Từ giỏ hàng, bấm Tiến hành đặt hàng (#btn-proceed-checkout)',
      'Test biên N=9 số (090123456) -> Bấm Đặt hàng',
      'Test biên N=11 số (09012345678) -> Bấm Đặt hàng',
      'Test biên N=10 số bắt đầu bằng 0 (0901234567) -> Hợp lệ'
    ],
    inputData: 'Biên 9 số / 11 số (Invalid) | 10 số (Valid)',
    expectedResult: 'Tại 9 hoặc 11 số: Báo lỗi #error-phone: "Số điện thoại không hợp lệ (phải gồm 10 chữ số bắt đầu bằng số 0)". Tại 10 số: Hợp lệ.',
    locators: ['#checkout-phone', '#error-phone', '#btn-place-order']
  },
  {
    id: 'TC-CHECKOUT-02',
    module: 'Thanh toán',
    title: 'Kiểm tra định dạng email nhận hóa đơn',
    technique: 'Phân vùng tương đương (EP)',
    steps: [
      'Nhập email sai cú pháp: abcxyz@ hoặc khongcodomain',
      'Bấm nút Đặt hàng'
    ],
    inputData: 'Email: abcxyz@',
    expectedResult: 'Xuất hiện lỗi #error-email: "Địa chỉ email không đúng định dạng".',
    locators: ['#checkout-email', '#error-email', '#btn-place-order']
  },
  {
    id: 'TC-CHECKOUT-03',
    module: 'Thanh toán',
    title: 'Đặt hàng thành công với hình thức COD & Sinh mã đơn hàng ORD-...',
    technique: 'Kịch bản tổng hợp (E2E)',
    steps: [
      'Điền đầy đủ thông tin nhận hàng hợp lệ',
      'Chọn hình thức COD (#payment-cod)',
      'Bấm nút Đặt hàng (#btn-place-order)'
    ],
    inputData: 'Tên, Phone 10 số, Email, Địa chỉ, COD',
    expectedResult: 'Hiển thị modal thành công #modal-order-success, sinh mã đơn hàng ORD-XXXXX (#order-code-display), giỏ hàng được làm rỗng.',
    locators: ['#btn-place-order', '#modal-order-success', '#order-code-display', '#cart-badge-count']
  },
  {
    id: 'TC-ORDER-01',
    module: 'Đơn hàng',
    title: 'Hủy đơn hàng đang ở trạng thái Chờ xác nhận (pending) & Hoàn tồn kho',
    technique: 'Chuyển đổi trạng thái (State)',
    steps: [
      'Mở xem danh sách đơn hàng (#nav-orders)',
      'Tìm đơn hàng có trạng thái "Chờ xác nhận" (pending)',
      'Bấm nút "Hủy đơn" (#btn-cancel-order-...) và xác nhận trên prompt'
    ],
    inputData: 'Đơn hàng state: pending -> cancelled',
    expectedResult: 'Trạng thái đổi thành "Đã hủy" (#order-status), số lượng tồn kho của các sản phẩm trong đơn được hoàn lại.',
    locators: ['#nav-orders', '#btn-cancel-order', '#order-status', '#cancel-order-feedback']
  }
];

export const SeleniumCheatSheetModal: React.FC<SeleniumCheatSheetModalProps> = ({
  isOpen,
  onClose
}) => {
  const { networkLatency, setNetworkLatency, resetDatabase } = useStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'python' | 'locators'>('scenarios');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  
  // Interactive test status tracker (passed, failed, pending)
  const [testResults, setTestResults] = useState<Record<string, 'pass' | 'fail' | 'pending'>>({});

  if (!isOpen) return null;

  const toggleTestStatus = (id: string, status: 'pass' | 'fail') => {
    setTestResults((prev) => ({
      ...prev,
      [id]: prev[id] === status ? 'pending' : status
    }));
  };

  const filteredTestCases = selectedModule === 'all'
    ? TEST_CASES
    : TEST_CASES.filter((tc) => tc.module === selectedModule);

  const passedCount = Object.values(testResults).filter((v) => v === 'pass').length;
  const failedCount = Object.values(testResults).filter((v) => v === 'fail').length;

  const pythonScript = `import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 1. Khởi tạo Chrome WebDriver
driver = webdriver.Chrome()
driver.maximize_window()
wait = WebDriverWait(driver, 10)

try:
    # 2. Truy cập trang web
    driver.get("http://localhost:3000")  # Hoặc URL triển khai của bạn
    print(">>> Đã mở trang web thành công!")

    # ---------------------------------------------------------
    # TEST CASE 1: Kiểm thử Đăng nhập tài khoản khách hàng
    # ---------------------------------------------------------
    btn_login = wait.until(EC.element_to_be_clickable((By.ID, "btn-open-login")))
    btn_login.click()

    email_input = wait.until(EC.visibility_of_element_located((By.ID, "login-email")))
    email_input.clear()
    email_input.send_keys("khachhang@techstore.vn")

    pass_input = driver.find_element(By.ID, "login-password")
    pass_input.clear()
    pass_input.send_keys("Password123!")

    driver.find_element(By.ID, "btn-login-submit").click()

    user_greeting = wait.until(EC.visibility_of_element_located((By.ID, "user-greeting")))
    print(">>> TC1 PASSED: Đăng nhập thành công với:", user_greeting.text)

    # ---------------------------------------------------------
    # TEST CASE 2: Tìm kiếm sản phẩm & Thêm vào giỏ hàng
    # ---------------------------------------------------------
    search_input = driver.find_element(By.ID, "search-input")
    search_input.clear()
    search_input.send_keys("titanium")
    search_input.submit()

    add_cart_btn = wait.until(EC.element_to_be_clickable((By.ID, "btn-add-cart-prod-1")))
    add_cart_btn.click()

    cart_badge = wait.until(EC.visibility_of_element_located((By.ID, "cart-badge-count")))
    assert int(cart_badge.text) >= 1
    print(">>> TC2 PASSED: Thêm vào giỏ hàng thành công! Số lượng:", cart_badge.text)

    # ---------------------------------------------------------
    # TEST CASE 3: Mở giỏ hàng, áp dụng Voucher và Đặt hàng
    # ---------------------------------------------------------
    driver.find_element(By.ID, "btn-open-cart").click()

    coupon_input = wait.until(EC.visibility_of_element_located((By.ID, "input-coupon")))
    coupon_input.clear()
    coupon_input.send_keys("GIAM10")
    driver.find_element(By.ID, "btn-apply-coupon").click()

    wait.until(EC.visibility_of_element_located((By.ID, "active-coupon-badge")))
    print(">>> TC3 PASSED: Áp dụng voucher GIAM10 thành công!")

    driver.find_element(By.ID, "btn-proceed-checkout").click()

    name_field = wait.until(EC.visibility_of_element_located((By.ID, "checkout-name")))
    name_field.clear()
    name_field.send_keys("Nguyễn Văn An")

    phone_field = driver.find_element(By.ID, "checkout-phone")
    phone_field.clear()
    phone_field.send_keys("0901234567")

    email_field = driver.find_element(By.ID, "checkout-email")
    email_field.clear()
    email_field.send_keys("an.nguyen@test.vn")

    address_field = driver.find_element(By.ID, "checkout-address")
    address_field.clear()
    address_field.send_keys("123 Đường Cầu Giấy, Hà Nội")

    driver.find_element(By.ID, "payment-cod").click()
    driver.find_element(By.ID, "btn-place-order").click()

    order_code_elem = wait.until(EC.visibility_of_element_located((By.ID, "order-code-display")))
    print(">>> TC4 PASSED: Đặt hàng thành công! Mã đơn:", order_code_elem.text)

    time.sleep(3)

finally:
    driver.quit()
    print(">>> Hoàn tất quá trình kiểm thử Selenium!")
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div
      id="modal-cheatsheet-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div
        id="modal-cheatsheet"
        data-testid="modal-cheatsheet"
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold">
                Trung Tâm Kiểm Thử Hộp Đen (Black-Box Test Suite & Selenium)
              </h2>
              <p className="text-xs text-slate-400">
                Bộ kịch bản test cases hoàn chỉnh chuẩn QA/QC, bộ theo dõi kết quả Pass/Fail và mã tự động hóa
              </p>
            </div>
          </div>
          <button
            id="btn-close-cheatsheet"
            data-testid="btn-close-cheatsheet"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selenium Simulator Control Strip */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Độ trễ mạng mô phỏng:
            </span>
            <select
              id="select-latency"
              data-testid="select-latency"
              value={networkLatency}
              onChange={(e) => setNetworkLatency(Number(e.target.value))}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded font-medium text-slate-800 cursor-pointer text-xs"
            >
              <option value={0}>0ms (Tức thì - Test nhanh)</option>
              <option value={300}>300ms (Mạng nhanh thực tế)</option>
              <option value={1000}>1.000ms (Test WebDriverWait)</option>
              <option value={2000}>2.000ms (Test Explicit Wait timeout)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Tiến độ test:</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              {passedCount} Passed
            </span>
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono font-bold">
              {failedCount} Failed
            </span>
            <button
              id="btn-sheet-reset-db"
              data-testid="btn-sheet-reset-db"
              onClick={resetDatabase}
              className="ml-2 px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-slate-300 hover:border-rose-300 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data ban đầu</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-200 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'scenarios'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Ma trận Test Cases chi tiết ({TEST_CASES.length} kịch bản)</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'python'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Mã mẫu Python Selenium (Ready-to-run)</span>
          </button>

          <button
            onClick={() => setActiveTab('locators')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'locators'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bảng danh sách Locators (ID & data-testid)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-4">
          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              {/* Filter by module */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  <span className="text-slate-500 font-medium">Lọc theo module:</span>
                  {['all', 'Xác thực', 'Đăng ký', 'Tìm kiếm', 'Bộ lọc', 'Sản phẩm', 'Giỏ hàng', 'Thanh toán', 'Đơn hàng'].map((mod) => (
                    <button
                      key={mod}
                      onClick={() => setSelectedModule(mod)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                        selectedModule === mod
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {mod === 'all' ? 'Tất cả' : mod}
                    </button>
                  ))}
                </div>

                <div className="text-slate-500 text-[11px]">
                  Bấm <strong className="text-emerald-600">✓ Pass</strong> hoặc <strong className="text-rose-600">✗ Fail</strong> để ghi nhận kết quả kiểm thử của bạn.
                </div>
              </div>

              {/* Test Cases Table / Cards */}
              <div className="space-y-3">
                {filteredTestCases.map((tc) => {
                  const status = testResults[tc.id] || 'pending';
                  return (
                    <div
                      key={tc.id}
                      className={`p-4 rounded-xl border transition-all ${
                        status === 'pass'
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : status === 'fail'
                          ? 'border-rose-300 bg-rose-50/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                            {tc.id}
                          </span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                            {tc.module}
                          </span>
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">
                            {tc.technique}
                          </span>
                        </div>

                        {/* Pass / Fail action buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleTestStatus(tc.id, 'pass')}
                            className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold text-xs cursor-pointer transition-colors ${
                              status === 'pass'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Passed</span>
                          </button>

                          <button
                            onClick={() => toggleTestStatus(tc.id, 'fail')}
                            className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold text-xs cursor-pointer transition-colors ${
                              status === 'fail'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Failed</span>
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-2">{tc.title}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="font-semibold text-slate-700 mb-1">Các bước kiểm thử (Steps):</div>
                          <ol className="list-decimal list-inside text-slate-600 space-y-0.5">
                            {tc.steps.map((step, idx) => (
                              <li key={idx} className="leading-relaxed">{step}</li>
                            ))}
                          </ol>

                          <div className="mt-2 text-slate-600">
                            <strong>Dữ liệu test (Test Data):</strong>{' '}
                            <code className="font-mono bg-slate-100 text-indigo-600 px-1 py-0.5 rounded text-[11px]">{tc.inputData}</code>
                          </div>
                        </div>

                        <div>
                          <div className="font-semibold text-slate-700 mb-1">Kết quả mong đợi (Expected Output):</div>
                          <p className="text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60 leading-relaxed font-medium">
                            {tc.expectedResult}
                          </p>

                          <div className="mt-2 text-slate-500 text-[11px]">
                            <strong>Locators tương ứng:</strong>{' '}
                            {tc.locators.map((loc, i) => (
                              <span key={i} className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded mr-1">
                                {loc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'python' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">
                  File test mẫu: <code className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">test_ecommerce_selenium.py</code>
                </span>
                <button
                  id="btn-copy-python-code"
                  data-testid="btn-copy-python-code"
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã sao chép!' : 'Sao chép toàn bộ code'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-[11px] leading-relaxed font-mono border border-slate-800 max-h-[460px]">
                {pythonScript}
              </pre>
            </div>
          )}

          {activeTab === 'locators' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Toàn bộ các phần tử giao diện được gắn thuộc tính <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600">id</code> và <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600">data-testid</code> cố định để tránh flaky tests:
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Chức năng</th>
                      <th className="p-2.5">Tên phần tử</th>
                      <th className="p-2.5">By.ID Locator</th>
                      <th className="p-2.5">By.CSS_SELECTOR Locator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Đăng nhập</td>
                      <td className="p-2.5 font-sans text-slate-600">Nút mở đăng nhập</td>
                      <td className="p-2.5 text-indigo-600 font-bold">btn-open-login</td>
                      <td className="p-2.5 text-slate-500">[data-testid="btn-open-login"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Đăng nhập</td>
                      <td className="p-2.5 font-sans text-slate-600">Ô nhập Email</td>
                      <td className="p-2.5 text-indigo-600 font-bold">login-email</td>
                      <td className="p-2.5 text-slate-500">[data-testid="login-email"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Đăng nhập</td>
                      <td className="p-2.5 font-sans text-slate-600">Ô nhập Password</td>
                      <td className="p-2.5 text-indigo-600 font-bold">login-password</td>
                      <td className="p-2.5 text-slate-500">[data-testid="login-password"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Đăng nhập</td>
                      <td className="p-2.5 font-sans text-slate-600">Nút Submit</td>
                      <td className="p-2.5 text-indigo-600 font-bold">btn-login-submit</td>
                      <td className="p-2.5 text-slate-500">[data-testid="btn-login-submit"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Đăng nhập</td>
                      <td className="p-2.5 font-sans text-slate-600">Thông báo lỗi</td>
                      <td className="p-2.5 text-rose-600 font-bold">login-error-alert</td>
                      <td className="p-2.5 text-slate-500">[data-testid="login-error-alert"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Tìm kiếm</td>
                      <td className="p-2.5 font-sans text-slate-600">Ô tìm kiếm</td>
                      <td className="p-2.5 text-indigo-600 font-bold">search-input</td>
                      <td className="p-2.5 text-slate-500">[data-testid="search-input"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Sản phẩm</td>
                      <td className="p-2.5 font-sans text-slate-600">Nút Thêm Giỏ</td>
                      <td className="p-2.5 text-indigo-600 font-bold">btn-add-cart-&#123;id&#125;</td>
                      <td className="p-2.5 text-slate-500">[data-testid="btn-add-cart-prod-1"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Giỏ hàng</td>
                      <td className="p-2.5 font-sans text-slate-600">Badge số lượng</td>
                      <td className="p-2.5 text-indigo-600 font-bold">cart-badge-count</td>
                      <td className="p-2.5 text-slate-500">[data-testid="cart-badge-count"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Giỏ hàng</td>
                      <td className="p-2.5 font-sans text-slate-600">Ô nhập voucher</td>
                      <td className="p-2.5 text-indigo-600 font-bold">input-coupon</td>
                      <td className="p-2.5 text-slate-500">[data-testid="input-coupon"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Giỏ hàng</td>
                      <td className="p-2.5 font-sans text-slate-600">Nút Áp dụng voucher</td>
                      <td className="p-2.5 text-indigo-600 font-bold">btn-apply-coupon</td>
                      <td className="p-2.5 text-slate-500">[data-testid="btn-apply-coupon"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Thanh toán</td>
                      <td className="p-2.5 font-sans text-slate-600">Nút Xác nhận Đặt hàng</td>
                      <td className="p-2.5 text-indigo-600 font-bold">btn-place-order</td>
                      <td className="p-2.5 text-slate-500">[data-testid="btn-place-order"]</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-slate-800">Thành công</td>
                      <td className="p-2.5 font-sans text-slate-600">Mã đơn hàng ORD-...</td>
                      <td className="p-2.5 text-indigo-600 font-bold">order-code-display</td>
                      <td className="p-2.5 text-slate-500">[data-testid="order-code-display"]</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
