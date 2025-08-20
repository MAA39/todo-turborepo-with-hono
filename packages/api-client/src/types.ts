// API Request/Response型の仕様
export interface TodoResponse {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

export interface TodoListResponse {
  todos: TodoResponse[];
  total: number;
  hasNext: boolean;
}

// エラーレスポンス型
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// API Result型
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse['error'];
}