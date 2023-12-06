import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  price: number;
  image?: string;
  completedAt?: string;
  rider?: string;
}

interface InitialState {
  orders: Order[]; // 서버에서 실시간으로 받는 전체 주문 목록
  deliveries: Order[]; // 실제로 수락한 주문 목록
  completes: Order[]; // 배달 완료 목록
}

const initialState: InitialState = {
  orders: [],
  deliveries: [],
  completes: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceptOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex(v => v.orderId === action.payload);
      if (index > -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },
    rejectOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex(v => v.orderId === action.payload);
      if (index > -1) {
        state.orders.splice(index, 1);
      }

      const delivery = state.deliveries.findIndex(
        v => v.orderId === action.payload,
      );
      if (delivery > -1) {
        state.deliveries.splice(delivery, 1);
      }
    },
    setCompletes(state, action) {
      state.completes = action.payload;
    },
  },
  extraReducers: builder => {},
});

export default orderSlice;
