import React, { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Vui lòng nhập đầy đủ địa chỉ email và mật khẩu');
      return;
    }

    setIsLoggingIn(true);
    const res = await login(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (res.success) {
      onClose();
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Mật khẩu bảo mật phải có ít nhất 6 ký tự');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Mật khẩu xác nhận không khớp với mật khẩu đã nhập');
      return;
    }

    if (!agreeTerms) {
      setRegError('Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật');
      return;
    }

    setIsRegistering(true);
    const res = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });
    setIsRegistering(false);

    if (res.success) {
      onClose();
    } else {
      setRegError(res.message);
    }
  };

  const handleAutoFillCustomer = () => {
    setLoginEmail('khachhang@techstore.vn');
    setLoginPassword('Password123!');
    setLoginError('');
  };

  const handleAutoFillAdmin = () => {
    setLoginEmail('admin@techstore.vn');
    setLoginPassword('AdminPass123!');
    setLoginError('');
  };

  return (
    <div
      id="modal-auth-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="modal-auth"
        data-testid="modal-auth"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Header with Close */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              id="tab-login"
              data-testid="tab-login"
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
              }}
              className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Đăng nhập
            </button>
            <button
              id="tab-register"
              data-testid="tab-register"
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegError('');
              }}
              className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Đăng ký mới
            </button>
          </div>

          <button
            id="btn-close-auth"
            data-testid="btn-close-auth"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Quick Fill Box for Selenium Testers */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                <div className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                  <span>⚡ Hỗ trợ Test Selenium (Click để tự động điền form):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    id="btn-autofill-customer"
                    data-testid="btn-autofill-customer"
                    type="button"
                    onClick={handleAutoFillCustomer}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[11px] font-medium text-amber-900 transition-colors cursor-pointer"
                  >
                    Tài khoản Khách hàng
                  </button>
                  <button
                    id="btn-autofill-admin"
                    data-testid="btn-autofill-admin"
                    type="button"
                    onClick={handleAutoFillAdmin}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[11px] font-medium text-amber-900 transition-colors cursor-pointer"
                  >
                    Tài khoản Admin
                  </button>
                </div>
              </div>

              {loginError && (
                <div
                  id="login-error-alert"
                  data-testid="login-error-alert"
                  className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2 font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Email:
                </label>
                <input
                  id="login-email"
                  name="email"
                  data-testid="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu:
                </label>
                <input
                  id="login-password"
                  name="password"
                  data-testid="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Submit Button */}
              <button
                id="btn-login-submit"
                data-testid="btn-login-submit"
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}</span>
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div
                  id="register-error-alert"
                  data-testid="register-error-alert"
                  className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2 font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="register-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>:
                </label>
                <input
                  id="register-name"
                  name="fullName"
                  data-testid="register-name"
                  type="text"
                  placeholder="Nguyễn Văn An"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="register-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Email <span className="text-rose-500">*</span>:
                </label>
                <input
                  id="register-email"
                  name="email"
                  data-testid="register-email"
                  type="email"
                  placeholder="an.nguyen@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="register-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại:
                </label>
                <input
                  id="register-phone"
                  name="phone"
                  data-testid="register-phone"
                  type="tel"
                  placeholder="0901234567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="register-password" className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    id="register-password"
                    name="password"
                    data-testid="register-password"
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-slate-700 mb-1">
                    Xác nhận lại <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    data-testid="register-confirm-password"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-2 pt-1 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  id="register-terms"
                  name="agreeTerms"
                  data-testid="register-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                />
                <span>Tôi đồng ý với các điều khoản dịch vụ và chính sách kiểm thử hệ thống.</span>
              </label>

              {/* Register Button */}
              <button
                id="btn-register-submit"
                data-testid="btn-register-submit"
                type="submit"
                disabled={isRegistering}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isRegistering ? 'Đang tạo tài khoản...' : 'Tạo tài khoản ngay'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
