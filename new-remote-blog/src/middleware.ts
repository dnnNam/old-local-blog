import { isRejectedWithValue, Middleware, MiddlewareAPI, isRejected } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { isEntityError } from 'utils/helper'
function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' && payload !== null && 'data' in payload && (payload as any).data?.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  /**
   * `isRejectedWithValue` là một function giúp chúng ta kiểm tra những action có rejectedWithValue = true từ createAsyncThunk
   * RTK Query sử dụng `createAsyncThunk` bên trong nên chúng ta có thể dùng `isRejectedWithValue` để kiểm tra lỗi 🎉
   */
  // Option: chứ trong thực tế thì không cần bắt buộc
  // lỗi từ server trả về rejected with value bằng true
  if (isRejected(action)) {
    if (action.error.name === 'CustomError') {
      // Những lỗi liên quan đến quá trình thực thi
      toast.warn(action.error.message)
    }
  }
  if (isRejectedWithValue(action)) {
    // Mỗi khi thực hiện query hoặc mutation mà bị lỗi thì nó sẽ chạy vào đây
    // Những lỗi từ server thì action nó mới có rejectedWithValue = true
    // Còn những action liên quan đến việc caching mà bị rejected thì rejectedWithValue = false,
    // nên đừng lo lắng, nó không lọt vào đây được
    if (isPayloadErrorMessage(action.payload)) {
      // lỗi reject từ server chỉ có message thôi
      toast.warn(action.payload.data.error)
    }
  }
  return next(action)
}
