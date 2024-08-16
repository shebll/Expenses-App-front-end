import {
  ExpenseResponseType,
  TagResponseType,
  TotalExpenseType,
  UserResponseType,
} from "@/types/types";
import { queryOptions } from "@tanstack/react-query";

import axios from "axios";

export const api = axios.create({
  baseURL: "https://extracker.shebl.workers.dev/api/",
  // timeout: 1000,
  // headers: { "X-Custom-Header": "foobar" },
});

// user data queries
const getUserData = async (): Promise<UserResponseType> => {
  const res = await api.get<UserResponseType>("me");
  const data = res.data;
  return data;
};
export const userQueryOption = queryOptions({
  queryKey: ["get-user-data"],
  queryFn: getUserData,
  staleTime: Infinity,
});

// total expenses data queries
export const getTotalExpenses = async (): Promise<TotalExpenseType> => {
  const res = await api.get<TotalExpenseType>("expenses/total-expenses");
  const data = res.data;
  return data;
};
export const totalExpensesQueryOption = queryOptions({
  queryKey: ["total-expenses"],
  queryFn: getTotalExpenses,
});

// get expenses data queries
export const getExpenses = async (): Promise<ExpenseResponseType> => {
  const res = await api.get<ExpenseResponseType>("expenses");
  const data = res.data;
  return data;
};
export const expensesQueryOption = queryOptions({
  queryKey: ["expenses"],
  // enabled: false,
  queryFn: getExpenses,
});

// get Tags data queries
export const getTags = async (): Promise<TagResponseType> => {
  const res = await api.get<TagResponseType>("tags");
  const data = res.data;
  return data;
};
export const getTagsQueryOption = queryOptions({
  queryKey: ["tags"],
  queryFn: getTags,
});
