import { createSlice } from '@reduxjs/toolkit';

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    disabledProducts:[], // Initialize items as an empty array
  },
  reducers: {
    addItem: (state, action) => {

      const {name,image,cost} = action.payload;

      const existingItem = state.items.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity +=1;
      }else {
        state.items.push({ name,image,cost,quantity:1});
      }
      // Disable the added product (add to disabled list)
      if (!state.disabledProducts.includes(action.payload.name)) {
        state.disabledProducts.push(action.payload.name);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.name !== action.payload);

      // Corrected: Remove the item from disabledProducts properly
      state.disabledProducts = state.disabledProducts.filter(item => item !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { name, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.name === name);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = CartSlice.actions;

export default CartSlice.reducer;
