import { useCreateExpense } from "@/hooks/CreateExpense";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

import Header from "@/components/Header/Header";
import NavBar from "@/components/NavBar/NavBar";
import CreateExpense from "@/components/CreateExpenseModel/CreateExpense";

interface MyRouterContext {
  queryClient: QueryClient;
}
const App = () => {
  const { openModel, expense, setExpense } = useCreateExpense((state) => state);

  const handleCloseCreateModal = () => {
    setExpense(null);
  };

  return (
    <>
      <Header />
      <Outlet />
      <NavBar />
      <CreateExpense
        expense={expense}
        openModel={openModel}
        onClose={handleCloseCreateModal}
      />
    </>
  );
};
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: App,
});
