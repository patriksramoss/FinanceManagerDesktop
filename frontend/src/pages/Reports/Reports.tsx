import { useMemo } from "react";
import Loader from "src/components/Loader/Loader";
import usePlaidStore from "src/stores/Plaid";
import dayjs from "dayjs";
import { getFilteredEssentialData } from "src/utils/filterEssentialData";

const Reports: React.FC = () => {
  const cache = usePlaidStore((s) => s.cache);
  const selectedMonth = usePlaidStore(
    (s) => s.selectedMonthDashboard ?? dayjs().format("YYYY-MM"),
  );
  const selectedAccount = usePlaidStore((s) => s.selectedAccountDashboard);
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

  return (
    <div className="flex flex-col items-center justify-start p-5 m-4 relative rounded-lg top-12">
      {!essentialData ? (
        <div className="flex justify-between w-4/5">
          <div className="p-5 m-4 w-full relative bg-gray-100 rounded-lg shadow-md">
            <Loader loading={true} />
          </div>
        </div>
      ) : (
        <div className="flex justify-between w-4/5">
          <div className="p-5 m-4 w-full relative bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-lg mt-5 text-gray-800">Accounts</h3>
            <div className="flex flex-col gap-2 mt-3">
              {accounts.map((account: any) => (
                <div
                  key={account.account_id}
                  className="border border-gray-300 bg-white p-4 rounded-md mb-4"
                >
                  <p>
                    <strong>{account.name}</strong> ({account.subtype})
                  </p>
                  <p>
                    Balance: {account.balances.current}{" "}
                    {account.balances.iso_currency_code}
                  </p>
                  <p>Account Number: ****{account.mask}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
