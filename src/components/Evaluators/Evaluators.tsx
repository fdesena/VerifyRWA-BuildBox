import Link from "next/link";
import { Evaluator } from "../Dashboard/E-commerce";

const Evaluators: React.FC<{ evaluators: Evaluator[] }> = ({ evaluators }) => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
      Evaluation ranking
      </h4>

      <div>
        {evaluators.map((evaluator, key) => (
          <Link
            href="/"
            className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {evaluator.name}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {evaluator.email}
                  </span>
                </p>
              </div>
              {evaluator.avaliacoes !== 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {evaluator.avaliacoes}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Evaluators;
