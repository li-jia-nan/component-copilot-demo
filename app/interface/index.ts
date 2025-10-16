export declare namespace API {
  /**
   * 通用的接口响应结构
   */
  export interface LLM_Response {
    success: boolean;
    data: any | null;
    error: string | null;
  }
}
