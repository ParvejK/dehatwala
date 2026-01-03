import { RefreshCw } from "lucide-react";

interface NoDataFoundProps {
  message?: string;
  onRefresh?: () => void;
}

export default function NoDataFound({ message = "No data found", onRefresh }: NoDataFoundProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <div className="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-10 h-10 stroke-current">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <p className="text-lg">{message}</p>
        {onRefresh && (
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
