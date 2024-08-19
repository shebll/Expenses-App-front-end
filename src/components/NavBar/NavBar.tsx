import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useCreateExpense } from "@/hooks/CreateExpense";

const NavBar = () => {
  const setExpense = useCreateExpense((state) => state.setExpense);
  return (
    <>
      <div className="flex items-center justify-around gap-6 p-2">
        <Link
          to="/"
          className="[&.active]:font-bold [&.active]:opacity-100 opacity-50 text-xl"
        >
          Expenses
        </Link>
        {/* <Link
          to="/logs"
          className="[&.active]:font-bold [&.active]:opacity-100 opacity-50 text-xl"
        >
          logs
        </Link> */}
        <Button
          onClick={() => setExpense(null)}
          variant={"default"}
          className="w-16 h-16 rounded-full "
        >
          <PlusCircle size={40} />
        </Button>

        <Link
          to="/analytics"
          className="[&.active]:font-bold [&.active]:opacity-100 opacity-50 text-xl"
        >
          analytics
        </Link>
      </div>
    </>
  );
};

export default NavBar;
