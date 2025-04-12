// redux/shippingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ShippingInfo {
    name: string;
    email: string;
    address: string;
    phone: string;
    shippingMethod: string;
    paymentMethod: string;
}

const initialState: ShippingInfo = {
    name: '',
    email: '',
    address: '',
    phone: '',
    shippingMethod: 'Giao hàng Nhanh - 15.000đ',
    paymentMethod: 'Thẻ VISA/MASTERCARD',
};

const shippingSlice = createSlice({
    name: 'shipping',
    initialState,
    reducers: {
        setShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            return { ...state, ...action.payload };
        },
        clearShippingInfo: () => initialState,
    },
});

export const { setShippingInfo, clearShippingInfo } = shippingSlice.actions;
export default shippingSlice.reducer;