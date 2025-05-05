import { configureStore } from '@reduxjs/toolkit'
import blogReducer from 'pages/blog/blog.slice'
import { useDispatch } from 'react-redux'
// store là một object chứa state tree . Chỉ nên có duy nhất 1 store trong app
// store sẽ chạy rootReducer bất cứ khi nào một action được dispatch
// dispatch : là một function dùng để gửi một action đi đến store (hay còn gọi là reducer cũng được)
// reducer : là một function  để tính toán state mới dựa vào previous state + action
// action : là một plain object (object đơn giản tạo bằng {} hoặc newObject ) chứa field là type mô tả
// chuyện gì vừa xảy ra , action là một object nhưng chúng ta thường khai báo một function return về
// object để có thể dễ dàng gửi data vào action , chúng ta thường gọi là payload

// function configureStore nó sẽ generate cho chúng ta cái store
// nhận 1 object
export const store = configureStore({
  reducer: { blog: blogReducer }
})

// lấy RootState và App Dispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
// thằng useAppDispacth để dispactch 1 asyncThunk
export const useAppDispatch = () => useDispatch<AppDispatch>()
// 2 thằng trên phục vụ cho vấn đề typescript
// những cái state nào các bạn nhiều component khác nhau thì đặt ở redux
// hay gọi là reducer của thằng redux
// còn state nào chỉ dùng cho component của bạn thôi cứ dùng cái state react bình thường
// không cần dùng redux làm gì cả (nhớ nha)
