interface buttonProps{
    text:string
}

export default function Button({ text }:buttonProps) {
  return (
    <button
      type="submit"
      className="btn btn-primary w-100"
    >
      {text}
    </button>
  );
}