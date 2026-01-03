export default function JobCardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-center items-center h-[200px] bg-gray-200 mb-10 rounded-md">
        <h2 className="text-2xl font-bold text-center">Apply the best suitable Jobs for you</h2>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-32 w-full" />
          <div className="skeleton h-32 w-full" />
          <div className="skeleton h-32 w-full" />
          <div className="skeleton h-32 w-full" />
        </div>
        <div className="mt-6 flex justify-center items-center">
          <div className="skeleton h-[50px] w-[200px]" />
        </div>
      </div>
    </div>
  );
}
