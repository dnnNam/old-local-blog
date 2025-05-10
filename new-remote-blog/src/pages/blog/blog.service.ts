import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'

export const blogApi = createApi({
  reducerPath: 'blogApi', //tên filed trong redux state
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (build) => ({
    // Generic type theo thứ tự kiểu response trả về argument
    getPosts: build.query<Post[], void>({
      query: () => 'posts' // khi dùng getPost với url cộng với posts
      // method không có argument
    }),
    // chúng ta dùng mutation đối với các trường hợp POST , PUT , DELETE
    // post là responses trả về và Omit<Post , 'id'> là body gửi lên
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query: (body) => {
        return {
          url: 'posts',
          method: 'POST',
          body
        }
      }
    })
  })
})

export const { useGetPostsQuery, useAddPostMutation } = blogApi
