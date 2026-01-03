export default function JobCategorySkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      <div className="mb-6">
        <div className="skeleton h-[300px] w-full" />
      </div>
      <div className="mx-auto max-w-[500px] rounded-md flex justify-center items-center">
        <div className="skeleton h-10 w-full" />
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="skeleton h-[100px] w-full" />
          <div className="skeleton h-[100px] w-full" />
          <div className="skeleton h-[100px] w-full" />
          <div className="skeleton h-[100px] w-full" />
          <div className="skeleton h-[100px] w-full" />
          <div className="skeleton h-[100px] w-full" />
        </div>
      </div>
    </div>
  );
}
