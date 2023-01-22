import React from "react";

interface ShowEntriesProps {
  setSize: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ShowEntries({ setSize, setPage }: ShowEntriesProps) {
  const onLimitChange = (currentLimit: number) => {
    setSize(currentLimit);
    setPage(1);
  };

  return (
    <div className="flex h-[38px]">
      <div className="grid place-items-center px-1 2xl:px-2 text-sm text-gray-500 bg-white rounded-l-lg border border-gray-300">
        Show :
      </div>
      <select
        className="border-gray-300 text-sm rounded-r-md bg-[#F9FAFB] px-3 focus:outline-none "
        onChange={(e) => onLimitChange(Number(e.target.value))}
        defaultValue="10"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
}
