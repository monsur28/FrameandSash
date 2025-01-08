export default function Submission({ onPrevious, onNext }) {
  return (
    <div className="h-[500px] p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Is Published?</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="published" value="yes" defaultChecked />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="published" value="no" />
              <span>No</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Approved</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="approved" value="yes" defaultChecked />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="approved" value="no" />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onPrevious}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-teal-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
