import { useMemo } from "react";
import dayjs from "dayjs";
//icons
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { SelectField } from "src/components/Select/SelectField";
//stores
import usePlaidStore from "src/stores/Plaid";
import { getFilteredEssentialData } from "src/utils/filterEssentialData";

const Header = () => {
  const cache = usePlaidStore((s) => s.cache);
  const selectedMonth = usePlaidStore(
    (s) => s.selectedMonthDashboard ?? dayjs().format("YYYY-MM"),
  );
  const selectedAccount = usePlaidStore((s) => s.selectedAccountDashboard);
  const setSelectedAccount = usePlaidStore(
    (s) => s.setSelectedAccountDashboard,
  );
  const selectedCategory = usePlaidStore((s) => s.selectedCategoryDashboard);

  const essentialData = useMemo(() => {
    const month = selectedMonth ?? dayjs().format("YYYY-MM");
    return getFilteredEssentialData(
      cache[month],
      selectedAccount,
      selectedCategory,
    );
  }, [cache, selectedMonth, selectedAccount, selectedCategory]);

  const accounts = cache[selectedMonth]?.accounts ?? [];

  const changeMonth = (direction: "prev" | "next") => {
    const current = dayjs(selectedMonth + "-01");
    const newDate =
      direction === "prev"
        ? current.subtract(1, "month")
        : current.add(1, "month");
    usePlaidStore
      .getState()
      .setSelectedMonthDashboard(newDate.format("YYYY-MM"));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-3 p-4 sm:p-6 rounded-xl text-textWhite">
      <div className="flex flex-row items-center justify-center sm:justify-start pr-0 sm:pr-8 rounded-xl text-text">
        <div
          className={`flex items-center bg-white/10 rounded-[30px] px-2 py-1  select-none ${
            !essentialData
              ? "opacity-60 pointer-events-none filter brightness-[0.9] saturate-[0.8] transition-opacity"
              : ""
          }`}
        >
          <button
            onClick={() => changeMonth("prev")}
            className="bg-transparent border-none text-text text-xl w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-white/20 hover:text-accentSolid focus:outline-2 focus:outline-offset-2 focus:outline-blue-300"
          >
            <FaArrowAltCircleLeft />
          </button>

          <span className="mx-4 font-semibold text-base text-center min-w-[140px]">
            {dayjs(selectedMonth + "-01").format("MMMM YYYY")}
          </span>

          <button
            onClick={() => changeMonth("next")}
            className="bg-transparent border-none text-text text-xl w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-white/20 hover:text-accentSolid focus:outline-2 focus:outline-offset-2 focus:outline-blue-300"
          >
            <FaArrowAltCircleRight />
          </button>
        </div>
      </div>

      <div className="flex flex-row h-8 gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <SelectField
          label="Account"
          value={selectedAccount ?? "all"}
          onChange={setSelectedAccount}
          options={[
            { value: "all", label: "All" },
            ...accounts.map((a) => ({
              value: a.account_id,
              label: `${a.name} (${a.subtype}) •••• ${a.mask}`,
            })),
          ]}
        />
      </div>
    </div>
  );
};

export default Header;
