export default function JobDetailSkelton() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 mb-[100px]">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <div className="skeleton w-24 h-24 mx-auto rounded-md" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">
            <div className="skeleton w-full h-10"></div>
          </h1>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="skeleton w-full h-10"></div>
              </div>
              <div>
                <div className="skeleton w-full h-10"></div>
              </div>
              <div>
                <div className="skeleton w-full h-10"></div>
              </div>
              <div>
                <div className="skeleton w-full h-10"></div>
              </div>
              <div>
                <div className="skeleton w-full h-10"></div>
              </div>
              <div>
                <div className="skeleton w-full h-10"></div>
              </div>
              <div>
                <div className="skeleton w-full h-10"></div>
              </div>
            </div>
            <div>
              <div className="skeleton w-full h-10"></div>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <div className="skeleton w-full h-10"></div>
            <div className="skeleton w-full h-10"></div>
            <div className="skeleton w-full h-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
