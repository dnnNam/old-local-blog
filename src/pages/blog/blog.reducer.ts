import { createAction, createReducer } from '@reduxjs/toolkit'
import { initialPostList } from 'constants/blog'
import { Post } from 'types/blog.type'
// createReducer : nó nhận tham số đầu tiên là initial State
// cái thứ 2 là 1 cái builder callback

interface BlogSate {
  postList: Post[]
}

const initialState: BlogSate = {
  postList: initialPostList
}

// createAction là một helper function dùng để tạo một Redux Action
// function createAction (type , prepareAction?)
// mỗi cái action đều phải có 1 cái type
export const addPost = createAction<Post>('blog/addPost')

// chức năng xóa tìm ra index và dùng splice để xóa
export const detelePost = createAction<String>('blog/detelePost')
// cái builder callBack là nơi mà chúng ta  sẽ xử lí những cái action
// và cập nhập state trong này
const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      // immmerjs
      // immerjs giúp chúng ta mutate một state an toàn
      const post = action.payload
      state.postList.push(post)
    })
    .addCase(detelePost, (state, action) => {
      const postId = action.payload
      const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
      if (foundPostIndex !== -1) {
        state.postList.splice(foundPostIndex, 1)
      }
    })
})

export default blogReducer
