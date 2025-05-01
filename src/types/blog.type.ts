// định nghĩa một interface (giao diện)
// dùng mô tả một bài viết (blog)
export interface Post {
  title: string // tiêu đề bài viết
  description: string //mô tả ngắn gọn bài viết
  publishDate: string // ngày đăng bài
  id: string // mã định danh duy nhất
  featureImage: string // đường dẫn ảnh đại diện cho bài viết
  published: boolean // trạng thái bài viết true là xuất bản , false là bản nháp
}
