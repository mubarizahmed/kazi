import HashLoader from "react-spinners/HashLoader";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <HashLoader color="rgb(var(--color-klight))" />
    </div>
  );
}
