import axios, { AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:4000/', //đường dẫn mặc định cho tất cả request (ở đây là localhost:4000).
      timeout: 10000 // giới hạn thời gian request là 10 giây (10000ms).
    })
  }
}

const http = new Http().instance

export default http
