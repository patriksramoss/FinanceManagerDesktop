import { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import useAuthStore from "src/stores/Auth";
import dayjs from "dayjs";
import Loader from "src/components/Loader/Loader";
//apis
import { getEssentialData } from "src/api/plaid";
//icons
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
//stores
import usePlaidStore from "src/stores/Plaid";

const Header = () => {
  const [essentialData, setEssentialData] = useState<any>(null);
  const [loadingChartData, setLoadingChartData] = useState<boolean>(false);
  const loadAccessToken = useAuthStore((state) => state.loadAccessToken);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    dayjs().format("YYYY-MM")
  );

  const fetchTokenAndData = async () => {
    const token = await loadAccessToken();
    if (!token) {
      console.warn("No cached access token found.");
      return;
    }
    try {
      setLoadingChartData(true);
      const data = await getEssentialData(selectedMonth);
      if (!data) {
        setLoadingChartData(false);
        return;
      }
      setLoadingChartData(false);
      setEssentialData(data);
      usePlaidStore.getState().setEssentialData(selectedMonth, data);
      // processCategoryData(data.transactions, selectedMonth);
    } catch (error) {
      console.error("Error fetching essential data:", error);
    }
  };

  useEffect(() => {
    fetchTokenAndData();
  }, [selectedMonth]);

  const changeMonth = (direction: "prev" | "next") => {
    const current = dayjs(selectedMonth + "-01");
    const newDate =
      direction === "prev"
        ? current.subtract(1, "month")
        : current.add(1, "month");
    setSelectedMonth(newDate.format("YYYY-MM"));
    usePlaidStore
      .getState()
      .setSelectedMonthDashboard(newDate.format("YYYY-MM"));
  };

  console.log("essential data", essentialData);

  if (!essentialData)
    return (
      <div className={styles.header}>
        <Loader loading={true} />
      </div>
    );

  return (
    <div className={styles.header}>
      <h2>Dashboard</h2>
      <div
        className={`${styles.monthSwitcher} ${
          loadingChartData ? styles.loading : ""
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
  );
};

export default Header;
