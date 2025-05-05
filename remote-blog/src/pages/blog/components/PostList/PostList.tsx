import { useDispatch, useSelector } from 'react-redux'
import PostItem from '../PostItem'
import { RootState, useAppDispatch } from 'store'
import { detelePost, getPostList, startEditingPost } from 'pages/blog/blog.slice'
import { useEffect } from 'react'
import http from 'utils/http'
import { error } from 'console'

// gọi API trong useEffect()
// Nếu gọi thành công thì dispactch cái action type: "blog/getPostListSuccess"
// nếu gọi thất bại dispatch 1 action type: "blog/getPostListFailed"
// không được xử lí bất đồng bộ trong thằng reducers
// nên chúng ta mới xử lý bất đồng bộ trong cái component của chúng ta
// để không muốn gọi lại 2 lần của chế đô useStrict mode ta 1 dùng 1 loại đó là abort controller thư viện của axios
export default function PostList() {
  // làm cách nào lấy 1 cái state trong redux ta sử dụng 1 hook useSelector
  const postList = useSelector((state: RootState) => state.blog.postList)
  const dispatch = useAppDispatch()
  // get api
  useEffect(() => {
    const promise = dispatch(getPostList())
    return () => {
      promise.abort()
    }
  }, [dispatch])

  const handleDelete = (postId: string) => {
    dispatch(detelePost(postId))
  }
  const handleStartEditing = (postId: string) => {
    dispatch(startEditingPost(postId))
  }
  return (
    <div className='bg-white py-6 sm:py-8 lg:py-12'>
      <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
        <div className='mb-10 md:mb-16'>
          <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Được Dev Blog</h2>
          <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
            Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
          {postList.map((post) => (
            <PostItem post={post} key={post.id} handleDelete={handleDelete} handleStartEditing={handleStartEditing} />
          ))}
        </div>
      </div>
    </div>
  )
}
