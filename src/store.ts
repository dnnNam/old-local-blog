import { configureStore } from '@reduxjs/toolkit'
import blogReducer from 'pages/blog/blog.reducer'

// function configureStore nó sẽ generate cho chúng ta cái store
// nhận 1 object
export const store = configureStore({
  reducer: { blog: blogReducer }
})

// lấy RootState và App Dispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
// 2 thằng trên phục vụ cho vấn đề typescript
// những cái state nào các bạn nhiều component khác nhau thì đặt ở redux
// hay gọi là reducer của thằng redux
// còn state nào chỉ dùng cho component của bạn thôi cứ dùng cái state react bình thường
// không cần dùng redux làm gì cả (nhớ nha)
