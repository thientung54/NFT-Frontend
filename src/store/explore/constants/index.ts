export type Product = {
  id: string;
  title: string;
  description: string;
  upload_file: string;
  royalty_percent: number;
  unlock_once_purchased: boolean;
  instant_sale_price: number;
  categories: string[];
  properties: any;
  token: string;
  token_id: number;
  token_owner: string;
  quote_token: {
    name: string;
  };
};

export type Error = any;
export type GetProductListReq = {
  mode?: 'refresh';
  cursor?: string;
  limit?: number;
  filterAndSort?: string | null;
  category?: string | null;
};

export type GetProductListRes = {
  collectibles: Product[];
  prev_cursor: string;
  next_cursor: string;
};

export const LIMIT_PER_PAGE = 16;
