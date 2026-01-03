const CommentForm = () => {
  return (
    <div>
      <form className="space-y-6">
        <input type="text" placeholder="Email" className="input input-bordered w-full max-w-xs" />
        <textarea className="textarea textarea-bordered w-full" placeholder="Comments"></textarea>
        <button className="btn btn-primary w-full md:w-auto">Submit</button>
      </form>
    </div>
  );
};

export default CommentForm;
