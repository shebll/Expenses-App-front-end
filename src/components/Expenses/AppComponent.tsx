import { useCreateExpense } from "@/hooks/CreateExpense";

import Expenses from "./components/Expenses";
import TotalExpenses from "./components/TotalExpenses";

const Home = () => {
  const { setExpense } = useCreateExpense((state) => state);

  return (
    <section className="container p-4 mx-auto">
      <TotalExpenses />
      <Expenses onEditExpense={setExpense} />
    </section>
  );
};

export default Home;
