import { createAction, createReducer, current } from '@reduxjs/toolkit'
import { initialPostList } from 'constants/blog'
import { Post } from 'types/blog.type'
// createReducer : nó nhận tham số đầu tiên là initial State
// cái thứ 2 là 1 cái builder callback

interface BlogSate {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogSate = {
  postList: initialPostList,
  editingPost: null
}

// createAction là một helper function dùng để tạo một Redux Action
// function createAction (type , prepareAction?)
// mỗi cái action đều phải có 1 cái type
export const addPost = createAction<Post>('blog/addPost')

// chức năng xóa tìm ra index và dùng splice để xóa
export const detelePost = createAction<String>('blog/detelePost')
// chức năng update
export const startEditingPost = createAction<string>('blog/startEditingPost')
export const finishEditingPost = createAction<Post>('blog/finishEditingPost')
// xử lí button cancel
export const cancelEditingPost = createAction('blog/ cancelEditingPost')
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
    .addCase(startEditingPost, (state, action) => {
      const postId = action.payload
      // nếu tìm không thấy sẽ là null
      const foundPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = foundPost
    })
    .addCase(cancelEditingPost, (state) => {
      state.editingPost = null
    })
    .addCase(finishEditingPost, (state, action) => {
      const postId = action.payload.id
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
      state.editingPost = null
    })
    .addMatcher(
      (action) => action.type.includes('cancel'),
      (state, action) => {
        console.log(current(state))
      }
    )
})

export default blogReducer

// ngoài những addCase ra còn cách dùng như
// addMatcher cho phép chúng ta truyền vào addMatcher function
// khi mà addMatcher return true thì chạy cái callback
// chuyên xử lí những cái state động
// ngoài ra còn có addDefaultCase khi không nhảy case thì nó nhảy vào defaultCase
