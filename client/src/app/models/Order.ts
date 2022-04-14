export interface Order {
  id: string;
  products: [object];
  user: {
    city: string;
    street: string;
    credit: string;
    order: string;
    ship: string;
    userId: string;
  };
  total: number;
}
