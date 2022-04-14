export interface User {
  id: string;
  role: number;
  cardId: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  city: string;
  street: string;

  cart?: {
    status?: string;
    created?: string;
    items?: [
      {
        productId?: string;
        prod_name?: string;
        quantity?: number;
        prod_total?: number;
      }
    ];
  };
}
