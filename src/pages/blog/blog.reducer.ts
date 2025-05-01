import { createReducer } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'
// createReducer : nó nhận tham số đầu tiên là initial State
// cái thứ 2 là 1 cái builder callback

interface BlogSate {
  postList: Post[]
}

const initialState = {
  postList: []
}

// cái builder callBack là nơi mà chúng ta  sẽ xử lí những cái action
// và cập nhập state trong này
const blogReducer = createReducer(initialState, (builder) => {})

export default blogReducer
