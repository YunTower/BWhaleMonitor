interface SocketOptions {
  maxReconnectTimes?: number // 最大重连次数
  reconnectInterval?: number // 重连间隔时间（毫秒）
  heartbeatInterval?: number // 心跳间隔时间（毫秒）
  heartbeatData?: string // 心跳数据
}

class webSocket {
  private readonly url: string
  private socket: WebSocket | null = null
  private readonly maxReconnectTimes: number
  private reconnectTimes: number = 0
  private readonly reconnectInterval: number
  private isClosed: boolean = false
  private isOpen: boolean = false
  private isConnect: boolean = false
  private isReconnecting: boolean = false
  private isDestroyed: boolean = false
  private reconnectTimer: number | null = null
  private heartbeatTimer: number | null = null
  private readonly heartbeatInterval: number
  readonly heartbeatData: any
  private onMessageCallback: ((message: string) => void) | null = null
  private onOpenCallback: (() => void) | null = null
  private onCloseCallback: (() => void) | null = null

  constructor(url: string, options: SocketOptions = {}) {
    this.url = url
    this.maxReconnectTimes = options.maxReconnectTimes || 3
    this.reconnectInterval = options.reconnectInterval || 30000
    this.heartbeatInterval = options.heartbeatInterval || 20000
    this.heartbeatData = options.heartbeatData || { "type": "hello" }
  }

  /**
   * 创建连接
   * @private
   */
  private createSocket(): void {
    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      this.isOpen = true
      this.isConnect = true
      this.reconnectTimes = 0
      this.startHeartbeat()
      if (this.onOpenCallback) this.onOpenCallback()
    }

    this.socket.onmessage = (event: MessageEvent) => {
      if (this.onMessageCallback) this.onMessageCallback(event.data)
    }

    this.socket.onclose = () => {
      this.isOpen = false
      this.isConnect = false
      this.stopHeartbeat()
      if (this.onCloseCallback) this.onCloseCallback()
      if (!this.isClosed && this.reconnectTimes < this.maxReconnectTimes) {
        this.reconnect()
      }
    }

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket错误: ', error)
    }
  }

  /**
   * 连接
   */
  public connect(): void {
    if (this.isDestroyed) return
    this.createSocket()
  }

  /**
   * 重连
   * @private
   */
  private reconnect(): void {
    if (this.isReconnecting || this.reconnectTimes >= this.maxReconnectTimes) return

    this.isReconnecting = true
    this.reconnectTimes++

    this.reconnectTimer = setTimeout(() => {
      console.log(`正在重连... (${this.reconnectTimes})`)
      this.createSocket()
      this.isReconnecting = false
    }, this.reconnectInterval)
  }

  /**
   * 发送消息
   * @param data
   */
  public send(data: any): void {
    if (this.isOpen && this.socket) {
      this.socket.send(JSON.stringify(data))
    } else {
      console.error('WebSocket 未打开，无法发送消息。')
    }
  }

  /**
   * 消息接收事件
   * @param callback
   */
  public onMessage(callback: (message: string) => void): void {
    this.onMessageCallback = callback
  }

  /**
   * 连接打开事件
   * @param callback
   */
  public onOpen(callback: () => void): void {
    this.onOpenCallback = callback
  }

  /**
   * 连接关闭事件
   * @param callback
   */
  public onClose(callback: () => void): void {
    this.onCloseCallback = callback
  }

  /**
   * 开始心跳
   * @private
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isOpen && this.socket) {
        this.send(this.heartbeatData)
      }
    }, this.heartbeatInterval)
  }

  /**
   * 停止心跳
   * @private
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 关闭连接
   */
  public close(): void {
    this.isClosed = true
    this.isOpen = false
    if (this.socket) {
      this.socket.close()
    }
    this.stopHeartbeat()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
  }

  /**
   * 销毁连接
   */
  public destroy(): void {
    this.isDestroyed = true
    this.close()
  }

  /**
   * 判断是否有未销毁的连接
   */
  public hasUnclosedConnection(): boolean {
    return this.isConnect
  }
}

export default webSocket
