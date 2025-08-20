/**
 * Todo Entity
 * ドメイン層におけるTodoの中核的な型定義
 */

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

/**
 * Todo作成時のバリデーション
 */
export const validateCreateTodoInput = (input: CreateTodoInput): string[] => {
  const errors: string[] = [];
  
  if (!input.title || input.title.trim().length === 0) {
    errors.push('タイトルは必須です');
  }
  
  if (input.title && input.title.length > 200) {
    errors.push('タイトルは200文字以内で入力してください');
  }
  
  return errors;
};

/**
 * Todo更新時のバリデーション
 */
export const validateUpdateTodoInput = (input: UpdateTodoInput): string[] => {
  const errors: string[] = [];
  
  if (input.title !== undefined) {
    if (input.title.trim().length === 0) {
      errors.push('タイトルは必須です');
    }
    
    if (input.title.length > 200) {
      errors.push('タイトルは200文字以内で入力してください');
    }
  }
  
  return errors;
};