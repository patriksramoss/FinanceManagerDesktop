import styles from "./Header.module.scss";
import dayjs from "dayjs";
import { useEffect } from "react";
//icons
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { SelectField } from "src/components/Select/SelectField";
//stores
import usePlaidStore from "src/stores/Plaid";

const Header = () => {
  const selectedMonth = usePlaidStore(
    (state) => state.selectedMonthDashboard || dayjs().format("YYYY-MM"),
  );
  const essentialData = usePlaidStore((state) =>
    selectedMonth ? state.cache[selectedMonth] : undefined,
  );

  useEffect(() => {
    console.log("selectedMonth", selectedMonth);
  }, [selectedMonth]);

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
    <>
      <div className={styles.header}>
        <div className={styles.monthSwitcherBox}>
          <div
            className={`${styles.monthSwitcher} ${
              !essentialData ? styles.loading : ""
            }`}
          >
            <button onClick={() => changeMonth("prev")}>
              <FaArrowAltCircleLeft />
            </button>
            <span>{dayjs(selectedMonth + "-01").format("MMMM YYYY")}</span>
            <button onClick={() => changeMonth("next")}>
              <FaArrowAltCircleRight />
            </button>
          </div>
        </div>
      </div>
      <div className={`flex flex-row h-[2rem] gap-2`}>
        <SelectField label="Account">
          <option value="all">All Accounts</option>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit">Credit</option>
          <option value="loan">Loan</option>
        </SelectField>
        <SelectField label="Category">
          <option value="personal">Personal</option>
          <option value="business">Business</option>
          <option value="combined">Combined</option>
        </SelectField>
      </div>
    </>
  );
};

export default Header;
