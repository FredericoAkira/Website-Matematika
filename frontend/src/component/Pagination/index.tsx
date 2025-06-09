import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Pagination } from "react-headless-pagination";
import { cn } from "../utils";

interface IPagination {
    data: {
        pageIndex: number
        totalPages: number
    }
    setPageIndex: (index: number) => void;
}
export const Paginations: React.FC<IPagination> = ({
    data,
    setPageIndex
}) => {
    const buttonClassNames = cn(
        "flex items-center gap-2 py-2 px-3 bg-white text-[#344054] text-xs border border-[#00639D] cursor-pointer rounded-lg shadow-xs disabled:bg-neutral-bg disabled:opacity-50",
    );
  return (
    <Pagination
      className="flex items-center justify-between gap-4 p-4 -mt-4 mb-4"
      currentPage={data.pageIndex}
      edgePageCount={1}
      middlePagesSiblingCount={1}
      setCurrentPage={setPageIndex}
      totalPages={data.totalPages}
      truncableText="..."
      truncableClassName={buttonClassNames}
    >
      <Pagination.PrevButton
        className={buttonClassNames}
        disabled={data.pageIndex === 0}
        onClick={() => setPageIndex(data.pageIndex - 1)}
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <p className="text-sm -mt-0.5">Previous</p>
      </Pagination.PrevButton>
      <nav className="flex justify-center flex-grow">
        <ul className="flex items-center gap-0.5">
          <Pagination.PageButton
            activeClassName="bg-[#0291E5] text-white"
            inactiveClassName="bg-white text-[#667085] hover:text-primary-500"
            className={cn(
              "w-8 h-8 rounded-lg inline-flex items-center justify-center text-sm",
              "border border-transparent focus:outline-none cursor-pointer",
              "focus-visible:ring-2 focus-visible:border-primary-500 focus-visible:ring-primary-100",
              "transition ease-out duration-200"
            )}
          />
        </ul>
      </nav>
      <Pagination.NextButton
        className={buttonClassNames}
        disabled={data.pageIndex === data.totalPages-1}
        onClick={() => setPageIndex(data.pageIndex - 1)}
      >
        <p className="text-sm -mt-0.5">Next</p>
        <ArrowRightIcon className="w-4 h-4" />
      </Pagination.NextButton>
    </Pagination>
  );
};
