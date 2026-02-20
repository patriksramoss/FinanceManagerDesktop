import { useMemo } from "react";
import styles from "./Header.module.scss";
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
      <div className="flex flex-row h-[2rem] gap-2">
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
    </>
  );
};

export default Header;
