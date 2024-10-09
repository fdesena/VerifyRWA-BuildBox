import React from "react";
import { Evaluation } from "../Dashboard/E-commerce";
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from "react-tooltip";

type TableOneProps = {
  evaluations: Evaluation[];
};

const TableOne: React.FC<TableOneProps> = ({ evaluations }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-2 pb-2 pt-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:pb-1">
      <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Evaluations
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-1 xl:p-3">
            <h5 className="text-xs font-medium uppercase xsm:text-sm">
              Asset Link
            </h5>
          </div>
          <div className="p-1 text-center xl:p-3">
            <h5 className="text-xs font-medium uppercase xsm:text-sm">
              Payment Info
            </h5>
          </div>
          <div className="p-1 text-center xl:p-3">
            <h5 className="text-xs font-medium uppercase xsm:text-sm">
              Score
            </h5>
          </div>
          <div className="hidden p-1 text-center sm:block xl:p-3">
            <h5 className="text-xs font-medium uppercase xsm:text-sm">
              Token Address
            </h5>
          </div>
          <div className="hidden p-1 text-center sm:block xl:p-3">
            <h5 className="text-xs font-medium uppercase xsm:text-sm">
              Comments
            </h5>
          </div>
        </div>

        {evaluations.map((evaluation, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${key === evaluations.length - 1
              ? ""
              : "border-b border-stroke dark:border-strokedark"
              }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-1 xl:p-3">
              <a
                href={evaluation.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden text-black dark:text-white sm:block truncate"
              >
                {evaluation.officialWebsite}
              </a>
            </div>

            <div className="flex items-center justify-center p-1 xl:p-3">
              <p className="text-black dark:text-white">{evaluation.paymentInfoAvailable ? "Yes" : "No"}</p>
            </div>

            <div className="flex items-center justify-center p-1 xl:p-3">
              <p className="text-meta-3">{evaluation.trustScore}</p>
            </div>

            <div className="hidden items-center justify-center p-1 sm:flex xl:p-3">
              <p className="text-black dark:text-white truncate">{evaluation.rwaTokenAddress}</p>
            </div>

            <div className="hidden items-center justify-center p-1 sm:flex xl:p-3 group relative">
              <p
                className="text-meta-5 truncate"
                data-tip={evaluation.comments}
                data-for={`comment-tooltip-${key}`}
              >
                {evaluation.comments.length > 30
                  ? evaluation.comments.substring(0, 30) + "..."
                  : evaluation.comments}
              </p>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max max-w-xs p-2 text-sm text-black bg-white rounded-md shadow-lg z-50 hidden group-hover:block">
                {evaluation.comments}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
