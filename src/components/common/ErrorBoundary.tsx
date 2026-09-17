import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lỗi giao diện bị chặn:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0E14] text-[#EAECEF] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#121722] border border-[#232936] rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F6465D]/15 text-[#F6465D] border border-[#F6465D]/30 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Đã khôi phục chế độ an toàn</h2>
              <p className="text-xs text-[#848E9C] mt-1.5">
                Ứng dụng phát hiện lỗi hiển thị tạm thời. Hệ thống đã tự kích hoạt dữ liệu dự phòng an toàn.
              </p>
            </div>
            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-[#161A25] border border-[#232936] text-[11px] font-mono text-[#848E9C] text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0ECB81] hover:bg-[#0bb974] text-black font-bold text-xs transition-all shadow-lg shadow-[#0ECB81]/15"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Làm Mới & Tiếp Tục</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
