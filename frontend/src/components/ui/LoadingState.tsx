export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4" />
        <p className="text-lg text-gray-600">Đang tải thông tin phòng...</p>
      </div>
    </div>
  )
}


