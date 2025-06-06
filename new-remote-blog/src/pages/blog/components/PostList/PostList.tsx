import { useDeletePostMutation, useGetPostsQuery } from 'pages/blog/blog.service'
import PostItem from '../PostItem'
import { Fragment, useDebugValue } from 'react'
import SkeletonPost from '../SkeletonPost'
import { useDispatch } from 'react-redux'
import { startEditPost } from 'pages/blog/blog.slice'

export default function PostList() {
  // isLoading chỉ dành cho lần fetch đầu tiên
  // isFetch là cho mỗi lần gọi API
  // nếu thành công thì nó sẽ là false còn nếu true là chưa thành công
  const [deletePost] = useDeletePostMutation()
  const { data, isLoading, isFetching } = useGetPostsQuery()
  // console.log(data, isLoading, isFetching)
  const dispatch = useDispatch()
  const startEdit = (id: string) => {
    dispatch(startEditPost(id))
  }

  const handleDeletePost = (id: string) => {
    deletePost(id)
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
          {isFetching && (
            <Fragment>
              <SkeletonPost />
              <SkeletonPost />
            </Fragment>
          )}
          {!isFetching &&
            data?.map((post) => (
              <PostItem key={post.id} post={post} startEdit={startEdit} handleDeletePost={handleDeletePost} />
            ))}
        </div>
      </div>
    </div>
  )
}
