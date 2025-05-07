import { AsyncThunk, createAsyncThunk, createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'
import http from 'utils/http'
// createReducer : nó nhận tham số đầu tiên là initial State
// cái thứ 2 là 1 cái builder callback

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>
interface BlogSate {
  postList: Post[]
  editingPost: Post | null
  loading: boolean
  currentRequestId: undefined | string
}

const initialState: BlogSate = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined
}

// khi dùng createAsyncThunk nên dùng ở extraReducer

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
  const response = await http.get<Post[]>('posts', {
    signal: thunkAPI.signal // abort cái request
  })
  return response.data
})

export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkAPI) => {
  const response = await http.post<Post>('posts', body, {
    signal: thunkAPI.signal // abort cái request
  })
  return response.data
})

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    try {
      const response = await http.put<Post>(`posts/${postId}`, body, {
        signal: thunkAPI.signal // abort cái request
      })
      return response.data
    } catch (error: any) {
      if (error.name === 'AxiosError' && error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)

export const deletePost = createAsyncThunk('blog/deletePost', async (postId: string, thunkAPI) => {
  const response = await http.delete<Post>(`posts/${postId}`, {
    signal: thunkAPI.signal // abort cái request
  })
  return response.data
})

const blogSlice = createSlice({
  name: 'blog',
  initialState: initialState,
  reducers: {
    startEditingPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      // nếu tìm không thấy sẽ là null
      const foundPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = foundPost
    },
    cancelEditingPost: (state) => {
      state.editingPost = null
    }
  },

  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.find((post, index) => {
          if (post.id === action.payload.id) {
            state.postList[index] = action.payload
            return true
          }
          return false
        })
        state.editingPost = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.meta.arg // chính là cái truyền vào dispactch.action
        const deletePostIndex = state.postList.findIndex((post) => post.id === postId)
        if (deletePostIndex !== -1) state.postList.splice(deletePostIndex, 1)
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true
          state.currentRequestId = action.meta.requestId
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false
            state.currentRequestId = undefined
          }
        }
      )
      // Khi bạn dùng createAsyncThunk, Redux Toolkit sẽ tự động gắn thêm một requestId cho mỗi lần gọi async
      // Khi bạn chỉ dùng state.loading = true ở /pending và state.loading = false ở /fulfilled hoặc /rejected mà không kiểm tra requestId, thì xảy ra tình huống như sau:

      // Người dùng bấm 2 lần liên tục
      // Request 1 (id = abc123) gọi loading = true.

      // Request 2 (id = xyz456) cũng gọi loading = true.

      // Nhưng request 1 trả về trước → loading = false (vì không kiểm tra gì cả).

      // Mặc dù request 2 vẫn đang chạy → loading bị tắt sớm.

      // Kết quả:

      // Skeleton vừa set true thì lại bị set false ngay sau đó.

      // UI không kịp hiển thị skeleton → giống như không loading.

      .addDefaultCase((state, action) => {
        // console.log(`action type: ${action.type}`, current(state))
      })
  }
})

export const { cancelEditingPost, startEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
